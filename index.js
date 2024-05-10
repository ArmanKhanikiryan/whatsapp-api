const express = require('express');
const axios = require('axios');
const testRoute = require("./routes/test.route");
const cors = require('cors');
const {sendTemplateMessage, sendCustomMessage} = require("./messages");
const app = express();
const port = process.env.PORT || 3030;
const API_URL = process.env.API_URL;
const API_TOKEN = process.env.API_TOKEN;

app.use(express.json());
app.use(cors());
app.use('/test', testRoute);
console.log('App started');

app.get('/', (req, res) => {
    console.log('DEFAULT ROUTE');
    res.send({message: 'Hello from Express, Its a default route!!' });
})

app.post('/message', async (req, res) => {
    try {
        const { to, message } = req.body;
        await sendTemplateMessage(to)
        console.log('Template breakpoint')
        await sendCustomMessage(to, message);
        res.sendStatus(200)
    }catch (e) {
        res.status(403).send(e.message)
    }
})

app.get('/webhook', (req, res) => {
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
    console.log('Webhook Body', req.body);
    console.log('-------------------');
    console.log('-------------------');
    console.log('Webhook Body', req.body.object);
    res.status(200).send('Webhook received');
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
