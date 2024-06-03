const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const { sendTestResultEmail } = require('../utils/sendTestResultEmail'); // ajuste o caminho conforme necessário
const { CareerMock } = require('../utils/CareerMock'); // ajuste o caminho conforme necessário
const { Group } = require('../utils/question.interface'); // ajuste o caminho conforme necessário

// Função para calcular os resultados
const calculateResults = (responses) => {
  const result = {
    "Grupo I": { A: 0, B: 0 },
    "Grupo II": { A: 0, B: 0 },
    "Grupo III": { A: 0, B: 0 },
    "Grupo IV": { A: 0, B: 0 },
    "Grupo V": { A: 0, B: 0 }
  };

  // Agregando respostas por grupo
  for (const [group, answer] of Object.entries(responses)) {
    if (result[group]) {
      result[group].A += answer.A || 0;
      result[group].B += answer.B || 0;
    } else {
      console.warn(`Grupo ${group} não encontrado no resultado inicial`);
    }
  }

  // Determinando a área de interesse com base nas pontuações
  const interests = {};
  for (const [group, scores] of Object.entries(result)) {
    const total = scores.A + scores.B;
    interests[group] = Math.min((total / 12) * 100, 100); // Calcula a porcentagem de 0 a 100%
  }

  // Ordenando os grupos por pontuação em ordem decrescente
  const sortedGroups = Object.keys(interests).sort((a, b) => interests[b] - interests[a]);

  return { result, interests, sortedGroups };
};

// Endpoint para enviar as respostas do usuário
router.post('/', async (req, res) => {
  const { userId, responses } = req.body;
  try {
    const newResponse = await prisma.response.create({
      data: {
        userId,
        responses,
      },
    });
    res.status(201).json(newResponse);
  } catch (error) {
    console.error('Erro ao salvar respostas do usuário:', error);
    res.status(500).json({ error: 'Erro ao salvar respostas do usuário' });
  }
});

// Endpoint para calcular e obter o resultado
router.post('/calculate', async (req, res) => {
  const { responses, userEmail } = req.body;
  try {
    if (!responses) {
      throw new Error('Respostas não fornecidas');
    }

    const calculation = calculateResults(responses);

    // Preparar dados do resultado para envio de email
    const testResult = {
      firstCareerKey: calculation.sortedGroups[0],
      firstCareerTitle: CareerMock[calculation.sortedGroups[0]].title,
      firstCareerDescription: CareerMock[calculation.sortedGroups[0]].description,
      secondCareerTitle: CareerMock[calculation.sortedGroups[1]].title,
      secondCareerDescription: CareerMock[calculation.sortedGroups[1]].description,
      technologyNote: calculation.interests["Grupo I"],
      biologicalNote: calculation.interests["Grupo III"],
      humanNote: calculation.interests["Grupo II"],
      communicationNote: calculation.interests["Grupo IV"],
      artNote: calculation.interests["Grupo V"]
    };

    // Enviar email com os resultados
    await sendTestResultEmail(userEmail, testResult);

    res.json(calculation);
  } catch (error) {
    console.error('Erro ao calcular resultados:', error);
    res.status(500).json({ error: 'Erro ao calcular resultados' });
  }
});

module.exports = router;
