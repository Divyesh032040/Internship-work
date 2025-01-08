
const User = require("../model/User.model")
const bcrypt = require('bcryptjs');
const {encryption , passwordValidate} = require("../Services/userService")
const cookie = require("cookie");
const {
    generateAccessTokens , 
    generateRefreshToken , 
    verifyToken , 
    deleteToken , 
    updateRefreshToken , 
    newAccessToken
} = require('../Services/TokenServices');


const register = async (req , res) => {

    const userData = req.body;

    if(!userData){
        return res.status(400).json({"message":"user data is required"})
    }

    const {name , mobileNumber , email , age , password} = userData

    const isEmailAvailable = await User.findOne({ email });
    if (isEmailAvailable) {
        return res.status(400).json({message:"User with this Email already registered"})
    }

    const hashedPassword = await encryption(password);


    const user = await User.create({
        name:name,
        mobileNumber:mobileNumber,
        email,
        age,
        password:hashedPassword,
    })

    res.status(200).json({ message: "User registered successfully!", data: user });
}


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
        await user.save({ validateBeforeSave : false })
    
        // Set cookies
        res
            .cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24, 
            httpOnly: true,
            secure: true, 
            })
            .cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24, 
            httpOnly: true,
            secure: true,
            })
            .status(200)
            .json({
            user: { name: user.name, email: user.email, _id: user._id },
            message: "User logged in successfully",
            });
        } catch (error) {
        console.log(error);
        }
    };

    const logout = async (req , res) => {
        const user = req.user;
        const userId = user?._id;
        const dbUser = await User.findById(userId);
        if(!dbUser){
            return res.status(400).json({message:"user not found"});
        }

        //remove refreshToken field from document
        await User.findByIdAndUpdate(
            userId, 
            {
                $unset: { refreshToken: 1 }
            },
            {
                new: true
            }
        );

        //remove cookies 
        const option = {
            httpOnly: true,
            secure: true
        };
        
        return res
            .status(200)
            .clearCookie("accessToken", option)
            .clearCookie("refreshToken", option)
            .json({message:"user logout successfully"})
    }



module.exports = {register , login , logout }










