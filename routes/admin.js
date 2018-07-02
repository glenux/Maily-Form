var express = require('express');
const auth = require('http-auth');
var router = express.Router();

const basic = auth.basic({
    realm: "Maily-Form Administration"
}, (username, password, callback) => {
    callback(username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD);
});

router.get('/admin', auth.connect(basic), (req, res) => {
    return showAdminUI(1, res);
});

router.get('/admin/spam', auth.connect(basic), (req, res) => {
    return showAdminUI(2, res);
});

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
                submissions: submissions.map(submission => {
                    return {
                        id: submission.id,
                        time: new Date(submission.time).toLocaleString(),
                        formName: submission.formName,
                        replyTo: submission.replyTo,
                        text: marked(submission.text).replace(/\n*$/, "")
                    };
                })
            });
        }
    });
}

module.exports = router;

