
const User = require("../model/Student.Model")
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const {encryption , passwordValidate} = require("../Services/userService")
const validate = require("../Middleware/validate")
const path = require('path');
const cookie = require("cookie");
const {
    generateAccessTokens , 
    generateRefreshToken , 
    verifyToken , 
    deleteToken , 
    updateRefreshToken , 
    newAccessToken
} = require('../Services/TokenServices');


//register user endpoint
const register = async (req , res) => {

try {
        const userData = req.body;
    
        if(!userData){
            return res.status(400).json({"message":"user data is required"})
        }
    
        const {name , rollNumber , email , age , password } = userData;
    
    
        const isEmailAvailable = await User.findOne({ email });
        if (isEmailAvailable) {
            return res.status(400).json({message:"User with this Email already registered"})
        }
    
        const hashedPassword = await encryption(password);

        if(!hashedPassword){
            throw new Error("Fail to hash the password");
        }

        //avatar and gradeHistory path
        const avatar = req.files.profile[0].originalname
        const gradeHistory = req.files.gradeHistory[0].originalname;

        const profilePath =  path.join('public' , `${avatar}`);
        const gradeHistoryPath = path.join('public' , `${gradeHistory}`);

        console.log(profilePath , gradeHistoryPath);
    
    //database call
        const user = await User.create({
            name,
            rollNumber,
            email,
            age,
            password:hashedPassword,
            profilePath,
            gradeHistoryPath

        })
    
        res.status(200).json({ message: "User registered successfully!", data: user });
} catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "Internal server error", error: error.message });

}
}

//login user endpoint

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No account found with this email" });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Generate tokens
        const accessToken = generateAccessTokens({ id: user._id });
        const refreshToken = generateRefreshToken({ id: user._id });

        // Save refresh token to the database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // Set tokens in response headers
        res.setHeader("x-access-token", accessToken);
        res.setHeader("x-refresh-token", refreshToken);

        // Send response
        res.status(200).json({
            user: { name: user.name, email: user.email, _id: user._id },
            message: "User logged in successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};



//login student endpoint

const logout = async (req, res) => {

    try {
        const user = req.user;
        const userId = user?._id;

        // Check if user exists in the database
        const dbUser = await User.findById(userId);
        if (!dbUser) {
            return res.status(400).json({ message: "User not found" });
        }

        // Remove refreshToken field from the user's document
        const response = await User.findByIdAndUpdate(
            userId,
            { $unset: { refreshToken: 1 } },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            message: "User logged out successfully",
            UserData: response,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//update user endpoint
// const update = async (req , res ) => {
    
//     const {name , email , age} = req.body;
// //console.log("called" , req.body)
//     const updateSchema = Joi.object({
//         name: Joi.string().min(3).required(),
//         email: Joi.string().email().required(),
//         age: Joi.number().min(0).required()
//     });

//     const { error } = updateSchema.validate(req.body);
//     if (error) {
//         return res.status(400).json({ message: error.details[0].message });
//     }
    

//     if(!name || !email || !age){
//         return res.json({message : "Enter a new Data"});
//     }

//     const userId = req.user?._id;

//     //console.log(userId);

//     const updatedData = await User.findByIdAndUpdate(
//         userId , 
//         {
//             $set:{
//                 name , 
//                 email
//             }
//         },
//         {
//             new:true
//         }
//     ).select("-password -refreshToken");

//     if(!updatedData){
//         throw new Error("Fail to update Student Data");
//     }

//     return res.status(200).json({message:"student data update successfully", StudentData:updatedData})

// }

const update = async (req, res) => {
    try {
        const { name, email, age } = req.body;

        // Validate input using Joi
        const updateSchema = Joi.object({
            name: Joi.string().min(3).required(),
            email: Joi.string().email().required(),
            age: Joi.number().min(0).required(),
        });

        const { error } = updateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        // Update user data in the database
        const updatedData = await User.findByIdAndUpdate(
            userId,
            {
                $set: { name, email, age },
            },
            { new: true }
        ).select("-password -refreshToken");

        if (!updatedData) {
            return res.status(404).json({ message: "Failed to update user data" });
        }

        return res.status(200).json({
            message: "User data updated successfully",
            UserData: updatedData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//delete User endpoint
const deleteStudent = async (req, res) => {
    const userId = req.user?._id;

    try {
        const response = await User.findByIdAndDelete(userId); 

        if (!response) {
            return res.status(404).json({ message: "Failed to delete student. User not found." }); 
        }

        return res.status(200).json({ message: "User deleted successfully" }); 

    } catch (error) {
        console.error(error); 
        return res.status(500).json({ message: "An error occurred while deleting the user." }); 
    }
};

const updatePassword = async(req , res) => {
    const {newPassword , oldPassword} = req.body;
    const userData = req.user;

    if(!newPassword && !oldPassword){
       return res.status(400).json({message:"please enter your new and old password"})
    }

    const response = await User.findById(userData?._id);

    if(!response){
        throw new Error("User not found");
    }

    const hashedPassword = response.password;

    if(!hashedPassword){
        throw new Error("fail to fetch hashed password");
    }

    const validate = passwordValidate(oldPassword , hashedPassword);

    if(!validate){
        throw new Error("Password not Matched | invalid password | unauthorized access");
    }else{

        //hash new password 
        const newHashedPassword = await encryption(newPassword);

        const returnVal = await User.findByIdAndUpdate(
            userData._id , 
            {
                $set:{
                    password:newHashedPassword
                }
            },
            {new:true}
        )

        if(!returnVal){
            throw new Error("fail to update new password ")
        }

        return res.status(200).json({message:"password changed successfully" , user : returnVal})
    }
}


module.exports = {
    register ,
    login ,
    logout  ,
    update ,
    deleteStudent ,
    updatePassword
}










