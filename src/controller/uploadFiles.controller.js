

const fs = require('fs');
const path = require('path');
const createError = require('http-errors');

const uploadSingle = async (req, res , next) => {
  try {

    const file = req.file

    if(!file){
      return next(createError(400 , "Files not received"))
    }
    // Log the uploaded file data
    // console.log(req.file);

    const imgType = req.file.mimetype;
    const imgSize = req.file.size;

    // console.log("Image size:", imgSize, "Image type:", imgType);

    // Validate file type
    if (imgType !== 'image/png' && imgType !== 'image/jpeg') {
      return res.status(400).json({ message: "File must be in PNG or JPEG format" });
    }

    // Validate file size
    if (imgSize > 1000000) {
      return res.status(400).json({ message: "Maximum image size allowed is 1MB" });
    }

    const formate = req.file.originalname.split('.')[1];
    
    // Create a new unique file name
    const {RollNumber} = req.body;
    const fileName = `${RollNumber}.${formate}`;

    // Define old and new file paths
    const oldPath = req.file.path; 
    const newPath = path.join( 'Student', 'Profile', fileName);

    //safety check for directory existence   
    const destDir = path.dirname(newPath);
    await fs.promises.mkdir(destDir, { recursive: true }); 

    // Move the file to the new directory
    
    try {
      await fs.promises.rename(oldPath, newPath);
      console.log('File renamed successfully');
    } catch (err) {
      return next(createError(500 , "fail to rename files"));
    }

    return res.status(200).json({ 
        message: "Image successfully uploaded",
        newFilePath: `Student/Profile/${fileName}` 
    });
    
  } catch (err) {
    console.error('Error during file upload:', err);
    return res.status(500).json({ message: "An error occurred during file upload", error: err.message });
  }
};


const uploadMultiple = async (req, res) => {
  
        const files = req.files.profilePicture;
        const { RollNumber} = req.body;
        //console.log(files)

        if (!files ){
            return res.status(400).json({ error: "At least three files are required" });
        }

//validation of size and file type 
        const mimeTypes = files.map(file => file.mimetype);

        const sizes = files.map(file => file.size);

        const isValid = mimeTypes.every(type => type === 'image/png' || type === 'image/jpeg');

        if (!isValid) {
            res.status(400).json({ message: "only pnj or jpeg formate allowed", files: req.files });
        }
        const isValidSize = sizes.every((size) => size <= 1000000);
        //console.log(isValidSize , "size")
        if(!isValidSize){
            res.status(400).json({ error: "maximum size of file should be 1MB"});
    }

try {
        for(const file of files){
    
            const fileName = `${RollNumber}-${file.filename}`
            const oldPath = file.path;
            const newPath = path.join( 'Student', 'Profile', fileName);
            await fs.promises.rename(oldPath, newPath);
        }

        return res.status(200).json({message:"profiles uploaded successfully"})
} catch (error) {
    throw new Error(error);
}

}


module.exports = {uploadSingle , uploadMultiple};
