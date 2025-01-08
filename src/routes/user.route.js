const express = require('express');
const userRouter = express.Router();
const validate = require("../Middleware/validate");
const {register , logout ,login} = require("../controller/User.controller");
const userSchema = require("../validationSchema/userValidation");
const jwtAuth = require('../Middleware/Auth');


// Define the route
userRouter.route("/register").post(validate(userSchema), register);

userRouter.route("/login").get(login)

userRouter.route('/logout').get(jwtAuth , logout);

// Export the router
module.exports = userRouter;
