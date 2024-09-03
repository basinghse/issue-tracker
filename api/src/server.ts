import express from 'express';
import cors from 'cors';
import { apiKeyAuth } from './middleware/apiAuth';
import issuesRouter from './routes/issues';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Public
app.get('/', (req, res) => {
  res.send('Issue Tracker API');
});

// Protected
app.use('/issues', apiKeyAuth, issuesRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});