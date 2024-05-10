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
        console.log('Template breakpoint')
        // await sendTemplateMessage(to)
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



app.post("/webhook",(req,res)=>{ //i want some

    let body_param=req.body;

    console.log(JSON.stringify(body_param,null,2));

    if(body_param.object){
        console.log("inside body param");
        if(body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]
        ){
            let phone_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

            console.log("phone number "+phone_no_id);
            console.log("from "+from);
            console.log("boady param "+msg_body);

            axios({
                method:"POST",
                url:"https://graph.facebook.com/v13.0/"+phone_no_id+"/messages?access_token="+API_TOKEN,
                data:{
                    messaging_product:"whatsapp",
                    to:from,
                    text:{
                        body:"Hello, You send this >>>>>> "+msg_body
                    }
                },
                headers:{
                    "Content-Type":"application/json"
                }

            });

            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }

    }

});



app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
