const ProductController = require('../controllers/product.controller');
const withAuth = require('../middlewares/withAuth');
const decode = require('../middlewares/decode');
const express = require('express');
const router = express.Router();
const {ROLES} = require("../helpers/constants");

router.get('/srapFromAsin/:asin', withAuth(ROLES.SELLER), async (request, reply) => {
    const {asin} = request.params;
    ProductController.scrapFromAsin(asin)
        .then((res) => reply.status(200).send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/create', withAuth(ROLES.SELLER), async (request, reply) => {
    const {item} = request.body;
    ProductController.create(item, request.decoded.userId)
        .then((res) => reply.status(200).send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.get('/find', decode, async (request, reply) => {
    const {searchData} = request.query;
    ProductController.find(request.decoded, JSON.parse(searchData))
        .then((res) => reply.status(200).send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.get('/categories', async (request, reply) => {
    ProductController.getCategories()
        .then((res) => reply.status(200).send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.get('/:productId', async (request, reply) => {
    const { productId } = request.params;
    ProductController.getOne(productId)
        .then((res) => reply.status(200).send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.post('/update', withAuth(ROLES.SELLER), async (request, reply) => {
    const { itemId, fields } = request.body;
    ProductController.update(itemId, fields, request.decoded)
        .then((res) => reply.status(200).send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

router.delete('/:productId', withAuth(ROLES.SELLER), async (request, reply) => {
    const { productId } = request.params;
    ProductController.delete(productId, request.decoded.userId)
        .then((res) => reply.status(200).send(res))
        .catch(err => reply.status(err.status).send(err.message));
});

module.exports = router;