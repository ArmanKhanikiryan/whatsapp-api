const express=require("express");
const axios=require("axios");
require('dotenv').config();

const app=express().use(express.json());
const API_TOKEN = 'EAAGqZBSfdTh4BO4utiQpMnDZBQcdapO5VcY1FxjPoLWhfreWfPVnAqVLW8emntZABBDm8gFkA9ZAph81QXVDA0ZBIckwZCEMejN8B7ihxhf4dJzPfrCqSNtuau4HvloJCZC3xgZC6aXwmLSfy6Jdkjzcs4FMPApC9Tfd9tQ8oXo0oVPjhOXQyziZAZBmgtZApfLDlZCPS7lwyax39EKk7ti56FcZD';

app.listen(process.env.PORT,()=>{
    console.log("webhook is listening");
});

app.get("/webhook",(req,res)=>{
    res.status(200).send(req.query["hub.challenge"]);
});

app.post("/webhook",(req,res)=>{ //i want some

    let body_param=req.body;

    console.log(JSON.stringify(body_param,null,2));
    if(body_param.object){
        console.log("inside body param");
        let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
        let from = body_param.entry[0].changes[0].value.messages[0].from;
        let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

        console.log("phone number "+phon_no_id);
        console.log("from "+from);
        console.log("boady param "+msg_body);

        axios({
            method:"POST",
            url:"https://graph.facebook.com/v13.0/"+phon_no_id+"/messages?access_token="+API_TOKEN,
            data:{
                messaging_product:"whatsapp",
                to:from,
                text:{
                    body:"Hi.. I'm Prasath, your message is "+msg_body
                }
            },
            headers:{
                "Content-Type":"application/json"
            }
        });
        res.sendStatus(200);
    }
});

app.get("/",(req,res)=>{
    res.status(200).send("hello this is webhook setup");
});