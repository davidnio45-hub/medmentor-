import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { QuizQuestion, Flashcard, StudyPack } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Update model names based on guidelines
const textModel = 'gemini-2.5-flash';
const visionModel = 'gemini-2.5-flash-image';

export const generateTextFromPrompt = async (prompt: string, userInput: string): Promise<string> => {
    try {
        const fullPrompt = prompt.replace('{userInput}', userInput);
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: textModel,
            contents: fullPrompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating text:", error);
        throw new Error("Failed to generate text from API.");
    }
};

export const generateTextWithContent = async (prompt: string, content: string): Promise<string> => {
    try {
        const fullPrompt = `${prompt}\n\n${content}`;
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: textModel,
            contents: fullPrompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating text:", error);
        throw new Error("Failed to generate text from API.");
    }
};


export const generateFlashcards = async (prompt: string, content: string): Promise<Flashcard[]> => {
    try {
        const fullPrompt = `${prompt}\n\n${content}`;
        const response = await ai.models.generateContent({
            model: textModel,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            answer: { type: Type.STRING },
                        },
                        required: ["question", "answer"],
                    },
                },
            },
        });

        return JSON.parse(response.text.trim()) as Flashcard[];

    } catch (error) {
        console.error("Error generating flashcards:", error);
        throw new Error("Failed to generate flashcards from API.");
    }
};


export const generateQuiz = async (prompt: string, content: string): Promise<QuizQuestion[]> => {
    try {
        const fullPrompt = `${prompt}\n\n${content}`;
        const response = await ai.models.generateContent({
            model: textModel,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                            },
                            correctAnswer: { type: Type.STRING },
                            explanation: { type: Type.STRING },
                        },
                        required: ["question", "options", "correctAnswer", "explanation"],
                    },
                },
            },
        });

        return JSON.parse(response.text.trim()) as QuizQuestion[];
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz from API.");
    }
};

export const generateStudyPack = async (prompt: string, topic: string): Promise<StudyPack> => {
    try {
        const fullPrompt = prompt.replace('{userInput}', topic);
        
        const response = await ai.models.generateContent({
            model: textModel,
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, description: "A concise summary of the topic." },
                        flashcards: {
                            type: Type.ARRAY,
                            description: "An array of flashcards with a question and an answer.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    answer: { type: Type.STRING },
                                },
                                required: ["question", "answer"],
                            },
                        },
                        quiz: {
                            type: Type.ARRAY,
                            description: "An array of multiple-choice quiz questions.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: {
                                        type: Type.ARRAY,
                                        description: "An array of 4 potential answers.",
                                        items: { type: Type.STRING },
                                    },
                                    correctAnswer: { type: Type.STRING },
                                    explanation: { type: Type.STRING },
                                },
                                required: ["question", "options", "correctAnswer", "explanation"],
                            },
                        },
                        caseStudy: { type: Type.STRING, description: "A brief clinical case study related to the topic." },
                    },
                    required: ["summary", "flashcards", "quiz", "caseStudy"],
                },
            },
        });

        let jsonStr = response.text.trim();
        if (jsonStr.startsWith("```json")) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3).trim();
        } else if (jsonStr.startsWith("```")) {
            jsonStr = jsonStr.substring(3, jsonStr.length - 3).trim();
        }

        return JSON.parse(jsonStr) as StudyPack;

    } catch (error) {
        console.error("Error generating study pack:", error);
        throw new Error("Failed to generate study pack from API.");
    }
};

export const generateAnatomyImage = async (prompt: string, bodyPart: string): Promise<string> => {
    try {
        const fullPrompt = prompt.replace('{userInput}', bodyPart);
        const response = await ai.models.generateContent({
            model: visionModel,
            contents: { parts: [{ text: fullPrompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              return part.inlineData.data; // This is the base64 image string
            }
        }
        throw new Error("No image was generated by the API.");

    } catch (error) {
        console.error("Error generating anatomy image:", error);
        throw new Error("Failed to generate image from API.");
    }
};

// FIX: Add missing analyzeImage function.
export const analyzeImage = async (prompt: string, base64Image: string, mimeType: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };
        const textPart = { text: prompt };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: visionModel,
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw new Error("Failed to analyze image with API.");
    }
};