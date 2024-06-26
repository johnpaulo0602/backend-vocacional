const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const { CareerMock } = require('../utils/CareerMock');

async function sendTestResultEmail(userEmail, testResult) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        auth: {
            user: 'comercial@startedgo.com',
            pass: process.env.SMTP_PASSWORD
        }
    });

    // Ler o template do arquivo
    const templatePath = path.join(__dirname, '../templates/emailTemplate.html');
    const source = fs.readFileSync(templatePath, 'utf8');

    // Compilar o template
    const template = handlebars.compile(source);

    // Dados para o template
    const data = {
        firstCareerTitle: testResult.firstCareerTitle,
        firstCareerDescription: testResult.firstCareerDescription,
        technologyNote: testResult.technologyNote.toFixed(2),
        biologicalNote: testResult.biologicalNote.toFixed(2),
        humanNote: testResult.humanNote.toFixed(2),
        communicationNote: testResult.communicationNote.toFixed(2),
        artNote: testResult.artNote.toFixed(2),
        courses: CareerMock[testResult.firstCareerKey].courses,
        characteristics: CareerMock[testResult.firstCareerKey].characteristics
    };

    // Renderizar o template com os dados
    const emailTemplate = template(data);

    const mailOptions = {
        from: 'comercial@startedgo.com',
        to: userEmail,
        subject: 'Resultado do Teste Vocacional',
        html: emailTemplate
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar email:', error);
    }
}

module.exports = { sendTestResultEmail };
