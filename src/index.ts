import express, { Request, Response } from 'express';
import {generateSummaryPrompt, generateArrayOfData} from './prompt';
import {processArrayOfData, processString} from './openai';
import path from 'path';
import { get } from 'http';
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));

// Serve front end file
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// backend route, probably will be removed later 
app.get('/back', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Backend!');
});

// Assumes: valid base64 string is provided
app.post('/api/data', async (req: Request, res: Response) => {
    // Ensure 'data' is coming from req.body
    const { data } = req.body;

    // Check if 'data' is present and is a valid string
    if (typeof data !== 'string' || !data) {
        console.log(`Received invalid data`);
        res.status(400);
        res.json({ error: 'Invalid or missing data field' });
        return;
    }

    console.log(`Received base64 data`);
    const prompt = generateSummaryPrompt(data);
    const arrayPrompt = generateArrayOfData(data);
    const gptResult =  processString(`${prompt}`);
    const gptResultArray =  processArrayOfData(`${arrayPrompt}`);
    Promise.all([gptResult, gptResultArray]).then((values) => {
        res.json({ message: values[0], moodsArray: values[1] });
    });
    return;
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
