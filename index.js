
const adminRouter = require('./routes/admin');
const cors = require('cors');
const express = require('express');
const formsRouter = require('./routes/forms');
const markdown = require('nodemailer-markdown').markdown;
const rootRouter = require('./routes/root');
const sqlite = require('sqlite3').verbose();
const transporter = require('./lib/transporter');
const config = require('./lib/config');

// Setup server
const app = express();
app.set('view engine', 'pug');
app.use(cors({origin: config.accessControlAllowOrigin }));
app.use(express.static('public'));

app.use('/', rootRouter);
app.use('/', formsRouter);
if (config.adminUsername && config.adminPassword) {
	app.use('/admin', adminRouter);
}

const listener = app.listen(config.port, () => {
    console.log("server listening on ", listener.address().port);
});



// Use Markdown
transporter.use('compile', markdown());

module.exports = app;
