
const express = require('express');
const studentRoute = express.Router();
const validate = require("../Middleware/validate");
const jwtAuth = require('../Middleware/Auth');
const { register , login , logout , update , deleteStudent , updatePassword} = require('../controller/Student.controller');
const student = require('../validationSchema/Student.Validate');
const upload = require('../Middleware/Multer');

// Define the route
studentRoute.route("/student/register").post(
    upload.fields([
        { name: 'gradeHistory', maxCount: 1 },
        { name: 'profile', maxCount: 1 }
    ]),
    validate(student),
    register
);


studentRoute.route("/login").get(jwtAuth , login)

studentRoute.route("/student/logout").get(jwtAuth , logout);

studentRoute.route("/student/update").patch(jwtAuth , update);

studentRoute.route("/student/delete").delete(jwtAuth , deleteStudent);

studentRoute.route("/student/update/Password").patch(jwtAuth , updatePassword); 
// Export the router
module.exports = studentRoute;
