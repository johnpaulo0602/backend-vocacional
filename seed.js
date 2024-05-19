const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
  const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

  for (const groupData of data.groups) {
    // Cria o grupo
    const group = await prisma.group.create({
      data: {
        name: groupData.name
      }
    });

    // Cria as questões associadas ao grupo
    for (const questionData of groupData.questions) {
      await prisma.question.create({
        data: {
          groupId: group.id,
          groupName: group.name,
          content: questionData.content,
          optionA: questionData.optionA,
          optionB: questionData.optionB
        }
      });
    }
  }

  console.log('Dados de seed inseridos com sucesso');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
