const { Router } = require("express");
const authUser = require("../midelwares/authUser.midelware");
const {
	validateRegister,
	validateLogin,
	validateAddAddress,
} = require("../midelwares/auth.midelware");
const {
	registerController,
	loginController,
	authmeController,
	logoutController,
	getUserAddressesController,
	addUserAddressesController,
	deleteUserAddressesController,
} = require("../controllers/auth.controller");

const authRoute = Router();

authRoute.post("/register", validateRegister, registerController);

authRoute.post("/login", validateLogin, loginController);

authRoute.post("/logout", logoutController);

authRoute.get("/me", authUser, authmeController);

authRoute.get("/users/me/addresses", authUser, getUserAddressesController);

authRoute.post(
	"/users/me/addresses",
	authUser,
	validateAddAddress,
	addUserAddressesController
);

authRoute.delete(
	"/users/me/addresses/:addressid",
	authUser,
	deleteUserAddressesController
);
module.exports = authRoute;
