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
  companyName: z.string().describe('The name of the company.'),
  aboutCompany: z.string().describe('A brief description of the company.'),
  gender: z.string().describe('The gender preference for the role (male, female, or both).'),
});
export type GenerateJobDescriptionInput = z.infer<typeof GenerateJobDescriptionInputSchema>;

const GenerateJobDescriptionOutputSchema = z.object({
  jobDescription: z.string().describe('The generated job description as a single formatted string.'),
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

Generate a compelling job description based on the details provided.

The output should be a single string. Use markdown-style headings (e.g., "## About the Company") for sections and bullet points (e.g., "- item") for lists under "Key Responsibilities" and "Qualifications".

Company Name: {{{companyName}}}
About Company: {{{aboutCompany}}}
Role Title: {{{roleTitle}}}
Experience: {{{experience}}}
Location: {{{location}}}
Key Skills: {{{keySkills}}}
Gender Preference: {{{gender}}}

Job Description:`,
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
