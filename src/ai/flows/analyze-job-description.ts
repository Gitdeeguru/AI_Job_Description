'use server';

/**
 * @fileOverview An AI agent for analyzing and improving job descriptions.
 *
 * - analyzeJobDescription - A function that handles the job description analysis process.
 * - AnalyzeJobDescriptionInput - The input type for the analyzeJobDescription function.
 * - AnalyzeJobDescriptionOutput - The return type for the analyzeJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeJobDescriptionInputSchema = z.object({
  jobDescription: z.string().describe('The job description text to analyze.'),
});
export type AnalyzeJobDescriptionInput = z.infer<typeof AnalyzeJobDescriptionInputSchema>;

const AnalyzeJobDescriptionOutputSchema = z.object({
  structuredContent: z.string().describe('The job description converted into well-structured markdown with bullet points.'),
  recommendations: z.string().describe('AI-generated recommendations to improve the job description.'),
});
export type AnalyzeJobDescriptionOutput = z.infer<typeof AnalyzeJobDescriptionOutputSchema>;

export async function analyzeJobDescription(input: AnalyzeJobDescriptionInput): Promise<AnalyzeJobDescriptionOutput> {
  return analyzeJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeJobDescriptionPrompt',
  input: {schema: AnalyzeJobDescriptionInputSchema},
  output: {schema: AnalyzeJobDescriptionOutputSchema},
  prompt: `You are an expert HR copywriter. Your task is to analyze a job description and improve it.

Analyze the following job description:
---
{{{jobDescription}}}
---

Based on your analysis, provide the following:

1.  **structuredContent**: Convert the original job description into a well-structured document using markdown. Use headings (e.g., "## Key Responsibilities") and bullet points for lists. Ensure the output is a single formatted string.
2.  **recommendations**: Provide actionable recommendations to enhance the quality of the job description. Focus on clarity, inclusivity, and impact.
`,
});

const analyzeJobDescriptionFlow = ai.defineFlow(
  {
    name: 'analyzeJobDescriptionFlow',
    inputSchema: AnalyzeJobDescriptionInputSchema,
    outputSchema: AnalyzeJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
