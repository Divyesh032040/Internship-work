

const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp'); 
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); 
    }
});

const upload = multer({storage});

module.exports = upload;



// // req.file will be like this : 

// //   {
// //     fieldname: 'avatar',
// //     originalname: 'profile.jpg',
// //     encoding: '7bit',
// //     mimetype: 'image/jpeg',
// //     destination: '/tmp/my-uploads',
// //     filename: 'avatar-1673024571827-568745123',
// //     path: '/tmp/my-uploads/avatar-1673024571827-568745123',
// //     size: 34567
// //   }
  
  