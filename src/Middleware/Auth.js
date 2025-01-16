
const User = require('../model/Student.Model');
const { verifyToken } = require("../Services/TokenServices");

const jwtAuth = async (req, res, next) => {
    try {
        // Get token from headers
        const userToken = req.header("Authorization")?.replace("Bearer ", "");

        if (!userToken) {
            return res.status(401).json({ message: "Access token not found" });
        }

        // Verify the token and decode its payload
        const decodedToken = verifyToken(userToken);

        if (!decodedToken) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const userId = decodedToken?.id || decodedToken?._id;

        // Fetch the user from the database using the token payload
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Invalid access token" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        res.status(401).json({ message: error.message });
    }
};

module.exports = jwtAuth;