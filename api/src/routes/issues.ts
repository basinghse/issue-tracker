import express from 'express';
import { validateIssueInput } from '../middleware/apiAuth';

const router = express.Router();

interface Issue {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

let issues: Issue[] = [
  { id: 1, title: 'Sample Issue 1', description: 'This is the first sample issue', createdAt: new Date().toISOString() },
  { id: 2, title: 'Sample Issue 2', description: 'This is the second sample issue', createdAt: new Date().toISOString() },
];

let nextId = 3;

router.get('/', (req, res) => {
  res.json(issues);
});

router.get('/:id', (req, res) => {
  const issue = issues.find(i => i.id === parseInt(req.params.id));
  if (issue) {
    res.json(issue);
  } else {
    res.status(404).send('Issue not found');
  }
});

router.post('/', validateIssueInput, (req, res) => {
  const newIssue: Issue = { 
    ...req.body, 
    id: nextId++, 
    createdAt: new Date().toISOString()
  };
  issues.push(newIssue);
  res.status(201).json(newIssue);
});

router.put('/:id', validateIssueInput, (req, res) => {
  const id = parseInt(req.params.id);
  const index = issues.findIndex(i => i.id === id);
  if (index !== -1) {
    issues[index] = { ...issues[index], ...req.body, id, createdAt: issues[index].createdAt };
    res.json(issues[index]);
  } else {
    res.status(404).send('Issue not found');
  }
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = issues.findIndex(i => i.id === id);
  if (index !== -1) {
    const deletedIssue = issues.splice(index, 1)[0];
    res.status(204).send();
  } else {
    res.status(404).send('Issue not found');
  }
});

export default router;
