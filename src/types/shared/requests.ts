import type { Request } from 'express';

export interface RequestWithContext<T = unknown> extends Request {
    id?: string;
    body: T;
}