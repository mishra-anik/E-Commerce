const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
	street: { type: String },
	city: { type: String, required: true },
	state: { type: String, required: true },
	country: { type: String, required: true },
	zip: { type: String, required: true },
	isDefault: { type: Boolean, default: false },
});

const orderSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, required: true },
		products: [
			{
				item: {
					productId: {
						type: mongoose.Schema.Types.ObjectId,
						required: true,
					},
					quantity: { type: Number, default: 1 },
				},

				amount: {
					price: { type: Number, required: true },
					currency: {
						type: String,
						enum: ["USD", "EUR", "INR"],
						default: "INR",
					},
				},
			},
		],
		totalAmount: {
			amount: { type: Number, required: true },
			currency: {
				type: String,
				enum: ["USD", "EUR", "INR"],
				default: "INR",
			},
		},
		status: {
			type: String,
			enum: ["PENDING", "CONFIRMED", "CANCELLED", "SHIPPED", "DELIVERED"],
			default: "PENDING",
		},

		shippingAddress: { type: addressSchema, required: true },
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
