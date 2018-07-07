
const nodemailer = require('nodemailer');
const config = require('./config');
const markdown = require('nodemailer-markdown').markdown;

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

// Use Markdown
transporter.use('compile', markdown());

module.exports = transporter;
