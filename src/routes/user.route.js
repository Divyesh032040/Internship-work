const express = require('express');
const userRouter = express.Router();
const validate = require("../Middleware/validate");
const register = require("../controller/User.controller");
const userSchema = require("../validationSchema/userValidation")

// Define the route
userRouter.route("/register").post(validate(userSchema), register);



// Export the router
module.exports = userRouter;
