const express = require("express");
const uploadRoute = express();
const upload = require('../Middleware/Multer')
const {uploadSingle , uploadMultiple } = require("../controller/uploadFiles.controller")


// uploadRoute.route('/upload/single').post(
//     upload.fields([
//         {name:"avatar" , maxCount:1}
//     ]) , uploadSingle
// )
uploadRoute.route('/upload/single').post(
    upload.single('avatar'), 
    uploadSingle              
);

// uploadRoute.route('/upload/multiple').post(
//     upload.array('avatar1' , 5) , uploadMultiple
// )

uploadRoute.route('/upload/multiple').post(
    upload.fields([
        {name:'avatar1' , maxCount:10} ,
        
    ]) , uploadMultiple
)



module.exports = uploadRoute;