const { body, validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

const validOrder = [
	body("shippingAddress")
		.notEmpty()
		.withMessage("Shipping address is required"),
	body("shippingAddress.street").notEmpty().withMessage("Street is required"),
	body("shippingAddress.city").notEmpty().withMessage("City is required"),
	body("shippingAddress.state").notEmpty().withMessage("State is required"),
	body("shippingAddress.country")
		.notEmpty()
		.withMessage("Country is required"),
	body("shippingAddress.zip").notEmpty().withMessage("Zip code is required"),
	validateRequest,
];

module.exports = { validOrder };
