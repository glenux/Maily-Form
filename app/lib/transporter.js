
const nodemailer = require('nodemailer');
const config = require('./config');

// Setup nodemailer
const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    secure: config.emailSecure === "true",
    auth: {
        user: config.emailUser,
        pass: config.emailPass
    }
});

module.exports = transporter;
