import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

interface Issue {
  id: number;
  title: string;
  description: string;
}

let issues: Issue[] = [
  { id: 1, title: 'Sample Issue 1', description: 'This is the first sample issue' },
  { id: 2, title: 'Sample Issue 2', description: 'This is the second sample issue' },
];

// Create
app.post('/issues', (request, response) => {
  const newIssue: Issue = { ...request.body, id: Date.now() };
  issues.push(newIssue);
  console.log('Created:', newIssue);
  response.status(201).json(newIssue);
});

// Get all
app.get('/issues', (request, response) => {
  response.json(issues);
});

// Get one
app.get('/issues/:id', (request, response) => {
  const issue = issues.find(i => i.id === parseInt(request.params.id));
  if (issue) {
    response.json(issue);
  } else {
    response.status(404).send('Issue not found');
  }
});

// Update
app.put('/issues/:id', (request, response) => {
  const id = parseInt(request.params.id);
  const index = issues.findIndex(i => i.id === id);
  if (index !== -1) {
    issues[index] = { ...issues[index], ...request.body };
    console.log('Updated:', issues[index]);
    response.json(issues[index]);
  } else {
    response.status(404).send('Issue not found');
  }
});

// Delete
app.delete('/issues/:id', (request, response) => {
  const id = parseInt(request.params.id);
  const index = issues.findIndex(i => i.id === id);
  if (index !== -1) {
    const deletedIssue = issues.splice(index, 1)[0];
    console.log('Deleted:', deletedIssue);
    response.status(204).send();
  } else {
    response.status(404).send('Issue not found');
  }
});

app.get('/', (request, response) => {
  response.send('Issue Tracker API');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});