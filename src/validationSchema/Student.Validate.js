

const joi = require('joi');

// Define schema for user
const student = joi.object({
    name: joi.string()
        .min(3)
        .max(30)
        .required(),
    RollNumber: joi.string()
        .max(12)
        .required(),
    email: joi.string()
        .email()
        .required(),
    age: joi.number()
        .min(16)
        .max(100)
        .required()
});

module.exports = student;
