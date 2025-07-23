'use server';

/**
 * @fileOverview An AI agent that answers follow-up questions about a task explanation.
 *
 * - getFollowUpExplanation - A function that provides an answer to a follow-up question.
 * - FollowUpTaskExplanationInput - The input type for the getFollowUpExplanation function.
 * - FollowUpTaskExplanationOutput - The return type for the getFollowUpExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FollowUpTaskExplanationInputSchema = z.object({
  taskName: z.string().describe('The name of the project task being discussed.'),
  originalExplanation: z.string().describe('The original AI-generated explanation of the task.'),
  followUpQuestion: z.string().describe('The user\'s follow-up question.'),
});
export type FollowUpTaskExplanationInput = z.infer<typeof FollowUpTaskExplanationInputSchema>;

const FollowUpTaskExplanationOutputSchema = z.object({
  answer: z.string().describe('The AI\'s answer to the follow-up question.'),
});
export type FollowUpTaskExplanationOutput = z.infer<typeof FollowUpTaskExplanationOutputSchema>;


export async function getFollowUpExplanation(input: FollowUpTaskExplanationInput): Promise<FollowUpTaskExplanationOutput> {
  return followUpTaskExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'followUpTaskExplanationPrompt',
  input: {schema: FollowUpTaskExplanationInputSchema},
  output: {schema: FollowUpTaskExplanationOutputSchema},
  prompt: `You are an expert project manager who is brilliant at explaining complex topics to non-technical government administrators.
A user has asked a follow-up question about a task.

Original Task Name: {{taskName}}

Original Explanation you provided:
"""
{{originalExplanation}}
"""

User's Follow-up Question: "{{followUpQuestion}}"

Please provide a clear, concise answer to their question. Maintain the same simple, non-technical tone. Do not repeat the original explanation unless necessary for context. Focus directly on answering the user's question.`,
});

const followUpTaskExplanationFlow = ai.defineFlow(
  {
    name: 'followUpTaskExplanationFlow',
    inputSchema: FollowUpTaskExplanationInputSchema,
    outputSchema: FollowUpTaskExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
