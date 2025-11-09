import { GoogleGenAI } from "@google/genai";
import type { GroundingSource, JobPosting } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const parseJsonFromMarkdown = (markdown: string): { jobs: JobPosting[] } => {
  const jsonRegex = /```json\n([\s\S]*?)\n```/;
  const match = markdown.match(jsonRegex);
  if (!match || !match[1]) {
    // Attempt to parse if the backticks are missing
    try {
      const parsed = JSON.parse(markdown);
      if(parsed.jobs) return parsed;
    } catch (e) {
      console.error("Failed to parse JSON, even without markdown.", e);
    }
    throw new Error("Could not find a JSON code block in the response.");
  }
  return JSON.parse(match[1]);
};

export const findJobs = async (query: string): Promise<{ jobs: JobPosting[], sources: GroundingSource[] }> => {
  const prompt = `
    You are an expert Job Search Agent specializing in Kotlin and Spring framework roles. 
    Based on the user's query: "${query}", find the top 5 most relevant job postings. 
    Use Google Search to ensure the information is up-to-date.
    Format your entire response as a single JSON object within a markdown code block (\`\`\`json ... \`\`\`).
    The JSON object should have a single key "jobs" which is an array of job objects.
    Each job object must have the following properties: "title" (string), "company" (string), "location" (string), and "description" (string, a brief 2-3 sentence summary).
    If you find a direct application link, add it as a "url" property.
    Do not include any text, conversation, or explanation outside of the JSON markdown block.
    Your response should start with \`\`\`json and end with \`\`\`.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const parsedJobs = parseJsonFromMarkdown(response.text);
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
        .map((chunk: any) => ({
            uri: chunk.web?.uri || '',
            title: chunk.web?.title || 'Untitled Source',
        }))
        .filter((source: GroundingSource) => source.uri);

    return { jobs: parsedJobs.jobs || [], sources };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch job search results: ${error.message}`);
    }
    throw new Error("An unknown error occurred during the job search.");
  }
};