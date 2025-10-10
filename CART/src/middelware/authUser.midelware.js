const jwt = require("jsonwebtoken");

const authUser = (roles = ["user"]) => {
	return async (req, res, next) => {
		const token = req.cookies.token;
		if (!token) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		if (!roles.includes(decoded.role)) {
			return res.status(403).json({ message: "Forbidden" });
		}
		req.user = decoded;
		next();
	};
};

module.exports = authUser;
