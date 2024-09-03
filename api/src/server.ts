import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
  response.send('Issue Tracker API');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});