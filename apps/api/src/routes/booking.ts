import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../lib/db';
import { rateLimit } from '../middleware/rateLimit';
import { sendBookingConfirmation, sendBookingNotification } from '../lib/email';

const app = new Hono();

/* ── Slot configuration ── */
const BUSINESS_HOURS = [9, 10, 11, 13, 14, 15, 16]; // 09:00-17:00 with lunch break 12:00
const SLOT_DURATION_MINUTES = 30;
const MAX_SLOTS_PER_DAY = 3; // max 3 discovery calls per day
const TIMEZONE = 'Asia/Jakarta';

const bookingSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email().max(255),
  phone: z.string().min(8).max(30),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  note: z.string().max(500).optional(),
});

/* ── Get available slots for a date ── */
app.get('/slots', async (c) => {
  const date = c.req.query('date');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return c.json({ error: 'Invalid date format. Use YYYY-MM-DD', status: 400 }, 400);
  }

  // Check if date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const requestedDate = new Date(date + 'T00:00:00');
  if (requestedDate < today) {
    return c.json({ error: 'Cannot book in the past', status: 400 }, 400);
  }

  // Check if date is too far (max 30 days ahead)
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30);
  if (requestedDate > maxDate) {
    return c.json({ error: 'Can only book up to 30 days ahead', status: 400 }, 400);
  }

  // Get existing bookings for this date
  const bookings = await db.query(
    "SELECT time_slot FROM call_bookings WHERE date = $1 AND status != 'cancelled'",
    [date],
  );
  const bookedSlots = new Set(bookings.rows.map((r: any) => r.time_slot));

  // Build available slots
  const dayName = requestedDate.toLocaleDateString('en-US', { weekday: 'long' });
  const isWeekend = dayName === 'Saturday' || dayName === 'Sunday';

  let slots: { time: string; available: boolean; label: string }[] = [];

  if (isWeekend) {
    return c.json({
      date,
      day: dayName,
      slots: [],
      message: 'Weekend — please select a weekday (Monday–Friday).',
    });
  }

  slots = BUSINESS_HOURS.map((hour) => {
    const time = `${String(hour).padStart(2, '0')}:00`;
    const label = `${String(hour).padStart(2, '0')}:00 - ${String(hour).padStart(2, '0')}:30 WIB`;
    return { time, label, available: !bookedSlots.has(time) };
  });

  // Count total booked slots
  const bookedCount = bookings.rows.length;

  return c.json({
    date,
    day: dayName,
    totalSlots: slots.length,
    bookedCount,
    availableCount: slots.filter((s) => s.available).length,
    slots,
  });
});

/* ── Book a slot ── */
app.post('/',
  rateLimit,
  async (c) => {
    try {
      const body = await c.req.json();
      const parsed = bookingSchema.safeParse(body);

      if (!parsed.success) {
        return c.json({
          error: 'Validation Error',
          status: 422,
          details: parsed.error.issues.map(i => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        }, 422);
      }

      const { name, email, phone, date, time, note } = parsed.data;

      // Validate slot is available
      const existing = await db.queryOne(
        "SELECT id FROM call_bookings WHERE date = $1 AND time_slot = $2 AND status != 'cancelled'",
        [date, time],
      );

      if (existing) {
        return c.json({
          error: 'Slot already booked',
          status: 409,
          message: 'This time slot has already been booked. Please choose another time.',
        }, 409);
      }

      // Validate slot is within business hours
      const hour = parseInt(time.split(':')[0]);
      if (!BUSINESS_HOURS.includes(hour)) {
        return c.json({ error: 'Invalid time slot', status: 400 }, 400);
      }

      // Save booking
      const ip = c.req.header('x-forwarded-for') || 'unknown';
      const ua = c.req.header('user-agent') || '';
      const result = await db.query(
        `INSERT INTO call_bookings (name, email, phone, date, time_slot, note, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, date, time_slot, created_at`,
        [name, email, phone, date, time, note || null, ip, ua],
      );
      const booking = result.rows[0];

      // Async notifications
      Promise.allSettled([
        sendBookingConfirmation({ name, email, date, time }),
        sendBookingNotification({ name, email, phone, date, time, note }),
      ]).catch(e => console.error('Booking notification error:', e));

      return c.json({
        success: true,
        message: 'Your discovery call has been scheduled! Check your email for confirmation.',
        booking,
      });
    } catch (err) {
      console.error('Booking error:', err);
      return c.json({ error: 'Internal Server Error', status: 500 }, 500);
    }
  },
);

export { app as bookingRoutes };
