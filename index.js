const express = require('express');
const formidable = require('formidable');
const nodemailer = require('nodemailer');
const markdown = require('nodemailer-markdown').markdown;
const marked = require('marked');
const sqlite = require('sqlite3').verbose();
const cors = require('cors');

var rootRouter = require('./routes/root');
var formsRouter = require('./routes/forms');
var adminRouter = require('./routes/admin');

// Create DB if it doesn't exist
createDB();

// Setup server
const app = express();
app.set('view engine', 'pug');
app.use(cors({origin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN }));
app.use(express.static('public'));

app.use('/', rootRouter);
app.use('/', formsRouter);
if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
	app.use('/admin', adminRouter);
}

const listener = app.listen(process.env.PORT || 8080, () => {
    console.log("server listening on ", listener.address().port);
});

// Show message that service is running
function showServiceRunning(res) {
    res.render('index');
}

// Return result
function returnResult(res) {
    res.json({result: "success"});
}


// Process Form Fields
function processFormFields(req, res) {
    let text = "";
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
            res.render('success', {message: (process.env.MESSAGE || 'Thank you for your submission.')});
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

function createDB() {
    let db = new sqlite.Database('data/submissions.db');
    db.run('CREATE TABLE IF NOT EXISTS submissions (id INTEGER PRIMARY KEY AUTOINCREMENT, time INTEGER, formName TEXT, replyTo TEXT, text TEXT, sent INTEGER)', (err) => {
        if (err) return console.log(err.message);
        console.log('Database initialized');
    });
    db.close();
}

function addSubmissionToDB(formName, replyTo, text, sent) {
    let db = new sqlite.Database('data/submissions.db');
    db.run('INSERT INTO submissions VALUES (NULL, ?, ?, ?, ?, ?)', [Date.now(), formName, replyTo, text, sent], (err) => {
        if (err) return console.log(err.message);
        console.log('Entry added to DB');
    });
    db.close();
}

function getSubmissionsFromDB(sent, callback) {
    let db = new sqlite.Database('data/submissions.db');
    let sql = `SELECT * FROM submissions ORDER BY time DESC`;
    if (sent) sql = `SELECT * FROM submissions WHERE sent = ${sent} ORDER BY time DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log(err);
            callback(err, null);
        }
        else callback(null, rows);
    });
    db.close();
}

function deleteSubmissionFromDB(id) {
    let db = new sqlite.Database('data/submissions.db');
    db.run('DELETE FROM submissions WHERE id=(?)', [id], (err) => {
        if (err) console.log(err);
        else console.log('Entry deleted from DB');
    });
    db.close();
}

// Setup nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
// Use Markdown
transporter.use('compile', markdown());

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
