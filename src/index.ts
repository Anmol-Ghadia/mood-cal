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

// Example of a POST route
app.post('/api/data', (req: Request, res: Response) => {
  const { name, age } = req.body;
  res.json({ message: `Received data for ${name}, age ${age}` });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
