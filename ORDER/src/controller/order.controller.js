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
				headers: { Authorization: `Bearer ${token}` },
			}
		);

		// Handle empty cart
		const cartItems = cartResponse.data.cart.items;
		if (!cartItems || cartItems.length === 0) {
			return res.status(400).json({ message: "Cart is empty" });
		}

		const productPromises = cartItems.map((item) =>
			axios.get(`http://localhost:3002/api/products/${item.productId}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
		);

		const productResponses = await Promise.all(productPromises);

		let totalprice = 0;

		const orderProducts = productResponses.map((response, index) => {
			const product = response.data;
			const quantity = cartItems[index].quantity;

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
			totalAmount: {
				price: totalprice,
				currency: orderProducts[0]?.price.currency || "INR",
			},
			status: "pending",
			shippingAddress: req.body.shippingAddress,
		});

		return res
			.status(201)
			.json({ message: "Order placed successfully", order });
	} catch (err) {
		console.error("Order creation failed:", err.message);
		if (err.response && err.response.status === 401) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		return res.status(500).json({ message: err.message });
	}
};

const getMyOrders = async (req, res) => {
	const user = req.user;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const skip = (page - 1) * limit;

	try {
		const orders = await Order.find({ user: user.id })
			.skip(skip)
			.limit(limit)
			.sort({ createdAt: -1 });
		const totalOrders = await Order.countDocuments({ user: user.id });

		return res.status(200).json({
			orders,
			meta: {
				totalOrders,
				totalPages: Math.ceil(totalOrders / limit),
				currentPage: page,
			},
		});
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

const getOrderById = async (req, res)=>{
	const user = req.user;
	const orderId = req.params.id;

	try{
		const order = await Order.findOne({_id: orderId});
		if(!order){
			return res.status(404).json({message: "Order not found"});
		}
		return res.status(200).json({order});
	}catch(err){
		return res.status(500).json({message: err.message});
	}
}

const cancelOrderById = async (req, res)=>{
	const user = req.user;
	const orderId = req.params.id;
	try{
		const order = await Order.findOne({_id: orderId})
		if(!order){
			return res.status(404).json({message: "Order not found"});
		}
		if(order.status != "PENDING"){
			return res.status(400).json({message: "Only pending orders can be cancelled"});
		}

		order.status = "CANCELLED";
		await order.save();
		return res.status(200).json({message: "Order cancelled successfully", order});	

	}catch(err){
		return res.status(500).json({message: err.message});
	}
}


const updateOrderAddressById = async (req, res)=>{
	const user = req.user;

	const orderId = req.params.id;
	const newAddress = req.body.shippingAddress;
	try{
		const order = await Order.findOne({_id: orderId , user: user.id});
		if(!order){
			return res.status(404).json({message: "Order not found"});
		}
		if(order.status === "SHIPPED" || order.status === "DELIVERED"){
			return res.status(400).json({message: "Only shipped or delivered orders address can be updated"});
		}
		order.shippingAddress = newAddress;
		await order.save();
		return res.status(200).json({message: "Order address updated successfully", order});
	}catch(err){
		return res.status(500).json({message: err.message});
	}
}



module.exports = { createOrder , getMyOrders , getOrderById, cancelOrderById, updateOrderAddressById};
