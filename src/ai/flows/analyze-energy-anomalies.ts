'use server';

/**
 * @fileOverview Analyzes energy consumption data for anomalies and provides potential reasons.
 *
 * - analyzeEnergyAnomalies - A function that handles the anomaly analysis process.
 * - AnalyzeEnergyAnomaliesInput - The input type for the analyzeEnergyAnomalies function.
 * - AnalyzeEnergyAnomaliesOutput - The return type for the analyzeEnergyAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEnergyAnomaliesInputSchema = z.array(
  z.object({
    date: z.string().describe('The date of the energy consumption record.'),
    consumption: z.number().describe('The energy consumption in kWh for the given date.'),
  })
).describe('An array of energy consumption records, each with a date and consumption value.');

export type AnalyzeEnergyAnomaliesInput = z.infer<typeof AnalyzeEnergyAnomaliesInputSchema>;

const AnalyzeEnergyAnomaliesOutputSchema = z.array(
  z.object({
    date: z.string().describe('The date of the identified anomaly.'),
    consumption: z.number().describe('The energy consumption value for the anomaly.'),
    potentialReasons: z.string().describe('Potential reasons for the anomaly.'),
  })
).describe('An array of identified energy consumption anomalies with potential reasons.');

export type AnalyzeEnergyAnomaliesOutput = z.infer<typeof AnalyzeEnergyAnomaliesOutputSchema>;

export async function analyzeEnergyAnomalies(input: AnalyzeEnergyAnomaliesInput): Promise<AnalyzeEnergyAnomaliesOutput> {
  return analyzeEnergyAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEnergyAnomaliesPrompt',
  input: {schema: AnalyzeEnergyAnomaliesInputSchema},
  output: {schema: AnalyzeEnergyAnomaliesOutputSchema},
  prompt: `You are an expert energy analyst. You are provided with historical energy consumption data.

Your task is to identify anomalies in the energy consumption patterns and provide potential reasons for these anomalies.

Input data:
{{#each this}}
- Date: {{date}}, Consumption: {{consumption}} kWh
{{/each}}

Analyze the data and identify any anomalies (e.g., sudden spikes or drops in consumption). For each anomaly, provide the date, consumption value, and potential reasons for the anomaly.  Format the output as a JSON array.
`,
});

const analyzeEnergyAnomaliesFlow = ai.defineFlow(
  {
    name: 'analyzeEnergyAnomaliesFlow',
    inputSchema: AnalyzeEnergyAnomaliesInputSchema,
    outputSchema: AnalyzeEnergyAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
