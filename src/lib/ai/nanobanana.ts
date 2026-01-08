async function urlToGenerativePart(url: string, mimeType: string) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image from ${url}: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return {
        inlineData: {
            data: base64,
            mimeType,
        },
    };
}

export async function generateOutfitImage(imageUrls: string[]): Promise<Blob> {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set.");
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`;

    try {
        const imageParts = await Promise.all(
            imageUrls.map(url => urlToGenerativePart(url, 'image/png'))
        );

        const prompt = "A full-body, photorealistic image of a fashion model wearing these clothes against a plain white studio background. The model should be clearly visible and the clothing items should be worn correctly.";

        const requestBody = {
            contents: [{
                parts: [
                    { text: prompt },
                    ...imageParts
                ],
            }],
            generationConfig: {
                "temperature": 0.4,
                "topK": 32,
                "topP": 1,
                "maxOutputTokens": 4096,
                "stopSequences": []
            },
            safetySettings: [
                { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" },
                { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE" },
                { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" },
                { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" }
            ]
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Gemini API Error:", errorBody);
            throw new Error(`Gemini API request failed: ${response.statusText}`);
        }

        const responseData = await response.json();
        
        const generatedPart = responseData.candidates[0]?.content.parts[0];
        if (generatedPart && generatedPart.inlineData && generatedPart.inlineData.data) {
            const imageBase64 = generatedPart.inlineData.data;
            const imageBuffer = Buffer.from(imageBase64, 'base64');
            return new Blob([imageBuffer], { type: 'image/png' });
        } else {
            console.error("Invalid response structure from Gemini API:", responseData);
            throw new Error("Failed to get generated image from Gemini API response.");
        }

    } catch (error) {
        console.error("Error in generateOutfitImage:", error);
        throw error;
    }
}
