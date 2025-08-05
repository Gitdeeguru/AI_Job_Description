'use client'; // This file is now for types, which can be used on the client.

import type { GenerateJobDescriptionInput, GenerateJobDescriptionOutput } from '@/ai/flows/generate-job-description';
import type { RegenerateJobDescriptionInput, RegenerateJobDescriptionOutput } from '@/ai/flows/regenerate-job-description';
import type { AnalyzeJobDescriptionInput, AnalyzeJobDescriptionOutput } from '@/ai/flows/analyze-job-description';
import type { ChatInput, ChatOutput } from '@/lib/types';
import type { ParseJobDescriptionFileInput, ParseJobDescriptionFileOutput } from '@/ai/flows/parse-job-description-file';

// Re-exporting types is fine for client components
export type {
  GenerateJobDescriptionInput,
  GenerateJobDescriptionOutput,
  RegenerateJobDescriptionInput,
  RegenerateJobDescriptionOutput,
  AnalyzeJobDescriptionInput,
  AnalyzeJobDescriptionOutput,
  ChatInput,
  ChatOutput,
  ParseJobDescriptionFileInput,
  ParseJobDescriptionFileOutput,
};
