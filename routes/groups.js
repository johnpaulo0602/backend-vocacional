const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    try {
        const groups = await prisma.group.findMany();
        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar grupos' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const group = await prisma.group.findUnique({ where: { id } });
        if (!group) return res.status(404).json({ error: 'Grupo não encontrado' });
        res.json(group);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar grupo' });
    }
});

router.post('/', async (req, res) => {
    const { name } = req.body;
    try {
        const newGroup = await prisma.group.create({ data: { name } });
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar grupo' });
    }
});

module.exports = router;