const express = require('express');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());

// Inicialização da API do Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Rota do Webhook para receber as mensagens do WhatsApp
app.post('/webhook-whatsapp', async (req, res) => {
    try {
        const mensagemCliente = req.body.message;
        const numeroCliente = req.body.from;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'system',
                    parts: [{ 
                        text: `Você é a assistente virtual de atendimento e triagem do escritório da advogada Dra. Ilma Dutra Ribeiro. 
                        O seu objetivo é acolher o cliente com empatia, entender o problema dele, fazer perguntas objetivas para qualificar o caso e coletar os dados necessários.
                        Áreas de atuação: Direito Trabalhista, Direito de Família (divórcio, pensão, guarda), Cível, Burocracias e Carteira de Motorista.
                        Área NÃO atendida: Criminal/Penal (se for criminal, informe com educação que não atua nessa área).
                        Nunca dê consultoria jurídica ou prometa resultados. Apenas colete os fatos e solicite o Nome Completo e Telefone no final.` 
                    }]
                },
                {
                    role: 'user',
                    parts: [{ text: mensagemCliente }]
                }
            ]
        });

        const respostaIA = response.text;
        res.status(200).send({ status: 'success', reply: respostaIA });
    } catch (error) {
        console.error('Erro no processamento:', error);
        res.status(500).send({ error: 'Erro interno' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor da Lawtech rodando na porta ${PORT}`);
});
