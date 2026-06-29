'use client';
import { useState } from 'react';
import { CalendarDays, Clock, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type TimeSlot = {
  time: string;
  label: string;
  available: boolean;
};

type SlotsResponse = {
  date: string;
  day: string;
  slots: TimeSlot[];
  availableCount: number;
  bookedCount: number;
  message?: string;
};

export function BookingForm() {
  const [step, setStep] = useState<'form' | 'slots' | 'done' | 'error'>('form');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [slotsData, setSlotsData] = useState<SlotsResponse | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Get tomorrow as min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  // Check slots when user picks date
  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/v1/book/slots?date=${date}`);
      if (!res.ok) throw new Error('Failed to load slots');
      const data: SlotsResponse = await res.json();
      setSlotsData(data);
      if (data.slots.length > 0 && data.availableCount > 0) {
        setStep('slots');
      } else {
        setStep('slots'); // will show "no slots" message
      }
    } catch (err) {
      setErrorMsg('Could not load available times. Please try again.');
      setSlotsData(null);
    } finally {
      setLoading(false);
    }
  };

  // Book the call
  const handleBook = async () => {
    if (!selectedTime) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/v1/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, date: selectedDate, time: selectedTime, note: note || undefined }),
      });

      if (res.ok) {
        setStep('done');
      } else {
        const err = await res.json();
        if (res.status === 409) {
          // Slot was just taken by someone else — refresh slots
          setErrorMsg('This slot was just booked. Please choose another time.');
          handleDateChange(selectedDate);
        } else {
          setErrorMsg(err.message || 'Booking failed. Please try again.');
        }
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setStep('form');
    setName('');
    setEmail('');
    setPhone('');
    setNote('');
    setSelectedDate('');
    setSelectedTime('');
    setSlotsData(null);
    setErrorMsg('');
  };

  return (
    <div className="w-full rounded-xl bg-surface p-6">
      {step === 'form' && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="book-name" className="mb-1 block text-sm font-medium">Name *</label>
              <Input id="book-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
            </div>
            <div>
              <label htmlFor="book-email" className="mb-1 block text-sm font-medium">Email *</label>
              <Input id="book-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>
          </div>
          <div>
            <label htmlFor="book-phone" className="mb-1 block text-sm font-medium">WhatsApp / Phone *</label>
            <Input id="book-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+62 812 3456 7890" required />
          </div>
          <div>
            <label htmlFor="book-date" className="mb-1 block text-sm font-medium">Preferred Date *</label>
            <Input id="book-date" type="date" min={minDate} max={maxDate} value={selectedDate} onChange={(e) => handleDateChange(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="book-note" className="mb-1 block text-sm font-medium">Project Brief (optional)</label>
            <Textarea id="book-note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Tell us briefly about your project..." />
          </div>
          {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
        </div>
      )}

      {step === 'slots' && (
        <div className="space-y-4">
          {slotsData?.slots.length === 0 || slotsData?.availableCount === 0 ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 text-center">
              <AlertCircle className="mx-auto mb-2 size-6 text-amber-400" />
              <p className="font-medium text-foreground">No available slots on this date</p>
              <p className="mt-1 text-sm text-muted-foreground">{slotsData?.message || 'Please select another date.'}</p>
              <Button variant="secondary" onClick={() => setStep('form')} className="mt-4 rounded-full">
                ← Choose another date
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setStep('form')} className="rounded-full">
                  <ArrowLeft className="mr-1 size-3" /> Back
                </Button>
                <div className="text-sm">
                  <span className="font-medium">{slotsData?.day}, {selectedDate}</span>
                  <span className="ml-2 text-muted-foreground">
                    ({slotsData?.availableCount} slot{slotsData?.availableCount !== 1 ? 's' : ''} available)
                  </span>
                </div>
              </div>

              <div className="grid gap-2">
                {slotsData?.slots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => { setSelectedTime(slot.time); }}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      selectedTime === slot.time
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : slot.available
                          ? 'border-border bg-card hover:border-primary/40'
                          : 'cursor-not-allowed border-border/50 bg-card/50 opacity-40'
                    }`}
                  >
                    <Clock className={`size-5 ${selectedTime === slot.time ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${slot.available ? '' : 'line-through'}`}>{slot.label}</p>
                    </div>
                    {!slot.available && (
                      <span className="text-xs text-muted-foreground">Booked</span>
                    )}
                    {slot.available && (
                      <span className={`text-xs ${selectedTime === slot.time ? 'text-primary' : 'text-muted-foreground'}`}>
                        Available
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}

              <Button
                onClick={handleBook}
                disabled={!selectedTime || loading}
                className="w-full rounded-full"
              >
                {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                {loading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </>
          )}
        </div>
      )}

      {step === 'done' && (
        <div className="rounded-xl border border-success/30 bg-success/5 p-8 text-center">
          <CheckCircle className="mx-auto mb-3 size-10 text-success" />
          <h3 className="text-xl font-semibold text-foreground">Discovery Call Scheduled!</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We've sent a confirmation to <strong>{email}</strong>.
            Check your email for details and a calendar link.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarDays className="size-4" /> {selectedDate}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="size-4" /> {selectedTime} WIB
            </div>
          </div>
          <Button variant="secondary" onClick={resetForm} className="mt-6 rounded-full">
            Book another call
          </Button>
        </div>
      )}
    </div>
  );
}
