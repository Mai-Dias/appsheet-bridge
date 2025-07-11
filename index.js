const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// DADOS FIXOS (troque se precisar)
const BONIFIQ_TOKEN = 'APIUSER-EmprioQuat-d622af2ac1364f8cab0520cbedd0ba93';
const BONIFIQ_SENHA = '73PD332YKV3K8J53C5HS84ESMT3Q9C';

app.post('/bonifiq', async (req, res) => {
  try {
    const { CPF } = req.body;

    if (!CPF) {
      return res.status(400).json({ error: "CPF obrigatório no payload!" });
    }

    // Monta a URL da Bonifiq com o CPF como ID do cliente
    const BONIFIQ_URL = `https://api.bonifiq.com.br/v1/pvt/Cliente/${CPF}/cashback`;

    // Header de autenticação
    const auth = Buffer.from(`${BONIFIQ_TOKEN}:${BONIFIQ_SENHA}`).toString('base64');

    // Monta payload de 100 pontos para o CPF informado
    const payload = {
      Value: 100,
      OperationType: 0,
      Reason: "NPS respondido",
      ChangeKey: `NPS-${CPF}-${new Date().toISOString().slice(0, 10)}`
    };

    const response = await axios.post(BONIFIQ_URL, payload, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(response.status).json(response.data);

  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
