import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email().max(255),
  company: z.string().min(2).max(255),
  message: z.string().min(20).max(5000),
  phone: z.string().max(30).optional().or(z.literal('')),
  serviceInterest: z.enum(['launch', 'convert', 'scale', 'integrate']).optional(),
  turnstileToken: z.string().min(1),
  _hp_field: z.string().max(0).optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().max(255).optional(),
  turnstileToken: z.string().min(1),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
