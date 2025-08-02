import { config } from 'dotenv';
config();

import '@/ai/flows/generate-job-description.ts';
import '@/ai/flows/regenerate-job-description.ts';
import '@/ai/flows/analyze-job-description.ts';
import '@/ai/flows/chatbot.ts';
