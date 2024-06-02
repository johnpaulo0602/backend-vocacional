const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearDB() {
    try {
        await prisma.question.deleteMany({});
        await prisma.group.deleteMany({});
        console.log('Banco de dados limpo com sucesso');
    } catch (error) {
        console.error('Erro ao limpar o banco de dados:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearDB();
