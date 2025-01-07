const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true, 
      lowercase: true,
      unique:false

    },
    mobileNumber: {
      type: String,
      required: true, 
      unique: false,
      
    },
    email: {
      type: String,
      required: true, // corrected 'require' to 'required'
      unique: true
    },
    age: {
      type: Number,
      required: true
    },
      password:{
        type:String,
        required:true
      },
    
    },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
