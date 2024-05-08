const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const testRoute = require("./routes/test.route");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3030;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/test', testRoute);


app.get('/', (req, res) => {
    const receivedChallenge = req.query['hub.challenge'];
    if (receivedChallenge) {
        res.status(200).send(receivedChallenge);
    } else {
        res.status(403).send('Invalid request');
    }
});

app.get('/redirect', (req, res) => {
    req.body.message = 'You were redirected to a new endpoint';
    res.redirect(301, 'http://localhost:9999/new-endpoint');
});

app.post('/webhook', async (req, res) => {
    const { from, message } = req.body;
    await axios.post('http://localhost:9999/new-endpoint', { from, message });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
