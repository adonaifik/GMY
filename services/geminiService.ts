import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key not found");
    }
    return new GoogleGenAI({ apiKey });
};

export const generatePersonalityAnalysis = async (bloodType: string, traits: string[]) => {
    try {
        const client = getClient();
        const prompt = `
            Based on the Japanese Blood Type Personality Theory (Ketsueki-gata), 
            provide a fun, engaging, and slightly scientific-sounding personality analysis 
            for someone with Blood Type ${bloodType}. 
            
            The user identified with these traits: ${traits.join(', ')}.
            
            Keep it under 150 words. Be encouraging but honest about the stereotypes.
        `;
        
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Could not generate analysis at this time. But you are unique regardless of your blood type!";
    }
};

export const askMedicalConsultant = async (question: string) => {
    try {
        const client = getClient();
        const prompt = `
            You are HemoBot, a friendly and knowledgeable hematology assistant.
            Answer the following question about blood types, donation, or genetics: "${question}"
            
            Keep the answer concise (under 100 words), accurate, and easy to understand for a general audience.
            If the question is not about blood or health, politely redirect to the topic.
        `;
        
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini Error:", error);
        return "I'm having trouble connecting to my medical database. Please try again later.";
    }
};