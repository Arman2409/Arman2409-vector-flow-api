import type { Request } from 'express';

export interface RequestWithContext<T = Record<string, unknown>> extends Request {
    id?: string;
    body: T;
}