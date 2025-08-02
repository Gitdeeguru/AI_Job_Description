'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RegenerateJobDescriptionInputSchema = z.object({
  roleTitle: z.string().describe('The title of the role.'),
  experience: z.string().describe('The experience level required for the role (e.g., 2-5 years).'),
  location: z.string().describe('The location of the job (e.g., Remote/Bangalore).'),
  keySkills: z.string().describe('A comma-separated list of key skills required for the role (e.g., React, Node.js).'),
  companyName: z.string().describe('The name of the company.'),
  aboutCompany: z.string().describe('A brief description of the company.'),
  originalDescription: z.string().describe('The original job description to regenerate with variations.'),
});
export type RegenerateJobDescriptionInput = z.infer<typeof RegenerateJobDescriptionInputSchema>;

const RegenerateJobDescriptionOutputSchema = z.object({
  jobDescription: z.string().describe('The regenerated job description with slight variations.'),
});
export type RegenerateJobDescriptionOutput = z.infer<typeof RegenerateJobDescriptionOutputSchema>;

export async function regenerateJobDescription(input: RegenerateJobDescriptionInput): Promise<RegenerateJobDescriptionOutput> {
  return regenerateJobDescriptionFlow(input);
}

const regenerateJobDescriptionPrompt = ai.definePrompt({
  name: 'regenerateJobDescriptionPrompt',
  input: {schema: RegenerateJobDescriptionInputSchema},
  output: {schema: RegenerateJobDescriptionOutputSchema},
  prompt: `You are an expert HR assistant, skilled at writing job descriptions.

You are provided with an existing job description, and your job is to rewrite it with slight variations in phrasing.  Do not change the meaning of the job description, but rephrase it to provide some variety to the user.

Original Job Description: {{{originalDescription}}}

Company Name: {{{companyName}}}
About Company: {{{aboutCompany}}}
Role Title: {{{roleTitle}}}
Experience: {{{experience}}}
Location: {{{location}}}
Key Skills: {{{keySkills}}}

Regenerated Job Description:`, 
});

const regenerateJobDescriptionFlow = ai.defineFlow(
  {
    name: 'regenerateJobDescriptionFlow',
    inputSchema: RegenerateJobDescriptionInputSchema,
    outputSchema: RegenerateJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await regenerateJobDescriptionPrompt(input);
    return output!;
  }
);
