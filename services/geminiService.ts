import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client securely
const ai = new GoogleGenAI({ apiKey });

/**
 * Sends two images (source and template) to Gemini to generate a modified ID photo.
 */
export const generateIDPhoto = async (
  sourceBase64: string,
  templateBase64: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  // Clean base64 strings (remove data URL prefix if present)
  const cleanSource = sourceBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
  const cleanTemplate = templateBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: "This is an ID photo editing task. \n" +
                  "First Image: Source portrait.\n" +
                  "Second Image: Reference template.\n" +
                  "Task: Replace the background color of the first image to exactly match the solid background color of the second image. " +
                  "Ensure the edges around the hair and shoulders are clean and professional. " +
                  "Preserve the person's face, skin tone, and clothing details from the first image exactly. " +
                  "Do not change the person's identity or facial features. " +
                  "Output only the modified ID photo."
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanSource
            }
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanTemplate
            }
          }
        ]
      }
    });

    // Extract the image from the response
    let generatedImageBase64 = null;

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          generatedImageBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!generatedImageBase64) {
      throw new Error("No image data returned from the model.");
    }

    return `data:image/png;base64,${generatedImageBase64}`;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};