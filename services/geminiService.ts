
import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackEntry } from "../types";

export const generateActionPlan = async (entries: FeedbackEntry[]): Promise<string[]> => {
  if (entries.length === 0) return ["No feedback available yet to generate a plan."];

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const feedbackList = entries.map(e => `[Mood: ${e.mood}/5] Comment: ${e.comment}`).join('\n');

  const prompt = `
    Based on the following employee feedback and mood ratings, generate a 3-point action plan for management to improve team culture.
    Each point should be clear, actionable, and address the common themes found in the feedback.
    
    Feedback:
    ${feedbackList}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a senior HR consultant specializing in workplace culture. Provide exactly 3 concise, high-impact action items. Output only the 3 points as a JSON array of strings.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            points: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "The 3-point action plan."
            }
          },
          required: ["points"]
        }
      }
    });

    const result = JSON.parse(response.text || '{"points":[]}');
    return result.points && result.points.length > 0 
      ? result.points 
      : ["Focus on communication", "Increase recognition", "Improve work-life balance"];
  } catch (error) {
    console.error("AI Generation Error:", error);
    return ["Ensure open channels for feedback", "Acknowledge team efforts weekly", "Monitor workload distribution"];
  }
};
