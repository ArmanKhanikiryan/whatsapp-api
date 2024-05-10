const axios = require("axios");
const API_URL = process.env.API_URL;
const API_TOKEN = process.env.API_TOKEN;
const sendTemplateMessage = async (to) => {
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

const sendCustomMessage = async (to, message) => {
    try {
        const response = await axios.post(
            API_URL,
            {
                messaging_product: "whatsapp",
                to,
                type: "text",
                text: {
                    body: message
                },
                language: {
                    code: "en_US"
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

module.exports = {
    sendTemplateMessage,
    sendCustomMessage
};

