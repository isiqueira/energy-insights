'use server';

/**
 * @fileOverview Fetches historical weather data.
 *
 * - getHistoricalWeather - A function to get weather data for a date range.
 * - WeatherInput - The input type for the getHistoricalWeather function.
 * - WeatherOutput - The return type for the getHistoricalWeather function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherInputSchema = z.object({
  latitude: z.number().describe('Latitude for the location.'),
  longitude: z.number().describe('Longitude for the location.'),
  startDate: z.string().describe("Start date in YYYY-MM-DD format."),
  endDate: z.string().describe("End date in YYYY-MM-DD format."),
});
export type WeatherInput = z.infer<typeof WeatherInputSchema>;

const WeatherOutputSchema = z.array(z.object({
    date: z.string(),
    avgTemp: z.number(),
})).describe("An array of daily average temperatures.");
export type WeatherOutput = z.infer<typeof WeatherOutputSchema>;


// This is a placeholder tool. In a real scenario, you would implement the logic
// to call a weather API like Open-Meteo.
const fetchWeatherFromAPI = ai.defineTool(
    {
      name: 'fetchWeatherFromAPI',
      description: 'Fetches historical weather data from an external API.',
      inputSchema: WeatherInputSchema,
      outputSchema: WeatherOutputSchema,
    },
    async (input) => {
      console.log('Fetching weather for:', input);
      // In a real application, you would make an API call here.
      // For example: `https://api.open-meteo.com/v1/forecast?latitude=...`
      // For now, we return mock data.
      return [
        { date: '2023-01-15', avgTemp: 28.5 },
        { date: '2023-02-15', avgTemp: 29.1 },
        { date: '2023-07-15', avgTemp: 19.5 },
      ];
    }
);


const weatherFlow = ai.defineFlow(
  {
    name: 'getHistoricalWeatherFlow',
    inputSchema: WeatherInputSchema,
    outputSchema: WeatherOutputSchema,
    tools: [fetchWeatherFromAPI]
  },
  async (input) => {
    // The flow directly calls the tool to fetch the data.
    return await fetchWeatherFromAPI(input);
  }
);


export async function getHistoricalWeather(input: WeatherInput): Promise<WeatherOutput> {
  return weatherFlow(input);
}
