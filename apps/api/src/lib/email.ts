import { db } from './db';

export async function sendAdminNotification(data: { name: string; email: string; company: string; phone?: string; message: string }, submissionId: string) {
  if (!process.env.RESEND_API_KEY) return;

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.RESEND_FROM || 'hello@weecommerce.web.id',
    to: process.env.ADMIN_EMAIL || 'hello@weecommerce.web.id',
    subject: `New inquiry from ${data.name}`,
    html: `<h2>New contact form submission</h2>
           <p><strong>Name:</strong> ${esc(data.name)}</p>
           <p><strong>Email:</strong> ${esc(data.email)}</p>
           <p><strong>Company:</strong> ${esc(data.company)}</p>
           <p><strong>Phone:</strong> ${esc(data.phone || 'N/A')}</p>
           <p><strong>Message:</strong></p><p>${esc(data.message).replace(/\n/g, '<br>')}</p>
           <hr><p><small>ID: ${submissionId}</small></p>`,
  });
}

export async function sendAutoReply(data: { name: string; email: string }) {
  if (!process.env.RESEND_API_KEY) return;

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.RESEND_FROM || 'hello@weecommerce.web.id',
    to: data.email,
    subject: `Thanks for reaching out, ${data.name}!`,
    html: `<p>Hi ${esc(data.name)},</p>
           <p>Thanks for your interest in WeeCommerce. We've received your message and will get back to you within 24 hours.</p>
           <p>Best regards,<br>The WeeCommerce Team</p>`,
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  if (!process.env.RESEND_API_KEY) return;

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.RESEND_FROM || 'hello@weecommerce.web.id',
    to: email,
    subject: 'Confirm your subscription',
    html: `<p>Click <a href="https://weecommerce.web.id/api/v1/newsletter/verify?token=${token}">here</a> to confirm your subscription.</p>`,
  });
}

export async function dispatchWebhook(data: { name: string; email: string; company: string; message: string }, submissionId: string) {
  if (!process.env.WEBHOOK_URL) return;

  const payload = {
    event: 'contact_form.submitted',
    timestamp: new Date().toISOString(),
    source: 'weecommerce.web.id',
    data: { id: submissionId, name: data.name, email: data.email, company: data.company, message: data.message },
  };

  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Webhook-Event': 'contact_form.submitted' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await logAction(submissionId, 'webhook_dispatched', 'webhook_n8n', 'success');
        return;
      }

      if (res.status >= 400 && res.status < 500) {
        await logAction(submissionId, 'webhook_failed', 'webhook_n8n', 'failed', `Client error ${res.status}`);
        return;
      }
    } catch (err) {
      if (attempt === 4) {
        await logAction(submissionId, 'webhook_failed', 'webhook_n8n', 'failed', (err as Error).message);
      } else {
        await logAction(submissionId, 'webhook_retry', 'webhook_n8n', 'retrying');
        await new Promise(r => setTimeout(r, [5000, 30000, 300000][attempt - 1]));
      }
    }
  }
}

async function logAction(sid: string, action: string, channel: string, status: string, errorMessage?: string) {
  try {
    await db.query(
      `INSERT INTO submission_logs (submission_id, action, channel, status, error_message) VALUES ($1, $2, $3, $4, $5)`,
      [sid, action, channel, status, errorMessage || null],
    );
  } catch { /* best-effort */ }
}

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function sendBookingConfirmation(data: { name: string; email: string; date: string; time: string }) {
  if (!process.env.RESEND_API_KEY) return;
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.RESEND_FROM || 'hello@weecommerce.web.id',
    to: data.email,
    subject: `Discovery Call Confirmed — ${data.date} at ${data.time}`,
    html: `<p>Hi ${esc(data.name)},</p>
           <p>Your 30-minute discovery call with WeeCommerce has been scheduled.</p>
           <p><strong>Date:</strong> ${esc(data.date)}<br>
           <strong>Time:</strong> ${esc(data.time)} WIB</p>
           <p>We'll send a reminder 24 hours before the call. In the meantime, feel free to check our <a href="https://weecommerce.web.id/portfolio">portfolio</a>.</p>
           <p>Best regards,<br>The WeeCommerce Team</p>`,
  });
}

export async function sendBookingNotification(data: { name: string; email: string; phone: string; date: string; time: string; note?: string }) {
  if (!process.env.RESEND_API_KEY) return;
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.RESEND_FROM || 'hello@weecommerce.web.id',
    to: process.env.ADMIN_EMAIL || 'hello@weecommerce.web.id',
    subject: `New discovery call booking — ${data.name}`,
    html: `<h2>New Discovery Call</h2>
           <p><strong>Name:</strong> ${esc(data.name)}</p>
           <p><strong>Email:</strong> ${esc(data.email)}</p>
           <p><strong>Phone:</strong> ${esc(data.phone)}</p>
           <p><strong>Date:</strong> ${esc(data.date)}</p>
           <p><strong>Time:</strong> ${esc(data.time)} WIB</p>
           ${data.note ? `<p><strong>Note:</strong> ${esc(data.note)}</p>` : ''}`,
  });
}
