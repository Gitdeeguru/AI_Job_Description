'use server';

import { generateJobDescription as genJobDesc, GenerateJobDescriptionInput, GenerateJobDescriptionOutput } from '@/ai/flows/generate-job-description';
import { regenerateJobDescription as regenJobDesc, RegenerateJobDescriptionInput, RegenerateJobDescriptionOutput } from '@/ai/flows/regenerate-job-description';
import { analyzeJobDescription as analyzeJobDesc, AnalyzeJobDescriptionInput, AnalyzeJobDescriptionOutput } from '@/ai/flows/analyze-job-description';


export async function generateJobDescription(input: GenerateJobDescriptionInput): Promise<GenerateJobDescriptionOutput> {
  return await genJobDesc(input);
}

export async function regenerateJobDescription(input: RegenerateJobDescriptionInput): Promise<RegenerateJobDescriptionOutput> {
  return await regenJobDesc(input);
}

export async function analyzeJobDescription(input: AnalyzeJobDescriptionInput): Promise<AnalyzeJobDescriptionOutput> {
    return await analyzeJobDesc(input);
}
