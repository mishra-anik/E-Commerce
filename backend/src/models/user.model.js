const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
	street: { type: String },
	city: { type: String, required: true },
	state: { type: String, required: true },
	country: { type: String, required: true },
	zip: { type: String, required: true },
	isDefault: { type: Boolean, default: false },
});
const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		uniue: true,
	},

	email: {
		type: String,
		required: true,
		unique: true,
	},
	role: {
		type: String,
		enum: ["user", "seller", "admin"],
		default: "user",
	},
	password: {
		type: String,
		required: true,
		select: false,
	},

	address: [addressSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
