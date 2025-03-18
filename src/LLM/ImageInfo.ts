import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing in environment variables.");
}

export const geminiImageInfo = async (image: string, prompt: string): Promise<{ text?: string; error?: string }> => {
  try {
    if (!image) {
      return { error: "Image Required" };
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
      "contents": [
        {
          "parts": [
            {
              "text": prompt
            },
            {
              "inlineData": {
                "mimeType": "image/jpeg",
                "data": image  // Your Base64-encoded image
              }
            }
          ]
        }
      ]
    };

    const response = await axios.post<{ candidates: { content: { parts: { text: string }[] } }[] }>(
      geminiApiUrl,
      requestBody,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return { text: response.data.candidates[0]?.content?.parts[0]?.text ?? "No response text available" };
  } catch (error: any) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    return { error: 'An error occurred while processing the request' };
  }
};
