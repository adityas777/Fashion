import { GoogleGenAI, Type, Schema } from "@google/genai";
import { OutfitSuggestion, SizeMap } from '../types';

// NOTE: In a real app, do not expose API_KEY on the client side. 
// This is for prototype demonstration purposes as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to validate key
const checkKey = () => {
  if (!process.env.API_KEY) throw new Error("API Key is missing. Please set process.env.API_KEY");
};

/**
 * Generates an image for a specific clothing item using the gemini-2.5-flash-image model.
 */
export const generateOutfitImage = async (prompt: string): Promise<string> => {
  checkKey();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A high-quality, professional commercial fashion product photograph of ${prompt}. The item should be centered on a clean, minimalist studio background with soft lighting. 4k resolution, highly detailed fabric texture.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // The output response may contain both image and text parts; iterate to find the image part.
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    throw new Error("No image data returned from model");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    // Fallback image if generation fails
    return 'https://images.unsplash.com/photo-1523381235312-d083162383c3?auto=format&fit=crop&q=80&w=800';
  }
};

export const getOutfitRecommendations = async (
  itemDescription: string, 
  userContext: string
): Promise<OutfitSuggestion[]> => {
  checkKey();
  
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        itemName: { type: Type.STRING },
        category: { type: Type.STRING },
        color: { type: Type.STRING },
        reason: { type: Type.STRING, description: "Why this matches based on color theory and style." },
        price: { type: Type.INTEGER, description: "Estimated price in Indian Rupees (INR)." }
      },
      required: ["itemName", "category", "color", "reason", "price"]
    }
  };

  const prompt = `
    You are a world-class AI fashion stylist.
    The user is wearing: "${itemDescription}".
    Style Context: "${userContext}".
    
    Recommend 3 items (clothing and accessories) that would look incredible with this item.
    
    For each item:
    1. Provide a specific name (e.g., "Slim-Fit Charcoal Chinos").
    2. Suggest a category (Topwear, Bottomwear, Shoes, Accessories).
    3. Suggest a color that matches well.
    4. Provide a style reason.
    5. Provide a realistic price in INR.
    
    Do NOT provide image URLs. The system will generate them separately.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a luxury fashion stylist specializing in modern aesthetics."
      }
    });

    const jsonText = response.text || "[]";
    const suggestions = JSON.parse(jsonText) as any[];
    
    // Initialize empty imageUrl as it will be populated in the frontend
    return suggestions.map(s => ({ ...s, imageUrl: '' }));
  } catch (error) {
    console.error("Gemini Outfit Error:", error);
    return [];
  }
};

export const normalizeSize = async (
  myBrand: string, 
  mySize: string, 
  targetBrand: string
): Promise<SizeMap> => {
  checkKey();

  const prompt = `
    I wear size ${mySize} in ${myBrand}.
    What size should I buy in ${targetBrand}?
    Analyze the general sizing charts of these brands.
    Return a single JSON object.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      targetBrand: { type: Type.STRING },
      recommendedSize: { type: Type.STRING },
      confidence: { type: Type.NUMBER },
      reasoning: { type: Type.STRING }
    },
    required: ["targetBrand", "recommendedSize", "confidence", "reasoning"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
     const jsonText = response.text || "{}";
    return JSON.parse(jsonText) as SizeMap;
  } catch (error) {
    console.error("Gemini Size Error:", error);
    return {
      targetBrand,
      recommendedSize: "Unknown",
      confidence: 0,
      reasoning: "Could not retrieve sizing data."
    };
  }
};

export const analyzeTrendForLocation = async (location: string): Promise<string> => {
  checkKey();
  try {
     const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `What are the current fashion trends in ${location}? Keep it brief (max 2 sentences). Focus on seasonal wear.`,
    });
    return response.text || "Unable to fetch trends.";
  } catch (e) {
    return "Check out our latest collection!";
  }
}

export const analyzeTryOn = async (userImageBase64: string, productDescription: string) => {
    checkKey();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: userImageBase64
                        }
                    },
                    {
                        text: `I have uploaded a photo of myself and I want to try on this item: ${productDescription}. 
                        Analyze my skin tone, body shape, and current lighting from the photo.
                        1. Does this item's color suit my skin tone?
                        2. How would this style fit my body type based on the photo?
                        3. Give a honest verdict: "Great Match", "Okay", or "Try something else".
                        Keep it concise (max 3 bullet points).`
                    }
                ]
            }
        });
        return response.text || "Analysis complete.";
    } catch (e) {
        console.error(e);
        return "Could not analyze image. Please try again.";
    }
}