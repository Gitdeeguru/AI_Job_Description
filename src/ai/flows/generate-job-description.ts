'use server';

/**
 * @fileOverview A job description generation AI agent.
 *
 * - generateJobDescription - A function that handles the job description generation process.
 * - GenerateJobDescriptionInput - The input type for the generateJobDescription function.
 * - GenerateJobDescriptionOutput - The return type for the generateJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJobDescriptionInputSchema = z.object({
  roleTitle: z.string().describe('The title of the job role.'),
  experience: z.string().describe('The experience level required for the job (e.g., 2-5 years).'),
  location: z.string().describe('The location of the job (e.g., Remote/Bangalore).'),
  keySkills: z.string().describe('A comma-separated list of key skills required for the job (e.g., React, Node.js).'),
});
export type GenerateJobDescriptionInput = z.infer<typeof GenerateJobDescriptionInputSchema>;

const GenerateJobDescriptionOutputSchema = z.object({
  jobDescription: z.string().describe('The generated job description.'),
});
export type GenerateJobDescriptionOutput = z.infer<typeof GenerateJobDescriptionOutputSchema>;

export async function generateJobDescription(input: GenerateJobDescriptionInput): Promise<GenerateJobDescriptionOutput> {
  return generateJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJobDescriptionPrompt',
  input: {schema: GenerateJobDescriptionInputSchema},
  output: {schema: GenerateJobDescriptionOutputSchema},
  prompt: `You are an expert HR assistant specializing in writing job descriptions.

You will use the information provided to generate a compelling job description for the role. Please structure the output with clear sections and use bullet points for lists of responsibilities and qualifications.

Role Title: {{{roleTitle}}}
Experience: {{{experience}}}
Location: {{{location}}}
Key Skills: {{{keySkills}}}

Job Description (in point format):`,
});

const generateJobDescriptionFlow = ai.defineFlow(
  {
    name: 'generateJobDescriptionFlow',
    inputSchema: GenerateJobDescriptionInputSchema,
    outputSchema: GenerateJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
