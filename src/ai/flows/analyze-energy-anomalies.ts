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
  prompt: `Você é um analista de energia especialista. Você recebe dados históricos de consumo de energia.

Sua tarefa é identificar anomalias nos padrões de consumo de energia e fornecer possíveis razões para essas anomalias.

Dados de entrada:
{{#each this}}
- Data: {{date}}, Consumo: {{consumption}} kWh
{{/each}}

Analise os dados e identifique quaisquer anomalias (por exemplo, picos ou quedas repentinas no consumo). Para cada anomalia, forneça a data, o valor do consumo e as possíveis razões para a anomalia. Formate a saída como um array JSON em português.
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
