const Order = require("../model/order.model");
const axios = require("axios");

const createOrder = async (req, res) => {
	const user = req.user;
	const token =
		req.cookies.token ||
		req.header("Authorization")?.replace("Bearer ", "");

	try {
		const cartResponse = await axios.get(
			`http://localhost:3002/api/cart/`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		const products = await Promise.all(
			cartResponse.data.Cart.products.map(async (item) => {
				const productResponse = await axios.get(
					`http://localhost:3002/api/products/${item.productId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				return {
					product: productResponse.data,
					quantity: item.quantity, // Corrected to use item.quantity
				};
			})
		);

		let totalprice = 0;

		const orderProducts = products.map((item) => {
			const { product, quantity } = item;
			if (product.stock < quantity) {
				throw new Error(`Product ${product.title} is out of stock`);
			}

			const totalAmount = quantity * product.price.amount;
			totalprice += totalAmount;

			return {
				product: product.id,
				quantity,
				price: {
					amount: totalAmount,
					currency: product.price.currency,
				},
			};
		});

		const order = await Order.create({
			user: user.id,
			products: orderProducts,
			totalAmount: {price:totalprice , currency: orderProducts[0]?.price.currency || "INR"}, // Corrected to use totalprice
			status: "pending",
			shippingAddress: {
				street: req.body.shippingAddress.street,
				city: req.body.shippingAddress.city,
				state: req.body.shippingAddress.state,
				country: req.body.shippingAddress.country,
				zip: req.body.shippingAddress.zip,
			},
		});

		return res
			.status(201)
			.json({ message: "Order placed successfully", order });
	} catch (err) {
		console.error(err); // Added logging for debugging
		return res.status(500).json({ message: err.message });
	}
};

module.exports = { createOrder };
