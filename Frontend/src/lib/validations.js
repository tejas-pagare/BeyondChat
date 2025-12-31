import { z } from 'zod';

// URL validation regex
const urlRegex = /^https?:\/\/.+/;

// Article validation schema
export const articleSchema = z.object({
    title: z
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title must not exceed 200 characters')
        .regex(/^[a-zA-Z0-9\s\-,:?!.'"]+$/, 'Title contains invalid characters'),

    original_url: z
        .string()
        .regex(urlRegex, 'Must be a valid URL starting with http:// or https://'),

    original_content: z
        .string()
        .min(50, 'Original content must be at least 50 characters')
        .max(50000, 'Original content must not exceed 50,000 characters'),

    updated_content: z
        .string()
        .max(50000, 'Updated content must not exceed 50,000 characters')
        .optional()
        .or(z.literal('')),

    references: z
        .string()
        .optional()
        .or(z.literal(''))
        .transform((val) => {
            if (!val) return [];
            return val.split(',').map(ref => ref.trim()).filter(ref => ref !== '');
        })
        .pipe(
            z.array(z.string().regex(urlRegex, 'Each reference must be a valid URL'))
                .max(10, 'Maximum 10 references allowed')
        ),
});


