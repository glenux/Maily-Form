var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    return showServiceRunning(res);
});

// Show message that service is running
function showServiceRunning(res) {
    res.render('index');
}

module.exports = router;

