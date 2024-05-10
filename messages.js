const axios = require("axios");

const API_URL = 'https://graph.facebook.com/v19.0/112275655198084/messages';
const API_TOKEN = 'EAAGqZBSfdTh4BO4utiQpMnDZBQcdapO5VcY1FxjPoLWhfreWfPVnAqVLW8emntZABBDm8gFkA9ZAph81QXVDA0ZBIckwZCEMejN8B7ihxhf4dJzPfrCqSNtuau4HvloJCZC3xgZC6aXwmLSfy6Jdkjzcs4FMPApC9Tfd9tQ8oXo0oVPjhOXQyziZAZBmgtZApfLDlZCPS7lwyax39EKk7ti56FcZD';

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

