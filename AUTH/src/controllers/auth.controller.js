const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redis = require("../db/redis");


const registerController = async (req, res) => {
	const { username, email, password } = req.body;

	const isUserExist = await User.findOne({
		$or: [{ username: username }, { email: email }],
	});
	if (isUserExist) {
		return res.status(400).json({ message: "User already exists" });
	}

	const hashpassword = await bcrypt.hash(password, 10);

	const newUser = await User.create({
		username,
		email,
		password: hashpassword,
	});

	const token = jwt.sign(
		{ id: newUser._id, username: newUser.username, role: newUser.role },
		process.env.JWT_SECRET
	);

	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
	});
	res.status(201).json({
		message: "User registered successfully",
		user: newUser,
	});
};


const loginController = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email }).select("+password");
	if (!user) {
		return res.status(400).json({ message: "Invalid email or password" });
	}
	const isPasswordMatch = await bcrypt.compare(password, user.password);
	if (!isPasswordMatch) {
		return res.status(400).json({ message: "Invalid email or password" });
	}
	const token = jwt.sign(
		{ id: user._id, username: user.username },
		process.env.JWT_SECRET
	);

	res.cookie("token", token);
	res.status(200).json({ message: "User logged in successfully", user });
};


const authmeController = async (req, res) => {
	const user = req.user;
	return res.status(200).json({
		user,
		message: "User authenticated successfully",
	});
};


const logoutController = async (req, res) => {
	const token = req.cookies.token;
	if (token) {
		await redis.set(`blacklist:${token}`, "true", 1000 * 60 * 60 * 24 * 7);
	}
	return res
		.clearCookie("token")
		.status(200)
		.json({ message: "Logged out successfully" });
};


const getUserAddressesController = async (req, res) => {
	const id = req.user._id;
	const user = await User.findById(id).select("address");
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	return res.status(200).json({ address: user.address });
};


const addUserAddressesController = async (req, res) => {
	const id = req.user._id;
	const { street, city, state, country, zip, isDefault } = req.body;

	const user = await User.findOneAndUpdate(
		{ _id: id },
		{
			$push: {
				address: { street, city, state, country, zip, isDefault },
			},
		},
		{ new: true }
	);

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	return res.status(200).json({
		message: "Address added successfully",
		address: user.address,
	});
};


const deleteUserAddressesController = async (req, res) => {
	const id = req.user._id;
	const { addressid } = req.params;
	const addressExist = await User.findOne({
		"_id": id,
		"address._id": addressid,
	});
	if (!addressExist) {
		return res.status(404).json({ message: "Address not found" });
	}
	const user = await User.findOneAndUpdate(
		{ _id: id },
		{
			$pull: {
				address: { _id: addressid },
			},
		},
		{ new: true }
	);
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	return res.status(200).json({
		message: "Address deleted successfully",
		address: user.address,
	});
};


module.exports = {
	registerController,
	loginController,
	authmeController,
	logoutController,
	getUserAddressesController,
	deleteUserAddressesController,
	addUserAddressesController,
};
