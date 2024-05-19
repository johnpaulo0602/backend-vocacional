const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

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
    if (total >= 0 && total <= 3) {
      interests[group] = 'Interesse pequeno';
    } else if (total >= 4 && total <= 6) {
      interests[group] = 'Interesse moderado';
    } else if (total >= 7 && total <= 9) {
      interests[group] = 'Interesse grande';
    } else if (total >= 10 && total <= 12) {
      interests[group] = 'Interesse muito forte';
    }
  }

  return { result, interests };
};

// Endpoint para calcular e obter o resultado
router.post('/calculate', async (req, res) => {
  const { responses } = req.body;
  try {
    if (!responses) {
      throw new Error('Respostas não fornecidas');
    }

    const calculation = calculateResults(responses);
    res.json(calculation);
  } catch (error) {
    console.error('Erro ao calcular resultados:', error);
    res.status(500).json({ error: 'Erro ao calcular resultados' });
  }
});

module.exports = router;
