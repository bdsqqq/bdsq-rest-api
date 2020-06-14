import { Request, Response,  } from 'express'
import nodemailer from "nodemailer";


const config = {
    host: process.env.HOST,
    hostport: process.env.HOSTPORT,
    emailContato: process.env.emailContato,
    passEmailContato: process.env.passEmailContato,
    emailReceber: process.env.emailReceber
};

class MailController {
    post(req:Request, res:Response){
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
    }
}

export default MailController;