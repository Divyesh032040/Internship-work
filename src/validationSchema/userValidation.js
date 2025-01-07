const joi = require('joi');

// Define schema for user
const user = joi.object({
    name: joi.string()
        .min(3)
        .max(30)
        .required(),
    mobileNumber: joi.string()
        .pattern(/^\d{10}$/) 
        .required(),
    email: joi.string()
        .email()
        .required(),
    age: joi.number()
        .min(16)
        .max(100)
        .required(),  
    password: joi.string() 
        .min(3)
        .max(30)
        .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+={}|\\[\\]<>?,./-]{3,30}$'))  // Allow alphanumeric + special characters
        .required()
     
});

module.exports = user;
