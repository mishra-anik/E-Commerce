const { Router } = require('express');
const {validateRegister , validateLogin} = require('../midelwares/auth.midelware');
const { registerController, loginController,authmeController , logoutController} = require('../controllers/auth.controller');

const authRoute = Router();

authRoute.post('/register',validateRegister, registerController)

authRoute.post('/login',validateLogin, loginController)

authRoute.get('/me', authmeController);

authRoute.post('/logout', logoutController);

module.exports = authRoute;