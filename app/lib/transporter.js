
const nodemailer = require('nodemailer');
const config = require('./config');
const markdown = require('nodemailer-markdown').markdown;

// Setup mailer
const transporterConfig = {
    host: config.emailHost,
    port: config.emailPort,
    secure: config.emailSecure === "true",
    auth: (config.emailAuth ? {
        user: config.emailUser,
        pass: config.emailPass
    } : null)
};

const transporter = nodemailer.createTransport(transporterConfig);

// Use Markdown
transporter.use('compile', markdown());

module.exports = transporter;
