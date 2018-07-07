const express = require('express');
const formidable = require('formidable');
const transporter = require('../lib/transporter');
const db = require('../lib/database').connect();
const config = require('../lib/config');

/* eslint-disable-next-line new-cap */
var router = express.Router();

router.post('/', (req, res) => processFormFields(req, res));

// Process Form Fields
function processFormFields(req, res) {
    let text = '';
    let to = process.env.TO;
    let replyTo;
    let redirectTo;
    let formName;
    let botTest = true;
    let form = new formidable.IncomingForm();

    form.on('field', (field, value) => {
        if (field === "_to") to = value;
        else if (field === "_replyTo") replyTo = value;
        else if (field === "_redirectTo") redirectTo = value;
        else if (field === "_formName") formName = value;
        else if (field === "_t_email") botTest = value === "";
        else {
            text += `**${field}**: ${value}  \n`;
        }
    });

    form.on('end', () => {
        if (redirectTo) {
            res.writeHead(302, {
                'location': redirectTo
            })
        }
        else {
            res.render('success', { message: config.messageSubject });
        }
        if (botTest) {
            console.log("The submission is probably no spam. Sending mail...");
            sendMail(text, to, replyTo, formName);
        } else {
            console.log(`Didn't send mail. It's probably spam. From: ${replyTo} Message: ${text}`);
        }
        addSubmissionToDB(formName, replyTo, text, botTest ? 1 : 2);
        res.end();
    });
    form.parse(req);
}

function addSubmissionToDB(formName, replyTo, text, sent) {
    db.run(
        'INSERT INTO submissions VALUES (NULL, ?, ?, ?, ?, ?)', 
        [Date.now(), formName, replyTo, text, sent], 
        (err) => {
            if (err) return console.log(err.message);
            console.log('Entry added to DB');
        }
    );
}

// Send mail with text
function sendMail(markdown, to, replyTo, formName) {
    if (process.env.ALLOWED_TO) {
        if (!process.env.ALLOWED_TO.includes(to)) {
            console.log("Tried to send to %s, but that isn't allowed. Sending to %s instead.", to, process.env.TO);
            to = process.env.TO;
        }
    }

    // Setup mail
    let mailOptions = {
        from: process.env.FROM,
        to: to || process.env.TO,
        replyTo: replyTo || process.env.FROM,
        subject: `New submission${formName ? ` on ${formName}` : ''}`,
        markdown: `**New submission:**  \n  \n${markdown}`
    };
    console.log('Sending mail: ', mailOptions);

    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Mail %s sent: %s', info.messageId, info.response);
    });
}

module.exports = router;

