var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
    return processFormFields(req, res);
});

module.exports = router;

