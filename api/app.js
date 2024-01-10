const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const amqp = require("amqplib");
require('dotenv').config()
const app =express();
const planController = require('./controllers/planController')
const rabbitmq = require('./rabbitMQ/rabbitMQ')

//conecting to mongodb
mongoose.connect('mongodb://localhost:27017/plans', {useNewUrlParser: true, useUnifiedTopology: true})
        .then((result)=> {
            console.log("mongo db connected")
            app.listen(process.env.PORT);
            console.log("listening to requests on", process.env.PORT)
        })
        .catch((err)=> console.log(err.message));



// async function sendData (data) {
//     // send data to queue
//     await channel.sendToQueue("post plan", Buffer.from(JSON.stringify(data)));
        
//     // close the channel and connection
//     //await channel.close();
//     //await connection.close(); 
// }
rabbitmq.connectQueue();
// Connect to RabbitMQ when the script is run

app.use('/plans', require('./routes/planRoutes'));

//error handling 
app.use(function(err,req,res,next)
{
    //console.log(err);
    //error to send error message
    res.status(422).send({error : err.message});
});

