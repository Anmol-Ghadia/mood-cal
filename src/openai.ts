import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";

dotenv.config();

// Set up OpenAI API configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Function to call OpenAI API and process input text
async function processString(inputText: string): Promise<string> {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: inputText,
            max_tokens: 100,
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error("Error processing string:", error);
        return "An error occurred.";
    }
}

// Example usage of the function
const inputText = "Explain how photosynthesis works in simple terms.";
processString(inputText).then(output => console.log(output));
