const express = require('express');
const router = express.Router();
const path = require('path');

["*", 'login', 'register', 'landing', 'my-profile', "reset-password/*", "email-validation/*", 'search*', 'dashboard/*', 'ad/*']
    .forEach(route => {
        router.get(route, async (req, res) => {
            res.sendFile(path.join(__dirname, '../../client/build/index.html'));
        });
    });

module.exports = router;