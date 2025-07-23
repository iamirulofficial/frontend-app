'use server';

/**
 * @fileOverview An AI agent that explains a complex project task in simple terms.
 *
 * - getTaskExplanation - A function that provides a simplified explanation of a task.
 * - TaskExplanationInput - The input type for the getTaskExplanation function.
 * - TaskExplanationOutput - The return type for the getTaskExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaskExplanationInputSchema = z.object({
  taskName: z.string().describe('The name of the project task to explain.'),
  projectName: z.string().describe('The name of the overall project for context.'),
});
export type TaskExplanationInput = z.infer<typeof TaskExplanationInputSchema>;

const TaskExplanationOutputSchema = z.object({
  analogy: z.string().describe('A simple analogy to explain the task.'),
  objectives: z.array(z.string()).describe('A list of the key objectives for this task.'),
  challenges: z.array(z.string()).describe('A list of potential challenges or risks for this task.'),
});
export type TaskExplanationOutput = z.infer<typeof TaskExplanationOutputSchema>;


export async function getTaskExplanation(input: TaskExplanationInput): Promise<TaskExplanationOutput> {
  return explainTaskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTaskPrompt',
  input: {schema: TaskExplanationInputSchema},
  output: {schema: TaskExplanationOutputSchema},
  prompt: `You are an expert project manager who is brilliant at explaining complex topics to non-technical government administrators.
Your task is to explain the project task "{{taskName}}" from the project "{{projectName}}".

Use the following structure for your explanation:
1.  **Analogy**: Start with a simple, relatable analogy. For example, "Think of this like building the master blueprint for a city before laying the first brick."
2.  **Key Objectives**: List 2-3 bullet points of what this task aims to achieve in simple language.
3.  **Potential Challenges**: List 2-3 potential challenges or things to watch out for, again in simple terms.

Keep the language clear, concise, and free of technical jargon. The goal is to make the administrator feel informed and confident.
`,
});

const explainTaskFlow = ai.defineFlow(
  {
    name: 'explainTaskFlow',
    inputSchema: TaskExplanationInputSchema,
    outputSchema: TaskExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
