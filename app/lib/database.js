
const sqlite = require('sqlite3').verbose();
const config = require('./config');
var db = new sqlite.Database(config.database);

function connect() {
    return db;
}

function disconnect() {
	db.close();
}

function create() {
    db.run('CREATE TABLE IF NOT EXISTS submissions (id INTEGER PRIMARY KEY AUTOINCREMENT, time INTEGER, formName TEXT, replyTo TEXT, text TEXT, sent INTEGER)', (err) => {
        if (err) return console.log(err.message);
        console.log('Database initialized');
    });
}

// Create DB if it doesn't exist
create();

module.exports = {
	create,
	connect,
	disconnect
};
