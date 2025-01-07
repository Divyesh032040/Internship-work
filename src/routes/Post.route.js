const express = require('express');
const router = express.Router();
const validate = require("../Middleware/validate");
const uploadPost = require("../controller/Post.controller");
const postSchema = require("../validationSchema/Post.validation")
// Define the route
router.route("/post").post(validate(postSchema) , uploadPost);



// Export the router
module.exports = router;
