const express = require('express');
const request = require('request');
var cors = require('cors')
const app = express();
const axios = require('axios');

app.use(cors())

app.get('/chat', (req, res) => {
    const token = req.headers['authorization'] || req.headers['Authorization'];
    if (!token) {
        return res.status(401).send('Unauthorized: Missing or invalid Authorization header');
    }

    const url = `https://ggp-test-llm-kb-v2.eastus2.inference.ml.azure.com/swagger.json`;
    const options = {
        url,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    req.pipe(request(options)).pipe(res);
});

app.post('/message', async (req, res) => {
    const token = req.headers['authorization'] || req.headers['Authorization'];

    if (!token) {
        return res.status(401).send('Unauthorized: Missing or invalid Authorization header');
    }

    const url = `https://ggp-test-llm-kb-v2.eastus2.inference.ml.azure.com/score`;
    const payload = req.body

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' // Add other headers if necessary
            }
        });
        res.json(response.data); // Forward the response from the external request
    } catch (error) {
        res.status(error.response ? error.response.status : 500).send(error); // Forward error status and message
    }

});

app.listen(3002, () => {
    console.log('Proxy server running on port 3002');
});
