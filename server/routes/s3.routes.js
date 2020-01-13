const S3Controller = require('../controllers/s3.controller')
const express = require('express');
const router = express.Router();

router.post('/sign-s3', async (request, reply) => {
    const {fileName, fileType} = request.body;
    S3Controller.signS3(fileName, fileType)
        .then((res) => reply.status(200).send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

module.exports = router;