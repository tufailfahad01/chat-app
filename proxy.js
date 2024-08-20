const express = require('express');
const request = require('request');
var cors = require('cors')
const app = express();

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

app.listen(3002, () => {
    console.log('Proxy server running on port 3002');
});
