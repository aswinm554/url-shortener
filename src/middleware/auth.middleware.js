const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/response");

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return sendError(res, "No token provided", 401)
        }
        const actualToken = token.split(" ")[1];
        const decoded = jwt.verify(actualToken, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();


    } catch (error) {
        return sendError(res, "Invalid or expired token", 401);
    }
};

module.exports = { auth };