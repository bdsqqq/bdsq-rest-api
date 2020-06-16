import express from 'express';
import bodyParser from "body-parser";
import dotenv from 'dotenv'

import './config'
import routes from './routes';

const app = express();// Allow any method from any host and log requests

dotenv.config();

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

app.use(express.json()); // Handle POST requests that come in formatted as JSON
app.use(bodyParser.urlencoded({extended: true}));

app.use(routes);

app.listen(process.env.PORT, () => {
    console.log(`Server now listening on ${process.env.PORT}`);
});

