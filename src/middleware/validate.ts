import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

type Target = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, target: Target = 'body') {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[target]);
        if (!result.success) {
            const errors = (result.error as ZodError).issues.map(err => ({
                path: err.path.join('.'),
                message: err.message
            }));
            res.status(400).json({ error: 'Validation failed', details: errors });
            return;
        }
        req[target] = result.data; // Replace with parsed data
        next();
    };
}   