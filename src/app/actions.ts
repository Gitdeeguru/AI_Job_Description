'use server';

import { generateJobDescription as genJobDesc, GenerateJobDescriptionInput, GenerateJobDescriptionOutput } from '@/ai/flows/generate-job-description';
import { regenerateJobDescription as regenJobDesc, RegenerateJobDescriptionInput, RegenerateJobDescriptionOutput } from '@/ai/flows/regenerate-job-description';
import { analyzeJobDescription as analyzeJobDesc, AnalyzeJobDescriptionInput, AnalyzeJobDescriptionOutput } from '@/ai/flows/analyze-job-description';
import { chat as performChat } from '@/ai/flows/chatbot';
import { ChatInput, ChatOutput } from '@/lib/types';
import { parseJobDescriptionFile as parseJobDescFile, ParseJobDescriptionFileInput, ParseJobDescriptionFileOutput } from '@/ai/flows/parse-job-description-file';


export async function generateJobDescription(input: GenerateJobDescriptionInput): Promise<GenerateJobDescriptionOutput> {
  return await genJobDesc(input);
}

export async function regenerateJobDescription(input: RegenerateJobDescriptionInput): Promise<RegenerateJobDescriptionOutput> {
  return await regenJobDesc(input);
}

export async function analyzeJobDescription(input: AnalyzeJobDescriptionInput): Promise<AnalyzeJobDescriptionOutput> {
    return await analyzeJobDesc(input);
}

export async function chat(input: ChatInput): Promise<ChatOutput> {
    return await performChat(input);
}

export async function parseJobDescriptionFile(input: ParseJobDescriptionFileInput): Promise<ParseJobDescriptionFileOutput> {
    return await parseJobDescFile(input);
}
