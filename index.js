const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Troque aqui pelos seus dados reais:
const BONIFIQ_TOKEN = 'SEU_TOKEN';
const BONIFIQ_SENHA = 'SUA_SENHA';
const BONIFIQ_URL = 'https://url-da-api-bonifiq'; // ajuste para o endpoint correto

app.post('/bonifiq', async (req, res) => {
  try {
    // Monta o header Authorization Basic
    const auth = Buffer.from(`${BONIFIQ_TOKEN}:${BONIFIQ_SENHA}`).toString('base64');

    // Recebe os dados do AppSheet (estão em req.body)
    const payload = req.body;

    // Envia o POST para a Bonifiq
    const response = await axios.post(BONIFIQ_URL, payload, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      }
    });

    // Retorna para quem chamou (opcional, só para debug)
    res.status(response.status).json(response.data);

  } catch (error) {
    // Em caso de erro, retorna a mensagem para você poder debugar
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
