// src/auth/types.ts
import { Request as ExpressRequest } from 'express';

export interface UserPayload {
  userId: number;
  username: string;
}

export interface RequestWithUser extends ExpressRequest {
  user: UserPayload;
}