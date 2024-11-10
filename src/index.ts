import express, { Request, Response } from 'express';
import path from 'path';
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());


app.use(express.static(path.join(__dirname, 'images')));

// Serve front end file
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// backend route, probably will be removed later 
app.get('/back', (req: Request, res: Response) => {
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
        res.json({ error: 'Invalid or missing data field' });
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
