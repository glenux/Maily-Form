
const auth = require('http-auth');
const express = require('express');
const marked = require('marked');

var router = express.Router();

const basic = auth.basic({
    realm: "Maily-Form Administration"
}, (username, password, callback) => {
    callback(username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD);
});

router.get('/admin', auth.connect(basic), (req, res) => showAdminUI(1, res));

router.get('/admin/spam', auth.connect(basic), (req, res) => showAdminUI(2, res));

router.delete('/admin/:id', auth.connect(basic), (req, res) => {
    deleteSubmissionFromDB(req.params.id);

    return returnResult(res);
});

// Show admin UI
function showAdminUI(sent, res) {
    getSubmissionsFromDB(sent, (err, submissions) => {
        if (err) res.render('error', {message: err});
        else {
            res.render('admin', {
                message: marked(sent === 2 ? '**Spam submissions** ([All](/admin)):' : '**All submissions** ([Spam](/admin/spam)):'),
                submissions: submissions.map((submission) => ({
                    id: submission.id,
                    time: (new Date(submission.time).toLocaleString()),
                    formName: submission.formName,
                    replyTo: submission.replyTo,
                    text: marked(submission.text).replace(/\n*$/, "")
                }))
            });
        }
    });
}

function deleteSubmissionFromDB(id) {
	let sqlite = global.sqlite;
    let db = new sqlite.Database('data/submissions.db');
    db.run('DELETE FROM submissions WHERE id=(?)', [id], (err) => {
        if (err) console.log(err);
        else console.log('Entry deleted from DB');
    });
    db.close();
}

// Return result
function returnResult(res) {
    res.json({result: "success"});
}

function getSubmissionsFromDB(sent, callback) {
	let sqlite = global.sqlite;
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

module.exports = router;

