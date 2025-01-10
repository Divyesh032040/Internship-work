
const path = require('path');
const fs = require('fs');

const registerStudent = async (req, res) => {
    try {
        const { name, RollNumber, email, age } = req.body;

        // Validate required fields
        if (!name || !RollNumber || !email || !age) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const apple = path.extname(__filename); console.log(apple);

        // define base path for student data : current directory -> studentData/RollNumber
        const studentBasePath = path.join(__dirname, 'StudentData', RollNumber);

        // Create a folder named by the student's RollNumber
        if (!fs.existsSync(studentBasePath)) {
            fs.mkdirSync(studentBasePath, { recursive: true });
        }

        // Save student information into a file (e.g., `info.json`)
        const studentInfo = { name, RollNumber, email, age };

        const infoFilePath = path.join(studentBasePath, 'info.json');

        fs.writeFileSync(infoFilePath, JSON.stringify(studentInfo, null, 2), 'utf-8');



        // Copy files from the public folder to the RollNumber directory
        const publicFolderPath = path.join('public');

        if (fs.existsSync(publicFolderPath)) {

            //files array of all files of public folder
            const files = fs.readdirSync(publicFolderPath);


            for (const file of files) {
                const srcPath = path.join(publicFolderPath, file);
                const destPath = path.join(studentBasePath, file);

                    await fs.promises.rename(srcPath, destPath); // Move file

            }

        } else {
            console.warn('Public folder does not exist.');
        }

        res.json({ message: "Student registered successfully!" });
    } catch (error) {
        console.error('Error registering student:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};






module.exports = { registerStudent };
