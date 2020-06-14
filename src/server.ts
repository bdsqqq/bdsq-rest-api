import express from 'express';
import bodyParser from "body-parser";
import fetch from 'node-fetch';
import dotenv from 'dotenv'

import './config'
import routes from './routes';

const app = express();// Allow any method from any host and log requests

dotenv.config()

async function getWeatherData(){
    const response = await fetch(process.env.WEATHER_API_URL+process.env.WEATHER_API_KEY);
    const data = await response.json();
    console.log(data.weather[0].main)
    return data.weather[0].main
}

async function getCorongaData(){
    const response = await fetch('https://covid2019-api.herokuapp.com/v2/country/brazil');
    const data = await response.json();
    console.log(data)
    return data
}

async function getIssData(){
    const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    const data = await response.json();
    console.log(data)
    return data
}

let weatherData = getWeatherData();
let issData = getIssData();
let corongaData = getCorongaData();

setInterval(() => {weatherData = getWeatherData()}, 10000);
setInterval(() => {issData = getIssData()}, 2500);
setInterval(() => {corongaData = getCorongaData()}, 36000);

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

app.get('/weather/test', async (req, res) => {
    res.send(await weatherData);
});

app.get('/iss/getdata', async(req, res) => {
    res.set('Content-Type', 'application/json');
    res.json(await issData);
});

app.get('/coronga/getcoronga', async(req, res) => {
    res.set('Content-Type', 'application/json');
    res.json(await corongaData);
});

app.use(routes);

app.listen(process.env.PORT, () => {
    console.log(`Server now listening on ${process.env.PORT}`);
});

