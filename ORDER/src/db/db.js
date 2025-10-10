const mongoose = require("mongoose");

const connectDB = () => {
	try {
		mongoose.connect(process.env.MONGO_URI);
		console.log("Databse connected");
	} catch (error) {
		console.log("Error database", error);
	}
};

module.exports = connectDB;
