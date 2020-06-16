import express from 'express';
import MailController from "./controllers/mailController";
import Fetcher from './services/fetcher'

const routes = express.Router();
const mailController = new MailController
const fetcher = new Fetcher

let weatherData = fetcher.getWeatherData();
let issData = fetcher.getIssData();
let corongaData = fetcher.getCorongaData();

setInterval(() => {weatherData = fetcher.getWeatherData()}, 10000);
setInterval(() => {issData = fetcher.getIssData()}, 2500);
setInterval(() => {corongaData = fetcher.getCorongaData()}, 36000);


routes.get('/', (req, res) => {
    res.send("Olá, esta API busca servir meus proprios aplicativos, essa pagina serve para dizer que a API está online mas suas funcionalidades são apenas para uso pessoal");
});

routes.get('/weather/test', async (req, res) => {
    res.send(await weatherData);
});

routes.get('/iss/getdata', async(req, res) => {
    res.set('Content-Type', 'application/json');
    res.json(await issData);
});

routes.get('/coronga/getcoronga', async(req, res) => {
    res.set('Content-Type', 'application/json');
    res.json(await corongaData);
});

routes.post('/send/mail', mailController.post)


export default routes