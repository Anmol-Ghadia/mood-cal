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
            max_tokens: 50,
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

// Example usage of the function with shorter output
const inputText = "Explain how photosynthesis works in simple terms.";
processString(inputText).then(output => console.log(output));
