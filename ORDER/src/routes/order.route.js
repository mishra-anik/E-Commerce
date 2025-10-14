const { Router } = require("express");
const { validOrder } = require("../middelware/validate");
const { createAuth } = require("../middelware/auth.middelware");

const orderController = require("../controller/order.controller");

const orderRouter = Router();

orderRouter.post(
	"/",
	createAuth(["user"]),
	validOrder,
	orderController.createOrder
);

orderRouter.get("/me", createAuth(["user"]), orderController.getMyOrders);

orderRouter.get(
	"/:id",
	createAuth(["user", "admin"]),
	orderController.getOrderById
);

orderRouter.patch(
	"/:id/cancel",
	createAuth(["user"]),
	orderController.cancelOrderById
);

orderRouter.patch(
	"/:id/address",
	createAuth(["user"]),
	validOrder,
	orderController.updateOrderAddressById
);

module.exports = orderRouter;
