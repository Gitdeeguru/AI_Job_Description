'use server';

import { generateJobDescription as genJobDesc, GenerateJobDescriptionInput, GenerateJobDescriptionOutput } from '@/ai/flows/generate-job-description';
import { regenerateJobDescription as regenJobDesc, RegenerateJobDescriptionInput, RegenerateJobDescriptionOutput } from '@/ai/flows/regenerate-job-description';

export async function generateJobDescription(input: GenerateJobDescriptionInput): Promise<GenerateJobDescriptionOutput> {
  return await genJobDesc(input);
}

export async function regenerateJobDescription(input: RegenerateJobDescriptionInput): Promise<RegenerateJobDescriptionOutput> {
  return await regenJobDesc(input);
}
