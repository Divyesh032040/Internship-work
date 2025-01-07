const joi = require('joi');

// Define schema for user
const post = joi.object({
    // userId: joi.string()
    //     .max(24)
    //     .required(),
    title: joi.string()
        .min(5)
        .max(100)
        .required(),
    content: joi.string()
        .max(10000)
        .required(),
    tags: joi.string()
        .max(100)
        .required(),  
});

module.exports = post;
