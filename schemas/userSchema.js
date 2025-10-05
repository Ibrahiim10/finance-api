import { z } from 'zod';

export const createUserSchema = z.object({

    name: z.string().min(2, 'Name must be at least 2 characters long'),

    email: z.string().email('Invalid email address'),

    password: z.string()
        .min(6, 'Password must be at least 6 characters long')
        .max(50, 'Password must be at most 50 characters long')
    // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    // .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    // .regex(/[0-9]/, 'Password must contain at least one number')
    // .regex(/[\W_]/, 'Password must contain at least one special character'),


})