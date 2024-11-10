import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Simple route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Backend!');
});

// Assumes: valid base64 string is provided
app.post('/api/data', (req: Request, res: Response) => {
    // Ensure 'data' is coming from req.body
    const { data } = req.body;

    // Check if 'data' is present and is a valid string
    if (typeof data !== 'string' || !data) {
        console.log(`Received invalid data`);
        res.status(400);
        res.json({ error: 'Invalid or missing "data" field' });
        return;
    }

    console.log(`Received: ${data}`);
    res.json({ message: 'Received data' });
    return;
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
