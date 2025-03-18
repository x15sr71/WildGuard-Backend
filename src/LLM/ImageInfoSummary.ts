import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing in environment variables.");
}

export const imageInfoSummary = async (prompt: string): Promise<string | null> => {
  try {
    if (!prompt) {
      throw new Error("Prompt is required");
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    const response = await axios.post<{ candidates: { content: { parts: { text: string }[] } }[] }>(
      geminiApiUrl,
      requestBody,
      { headers: { "Content-Type": "application/json" } }
    );
    //console.log(response.data)
    //console.log(response.data.candidates)
    return response.data.candidates[0]?.content?.parts[0]?.text ?? null;
  } catch (error: any) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    return null;
  }
};
