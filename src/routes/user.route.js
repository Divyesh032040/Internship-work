const express = require('express');
const userRouter = express.Router();
const validate = require("../Middleware/validate");
const {register , logout ,login} = require("../controller/Student.controller");
const userSchema = require("../validationSchema/Student.Validate");
const jwtAuth = require('../Middleware/Auth');
const upload = require('../Middleware/Multer');

// Define the route
userRouter.route("/register").post( upload.fields([
    {name:'GradeHistory' , maxCount:1} ,
    {name:'profileAvatar' , maxCount:1}
    
]) , validate(userSchema), register);

userRouter.route("/login").get(login)

userRouter.route('/logout').get(jwtAuth , logout);

// Export the router
module.exports = userRouter;
