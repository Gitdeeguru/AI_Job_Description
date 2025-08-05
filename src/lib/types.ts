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

export const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).optional(),
  message: z.string().describe("The user's current message."),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputSchema = z.object({
  response: z.string().describe("The chatbot's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;
