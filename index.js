
const path = require('path');
const cors = require('cors');
const express = require('express');

const adminRouter = require(path.join(__dirname, '/app/routes/admin'));
const formsRouter = require(path.join(__dirname, '/app/routes/forms'));
const rootRouter = require(path.join(__dirname, '/app/routes/root'));
const config = require(path.join(__dirname, '/app/lib/config'));

// Setup server
const app = express();

// Configure server
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/app/views'));
app.use(cors({origin: config.accessControlAllowOrigin }));
app.use(express.static('public'));

// Attach routes
app.use('/', rootRouter);
app.use('/', formsRouter);
if (config.adminUsername && config.adminPassword) {
	app.use('/admin', adminRouter);
}

// run server
const listener = app.listen(config.port, () => {
    console.log("server listening on ", listener.address().port);
});

module.exports = app;

