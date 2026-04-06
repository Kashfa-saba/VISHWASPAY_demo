import { GoogleGenAI } from "@google/genai";
import { useState, useEffect } from "react";

export function useLogo() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLogo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: 'A high-quality 3D minimalist logo for a fintech app called Vishwaspay. The logo features two stylized hands in a handshake, one hand is deep teal and the other is warm amber. The hands are rounded, glossy, and have a smooth clay-like texture. Minimalist, clean, professional, trust-themed, isolated on a transparent-looking dark background.',
            },
          ],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          setLogoUrl(`data:image/png;base64,${base64EncodeString}`);
          return;
        }
      }
      throw new Error("No image data found in response");
    } catch (err) {
      console.error("Error generating logo:", err);
      setError("Failed to generate logo");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateLogo();
  }, []);

  return { logoUrl, isLoading, error, generateLogo };
}
