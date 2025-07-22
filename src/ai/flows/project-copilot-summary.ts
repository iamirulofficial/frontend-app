'use server';

/**
 * @fileOverview An AI agent that summarizes project risks and suggests countermeasures.
 *
 * - getProjectCopilotSummary - A function that provides a summary of project risks and countermeasures.
 * - ProjectCopilotSummaryInput - The input type for the getProjectCopilotSummary function.
 * - ProjectCopilotSummaryOutput - The return type for the getProjectCopilotSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectCopilotSummaryInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  phaseData: z.string().describe('The current phase data for the project in JSON format.'),
});
export type ProjectCopilotSummaryInput = z.infer<typeof ProjectCopilotSummaryInputSchema>;

const ProjectCopilotSummaryOutputSchema = z.object({
  risks: z.array(
    z.object({
      riskDescription: z.string().describe('A description of the delay risk.'),
      countermeasureSuggestion: z.string().describe('A suggested countermeasure to address the risk.'),
    })
  ).describe('Top 3 delay risks and their countermeasure suggestions.'),
});
export type ProjectCopilotSummaryOutput = z.infer<typeof ProjectCopilotSummaryOutputSchema>;

export async function getProjectCopilotSummary(input: ProjectCopilotSummaryInput): Promise<ProjectCopilotSummaryOutput> {
  return projectCopilotSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectCopilotSummaryPrompt',
  input: {schema: ProjectCopilotSummaryInputSchema},
  output: {schema: ProjectCopilotSummaryOutputSchema},
  prompt: `You are Project-Copilot for {{projectName}}. Summarize the top 3 delay risks from the current phase-data and propose a counter-measure for each. Return the result in JSON format.

Phase Data: {{{phaseData}}}`,
});

const projectCopilotSummaryFlow = ai.defineFlow(
  {
    name: 'projectCopilotSummaryFlow',
    inputSchema: ProjectCopilotSummaryInputSchema,
    outputSchema: ProjectCopilotSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
