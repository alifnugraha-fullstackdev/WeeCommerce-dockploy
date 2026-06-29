import { Hono } from 'hono';
import { db } from '../lib/db';
import { contactSchema } from '../schemas/contact';
import { sendAdminNotification, sendAutoReply, dispatchWebhook } from '../lib/email';
import { verifyTurnstile } from './newsletter';
import { rateLimit } from '../middleware/rateLimit';

const app = new Hono();

app.post('/contact',
  rateLimit,
  async (c) => {
    try {
      const body = await c.req.json();
      const parsed = contactSchema.safeParse(body);

      if (!parsed.success) {
        return c.json({
          error: 'Validation Error',
          status: 422,
          message: 'Please check the highlighted fields',
          details: parsed.error.issues.map(i => ({
            field: i.path.join('.'),
            code: i.code,
            message: i.message,
          })),
        }, 422);
      }

      const data = parsed.data;

      // Honeypot check
      if (data._hp_field) {
        return c.json({ success: true, message: 'Thank you!' });
      }

      // Verify Turnstile
      const ip = c.req.header('x-forwarded-for') || 'unknown';
      const captchaOk = await verifyTurnstile(data.turnstileToken, ip);
      if (!captchaOk) {
        return c.json({ error: 'CAPTCHA verification failed', status: 400 }, 400);
      }

      // Save to database
      const ua = c.req.header('user-agent') || '';
      const result = await db.query(
        `INSERT INTO form_submissions (name, email, company, message, phone, service_interest, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [data.name, data.email, data.company, data.message, data.phone || null, data.serviceInterest || null, ip, ua],
      );
      const submissionId = result.rows[0].id;

      // Log email send
      await db.query(
        `INSERT INTO submission_logs (submission_id, action, channel, status) VALUES ($1, $2, $3, $4)`,
        [submissionId, 'submission_created', 'web', 'success'],
      );

      // Async notifications (fire-and-forget)
      Promise.allSettled([
        sendAdminNotification(data, submissionId).then(() =>
          db.query(`INSERT INTO submission_logs (submission_id, action, channel, status) VALUES ($1, $2, $3, $4)`, [submissionId, 'email_sent', 'email_admin', 'success'])
        ).catch(e =>
          db.query(`INSERT INTO submission_logs (submission_id, action, channel, status, error_message) VALUES ($1, $2, $3, $4, $5)`, [submissionId, 'email_failed', 'email_admin', 'failed', e.message])
        ),
        sendAutoReply(data).then(() =>
          db.query(`INSERT INTO submission_logs (submission_id, action, channel, status) VALUES ($1, $2, $3, $4)`, [submissionId, 'email_sent', 'email_autoreply', 'success'])
        ).catch(() => {}),
        dispatchWebhook(data, submissionId),
      ]).catch(e => console.error('Async error:', e));

      return c.json({
        success: true,
        message: "Thank you! We'll get back to you within 24 hours.",
        submissionId,
      });
    } catch (err) {
      console.error('Contact form error:', err);
      return c.json({ error: 'Internal Server Error', status: 500 }, 500);
    }
  },
);

export default app;
