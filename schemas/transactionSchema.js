import { z } from 'zod';

export const transactionValidationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    amount: z.number({ required_error: "Amount is required" }),
    status: z.enum(['income', 'expense'], {
        required_error: "Status is required"
    }),
    category: z.string().min(1, "Category is required"),
    date: z.string().refine(
        (val) => !isNaN(Date.parse(val)),
        { message: "Invalid date format" }
    )
});
