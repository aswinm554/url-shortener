const User = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { sendSuccess, sendError } = require("../utils/response");

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return sendError(res, "All fields are required", 400);

        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendError(res, "User already exists", 400);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        sendSuccess(res, { id: user._id, email: user.email }, "User registered successfully", 201);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next)=>{
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return sendError(res, "All fields are required", 400);
        }
        const user = await User.findOne({ email });
        if (!user) {
            return sendError(res, "Invalid credentials", 401);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendError(res, "Invalid credentials", 401);
        }
        const accessToken = jwt.sign({ id: user._id, role:  user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ id: user._id  }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        sendSuccess(res, { accessToken, refreshToken }, "Login successful");

    } catch (error) {
        next(error);
    }
};

module.exports = { register, login }; 