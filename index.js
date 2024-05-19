const express = require('express');
const { PrismaClient } = require('@prisma/client');
const questionsRouter = require('./routes/questions');
const groupsRouter = require('./routes/groups');
const responsesRouter = require('./routes/responses');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Teste Vocacional API');
});

app.use('/questions', questionsRouter);
app.use('/groups', groupsRouter);
app.use('/responses', responsesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
