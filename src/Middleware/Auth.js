const User = require('../model/User.model');
const {verifyToken} = require("../Services/TokenServices");

const jwtAuth = async ( req , res , next ) => {

    try {
        const userToken = req.cookies?.accessToken || req.header("Authentication")?.replace("Bearer ","");
    
        if(!userToken){
            throw new Error("access token not found");
        }
    
        const decodedToken = verifyToken(userToken);
    
        if(!decodedToken){
            throw new Error("Unauthorized access")
        }

        //fetch user via accessToken 
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if(!user){
            throw new Error("invalid access token found");
        }
    
        req.user = user;
    
        next();
        
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = jwtAuth;