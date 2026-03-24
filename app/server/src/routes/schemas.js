import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2).max(80),
  pin: z.string().regex(/^\d{4}$/).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const entrySchema = z.object({
  title: z.string().max(120).optional(),
  content: z.string().min(1).max(8000),
  entryDate: z.string().date().optional(),
  moodId: z.number().int().positive().nullable().optional(),
  tags: z.array(z.string().min(1).max(30)).max(10).optional(),
  isLocked: z.boolean().optional()
});

export const reminderSchema = z.object({
  reminderEnabled: z.boolean(),
  reminderTime: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional()
});
