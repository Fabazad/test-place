const ProductController = require('../controllers/product.controller');
const middlewares = require("../middlewares/middlewares");
const withAuth = require('../middlewares/withAuth');
const express = require('express');
const router = express.Router();

router.get('/srapFromAsin/:asin', withAuth, async (request, reply) => {
    const {asin} = request.params;
    ProductController.scrapFromAsin(asin)
        .then((res) => reply.status(200).send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/create', withAuth, async (request, reply) => {
    const {item} = request.body;
    ProductController.create(item, request.userId)
        .then((res) => reply.status(200).send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.get('/find', async (request, reply) => {
    const {searchData} = request.query;
    ProductController.find(JSON.parse(searchData))
        .then((res) => reply.status(200).send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.get('/categories', async (request, reply) => {
    ProductController.getCategories()
        .then((res) => reply.status(200).send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.get('/:productId', async (request, reply) => {
    const {productId} = request.params;
    ProductController.getOne(productId)
        .then((res) => reply.status(200).send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

module.exports = router;