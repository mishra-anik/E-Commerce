const { head } = require("../app");
const jwt = require("jsonwebtoken");

const createAuth = (roles = ["user"]) => {
	return (req, res, next) => {
		const token =
			req.cookies.token ||
			header("Authorization")?.replace("Bearer ", "");
		if (!token) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			if (!roles.includes(decoded.role)) {
				return res.status(403).json({ message: "Forbidden" });
			}
			req.user = decoded;
			next();
		} catch (err) {
			return res.status(401).json({ message: "Invalid token", err });
		}
	};
};

module.exports = { createAuth };
