const express = require('express');
const cors = require('cors')
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const fetch = require('node-fetch');
const http = require("http");



const app = express();// Allow any method from any host and log requests

require('dotenv').config()

async function getWeatherData(){
    const response = await fetch(process.env.WEATHER_API_URL+process.env.WEATHER_API_KEY);
    const data = await response.json();
    console.log(data.weather[0].main)
    return data.weather[0].main
}

const routes = express.Router();
const config = {
    host: process.env.HOST,
    hostport: process.env.HOSTPORT,
    emailContato: process.env.emailContato,
    passEmailContato: process.env.passEmailContato,
    emailReceber: process.env.emailReceber
};

let weatherData = undefined

setInterval(() => {weatherData = getWeatherData()}, 10000);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    if('OPTIONS' === req.method) {
        res.sendStatus(200);
    } else {
        console.log(`${req.ip} ${req.method} ${req.url}`);
        next();
    }
});

// Handle POST requests that come in formatted as JSON
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

routes.get('/', (req, res) => {
    res.send("Hello World!");
});

app.use('/', routes);

app.get('/weather/test', async (req, res) => {
    res.send(await weatherData);
});

app.post('/send/mail', (req, res) => {
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {

    // create reusable transporter object using the default SMTP transport

        const smtpConfig = {
            host: 	config.host,
            port: 	config.hostport ,
            secure: false, // true for 465, false for other ports
            auth: {
                user: config.emailContato, // generated ethereal user
                pass: config.passEmailContato // generated ethereal password
            },
            to: config.emailReceber
        }

        let transporter = nodemailer.createTransport(smtpConfig);

        transporter.verify((err, success) => {
            if (err) console.error(err);
            console.log('Your config is correct');
            console.log(config.emailReceber)
        });
    
        let info = await transporter.sendMail({
        from: `${req.body.inputEmail} <${config.emailContato}>`,
        to: config.emailReceber, // list of receivers
        subject: `${req.body.inputName} ${req.body.inputEmail}`, // Subject line
        text: `Nome: ${req.body.inputName} Mensagem: ${req.body.inputMessage}`, // plain text body
        html: `<b>Nome:</b><br>
            <p>${req.body.inputName}</p>
            <b>Mensagem:</b><br>
            <p>${req.body.inputMessage}</p><br>
            <span>ass: - ${req.body.inputEmail}</span>` // html body
        });

        transporter.sendMail(smtpConfig, function(error, info){
            if (error){
               console.log(error);
            //    res.json({yo: 'error'});
            //    res.sendStatus(500);
            } else{
               console.log('Message sent: ' + info.response);
            //    res.sendStatus(200);
            };
            return res.end();
        });
    }
  
    main().catch(console.error);
});

app.listen(process.env.PORT, () => {
    console.log(`Server now listening on ${process.env.PORT}`);
});

