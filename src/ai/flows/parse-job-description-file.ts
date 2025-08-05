'use server';

/**
 * @fileOverview An AI agent for parsing and structuring job descriptions from file content.
 *
 * - parseJobDescriptionFile - A function that handles parsing content from a file.
 * - ParseJobDescriptionFileInput - The input type for the parseJobDescriptionFile function.
 * - ParseJobDescriptionFileOutput - The return type for the parseJobDescriptionFile function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ParseJobDescriptionFileInputSchema = z.object({
  fileContent: z.string().describe('The raw text content extracted from a job description file (e.g., PDF or DOCX).'),
});
export type ParseJobDescriptionFileInput = z.infer<typeof ParseJobDescriptionFileInputSchema>;

const ParseJobDescriptionFileOutputSchema = z.object({
  companyName: z.string().describe('The name of the company hiring for the role.'),
  aboutCompany: z.string().describe('A brief description about the company.'),
  jobTitle: z.string().describe('The title of the job role. If not found, suggest one based on content.'),
  requiredExperience: z.string().describe('The required years or level of experience.'),
  requiredSkills: z.array(z.string()).describe('A list of essential skills for the job.'),
  rolesAndResponsibilities: z.array(z.string()).describe('A list of the key responsibilities for the role.'),
  salaryPackage: z.string().describe('The compensation or salary package mentioned. If not found, state "Not Mentioned".'),
  location: z.string().describe('The work location for the job (e.g., city, remote). If not found, state "Not Mentioned".'),
  otherInfo: z.string().describe('Any other relevant information, or suggestions for missing but important details (like benefits, soft skills, etc.).'),
});
export type ParseJobDescriptionFileOutput = z.infer<typeof ParseJobDescriptionFileOutputSchema>;

export async function parseJobDescriptionFile(input: ParseJobDescriptionFileInput): Promise<ParseJobDescriptionFileOutput> {
  return parseJobDescriptionFileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseJobDescriptionFilePrompt',
  input: { schema: ParseJobDescriptionFileInputSchema },
  output: { schema: ParseJobDescriptionFileOutputSchema },
  prompt: `You are an expert HR assistant. You have been given the raw text from a job description document.
Your task is to read, understand, and extract the key information, then rephrase and structure it professionally.

Analyze the following document content:
---
{{{fileContent}}}
---

Please perform the following actions:
1.  Clean up the text for clarity, grammar, and proper formatting.
2.  Extract the information and structure it into the defined output format.
3.  For list-based fields like "Required Skills" and "Roles and Responsibilities", ensure each item is a separate string in the array.
4.  If critical information like Job Title, Experience, or Skills is missing, try to infer it from the context or state that it's "Not Mentioned".
5.  Under "otherInfo", add suggestions for any missing but relevant points that are typically included in a professional job description (e.g., benefits, company culture, soft skills).
6.  Ensure the final output is concise and suitable for a job listing portal.
`,
});

const parseJobDescriptionFileFlow = ai.defineFlow(
  {
    name: 'parseJobDescriptionFileFlow',
    inputSchema: ParseJobDescriptionFileInputSchema,
    outputSchema: ParseJobDescriptionFileOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
