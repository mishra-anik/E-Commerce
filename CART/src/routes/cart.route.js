const { Router } = require("express");
const router = Router();
const cart = require("../controller/cart.controller");
const authUser = require("../middelware/authUser.midelware");
const { validAddItemToCart } = require("../middelware/cart.validation");
const { validAddItemToCart } = require("../middelware/cart.validation");

router.get("/", authUser(["user"]), cart.getCart);

router.post("/items", authUser(["user"]), validAddItemToCart, cart.addCart);

router.patch("/items/:itemId", authUser(["user"]), cart.updateCart);

router.delete("/items/:itemId", authUser(["user"]), cart.removeItemFromCart);

router.delete("/items", authUser(["user"]), cart.removeAllItemsFromCart);

module.exports = router;
