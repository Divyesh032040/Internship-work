const express = require("express");
const uploadRoute = express();
const upload = require('../Middleware/Multer')
const {uploadSingle , uploadMultiple } = require("../controller/uploadFiles.controller")



uploadRoute.route('/upload/single').post(
    upload.single('avatar'), 
    uploadSingle              
);


uploadRoute.route('/upload/multiple').post(
    upload.fields([
        {name:'profilePicture' , maxCount:3} ,
        
    ]) , uploadMultiple
)



module.exports = uploadRoute;