const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

const validAddItemToCart = [
	body("productID")
		.notEmpty()
		.withMessage("User ID is required")
		.custom((value) => {
			return mongoose.Types.ObjectId.isValid(value);
		})
		.withMessage("Invalid Product ID"),

	body("qty")
		.isInt({ gt: 0 })
		.withMessage("Quantity should be must be greater positive integer"),
	validate,
];

module.exports = { validAddItemToCart };
