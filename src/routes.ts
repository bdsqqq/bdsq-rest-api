import express from 'express';
import MailController from "./controllers/mailController";

const routes = express.Router();
const mailController = new MailController

routes.get('/', (req, res) => {
    res.send("Olá, esta API busca servir meus proprios aplicativos, essa pagina serve para dizer que a API está online mas suas funcionalidades são apenas para uso pessoal");
});

routes.post('/send/mail', mailController.post)


export default routes