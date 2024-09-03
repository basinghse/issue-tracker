import { Request, Response, NextFunction } from 'express';

const API_KEY = process.env.API_KEY || 'your-secret-api-key';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('JWT-KEY');

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ message: 'Invalid API Key' });
  }

  next();
};

export const validateIssueInput = (req: Request, res: Response, next: NextFunction) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  if (typeof title !== 'string' || typeof description !== 'string') {
    return res.status(400).json({ message: 'Title and description must be strings' });
  }

  next();
};