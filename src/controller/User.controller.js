
const User = require("../model/User.model")
const bcrypt = require('bcryptjs');
const {encryption , passwordValidate} = require("../Services/userService")

const register = async (req , res) => {
    const userData = req.body;

    if(!userData){
        return res.status(400).json({"message":"user data is required"})
    }

    const {name , mobileNumber , email , age , password} = userData
   

    //check is user already in database ? 

    //code




    // //encryption of password
    const hashedPassword = await encryption(password);

    const user = await User.create({
        name:name,
        mobileNumber:mobileNumber,
        email,
        age,
        password:hashedPassword,
    })

    res.status(200).json({ message: "User registered successfully!", data: userData });
}


module.exports = register


