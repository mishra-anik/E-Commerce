const {Router} = require('express');
const {validOrder} = require('../middelware/validate');
const {createAuth} = require('../middelware/auth.middelware');

const orderController = require('../controller/order.controller');


const orderRouter = Router();

orderRouter.post('/',createAuth,validOrder,orderController.createOrder);


module.exports = orderRouter;
