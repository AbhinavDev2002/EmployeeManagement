const express = require('express');
const router = express.Router();
const {sendRequest, submitRequest, deleteRequest} = require('../controllers/request')

router.route('/all')
    .get(sendRequest)

router.route('/')
    .post(submitRequest)

router.route('/:email')
    .delete(deleteRequest)

module.exports = router;