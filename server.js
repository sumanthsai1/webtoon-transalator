const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: '10mb' }));

app.post('/api/screenshot', async (req, res) => {
    const { url } = req.body;
    try {
        const response = await axios.post('http://localhost:5000/screenshot', { url });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error capturing screenshot');
    }
});

app.post('/api/translate', async (req, res) => {
    const { image } = req.body;
    try {
        const response = await axios.post('http://localhost:5000/translate', { image });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error translating image');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
