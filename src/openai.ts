// Import OpenAI and dotenv
import OpenAI from "openai";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI API with configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Function to call OpenAI API and process input text with limited output length
export async function processString(inputText: string): Promise<string | null> {
    try {
        // Create a chat completion with the 'gpt-4o-mini' model
        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: inputText }],
            max_tokens: 200,
            top_p: 0.8 
        });
        
        // Return the response content
        const message = chatCompletion.choices[0].message;
        return message ? message.content?.trim() ?? null : "No response from model.";
    } catch (error) {
        console.error("Error processing string:", error);
        return "An error occurred.";
    }
}


export async function processArrayOfData(inputText: string): Promise<string[]> {
    let data = await processString(inputText);
    if (data === null) {
        throw new Error("No data provided");
    }
    const out: string[] = [];
    
    for (let i = 0; i < 5; i++) {
        if (data?.charAt(0) === '[' && data.charAt(data.length - 1) === ']') {
            break;
        }
        data = await processString(inputText);
    }

    if (data?.charAt(0) === '[' && data.charAt(data.length - 1) === ']') {
        data = data.slice(1, -1); // Remove the surrounding brackets
        data.split(',').forEach((element) => {
            const cleanedElement = element.trim().replace(/['"`]/g, ''); // Remove " or ' or ` symbols
            out.push(cleanedElement);
        });
        return out;
    } else {
        throw new Error("Error in parsing data");
    }
}

