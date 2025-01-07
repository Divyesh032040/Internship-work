

const uploadSingle = (req, res) => {
    try {
        // Log the uploaded file data
        console.log(req.file); 
        const imgType = req.file.mimetype;
        const imgSize = req.file.size;

        console.log("img size",imgSize , "imgType" , imgType)

        if (imgType !== 'image/png' && imgType !== 'image/jpeg') {
            res.status(400).json({ message: "File must be in PNG or JPEG format" });
        } else if (imgSize > 1000000) {
            return res.status(400).json({ message: "Maximum image size allowed is 1MB" });
        } else {
            return res.status(200).json({ message: "Image successfully uploaded" });
        }
        
        
    } catch (error) {
        res.status(500).json({ error: "File upload failed" });
    }
};

const uploadMultiple = (req, res) => {
    try {
        console.log("req.files", req.files);

        const files = req.files.avatar1;

        if (!files ){
            return res.status(400).json({ error: "At least three files are required" });
        }

        
        const mimeTypes = files.map(file => file.mimetype);

        const sizes = files.map(file => file.size);
        console.log("File Sizes :",sizes)

        console.log("File types:", mimeTypes);

        
        const isValid = mimeTypes.every(type => type === 'image/png' || type === 'image/jpeg');

        if (!isValid) {
            res.status(400).json({ message: "only pnj or jpeg formate allowed", files: req.files });
        }

    
        const isValidSize = sizes.every((size) => size <= 1000000);


        console.log(isValidSize , "size")

        if(isValidSize !== false){
            res.status(200).json({message:"all Images uploaded successfully" , files:req.files})
        }else {
            res.status(400).json({ error: "maximum size of file should be 1MB"});
        }

    } catch (error) {
        res.status(500).json({ error: "File upload failed", details: error.message });
    }
}


module.exports = {uploadSingle , uploadMultiple};
