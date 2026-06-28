import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    try {
        let token;

        // Check for Bearer token
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // No token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. No token provided.",
                statusCode: 401
            });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
                statusCode: 401
            });
        }

        next();
    } catch (error) {
        console.log("Auth middleware error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired. Please login again.",
                statusCode: 401
            });
        }

        return res.status(401).json({
            success: false,
            message: "Not authorized. Invalid token.",
            statusCode: 401
        });
    }
};

export default protect;