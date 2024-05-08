import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3030;
const API_URL = process.env.WHATSAPP_API_URL;
const API_TOKEN = process.env.WHATSAPP_API_TOKEN;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

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
    }
};

app.post('/send-message', async (req, res) => {
    const { to } = req.body;
    try {
        await sendMessage(to);
        res.send('Message sent successfully');
    } catch (error) {
        res.status(500).send('Error sending message');
    }
});

app.post('/send-message', async (req, res) => {
    const { to } = req.body;
    try {
        await sendMessage(to);
        res.send('Message sent successfully');
    } catch (error) {
        res.status(500).send('Error sending message');
    }
});

app.post('/webhook',(req, res) => {
    const { from, message } = req.body;
    console.log(`Received message from ${from}: ${message}`);
    res.sendStatus(200);
});


app.post('/webhook2', (req, res) => {
    const { entry } = req.body;
    if (entry && entry.length > 0) {
        entry.forEach(entryItem => {
            const { messaging } = entryItem;
            if (messaging && messaging.length > 0) {
                messaging.forEach(messageItem => {
                    const { sender, message } = messageItem;
                    console.log(`Received message from ${sender}: ${message}`);
                });
            }
        });
    }
    res.sendStatus(200);
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


