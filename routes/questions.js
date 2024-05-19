const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Endpoint para pegar todas as perguntas
router.get('/questions', async (req, res) => {
    try {
        const questions = await prisma.question.findMany();
        res.json(questions);
    } catch (error) {
        console.error('Erro ao buscar todas as perguntas:', error);
        res.status(500).json({ error: 'Erro ao buscar perguntas' });
    }
});

// Endpoint para obter perguntas por ID do grupo
router.get('/group/:groupId', async (req, res) => {
    const { groupId } = req.params;
    try {
        console.log('Buscando perguntas para o grupo com ID:', groupId);
        const questions = await prisma.question.findMany({
            where: {
                groupId: groupId
            }
        });
        res.json(questions);
    } catch (error) {
        console.error('Erro ao buscar perguntas por ID do grupo:', error);
        res.status(500).json({ error: 'Erro ao buscar perguntas' });
    }
});

router.post('/questions', async (req, res) => {
    const { groupId, groupName, content, optionA, optionB } = req.body;
    try {
        const newQuestion = await prisma.question.create({
            data: { groupId, groupName, content, optionA, optionB },
        });
        res.status(201).json(newQuestion);
    } catch (error) {
        console.error('Erro ao criar pergunta:', error);
        res.status(500).json({ error: 'Erro ao criar pergunta' });
    }
});

module.exports = router;
