import { z } from 'zod';

export interface User {
  name: string;
  email: string;
  initials: string;
  avatarUrl?: string;
  password?: string;
}

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
