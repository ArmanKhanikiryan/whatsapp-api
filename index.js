const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const testRoute = require("./routes/test.route");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3030;
const API_URL = process.env.WHATSAPP_API_URL;
const API_TOKEN = process.env.WHATSAPP_API_TOKEN;

let coutn = 1;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/test', testRoute);

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const sendEvent = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
    sendEvent({ message: `Hello from server! Its Arman ${++coutn}` });
    // req.on('close', () => {
    // });
});

const sendMessage = async (to) => {
    try {
        const response = await axios.post(
            API_URL,
            {
                messaging_product: "whatsapp",
                to,
                type: "template",
                template: {
                    name: "hello_world",
                    language: {
                        code: "en_US"
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Message sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
        throw error;
    }
};

app.post('/send-message', async (req, res) => {
    const { to } = req.body;
    try {
        await sendMessage(to);
        res.json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending message' });
    }
});

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

app.post('/webhook', (req, res) => {
    const { from, message } = req.body;
    req.body.message = `Received message from ${from}: ${message}`;
    res.redirect(301, 'http://localhost:9999/new-endpoint');
});

// app.post('/webhook2', (req, res) => {
//     const { entry } = req.body;
//     if (entry && entry.length > 0) {
//         entry.forEach(entryItem => {
//             const { messaging } = entryItem;
//             if (messaging && messaging.length > 0) {
//                 messaging.forEach(messageItem => {
//                     const { sender, message } = messageItem;
//                     console.log(`Received message from ${sender}: ${message}`);
//                 });
//             }
//         });
//     }
//     res.sendStatus(200);
// });

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
