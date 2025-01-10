const express = require('express');
const studentRoute = express.Router();
const validate = require("../Middleware/validate");
const jwtAuth = require('../Middleware/Auth');
const {registerStudent} = require('../controller/Student.controller');
const student = require('../validationSchema/Student.Validate');
const upload = require('../Middleware/Multer')

// Define the route
 studentRoute.route("/student/register").post( upload.fields([
    {name:'GradeHistory' , maxCount:1} ,
    {name:'profileAvatar' , maxCount:1}
    
]) ,validate(student) , registerStudent);


// Export the router
module.exports = studentRoute;
