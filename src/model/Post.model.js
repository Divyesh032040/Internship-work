const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true, 
      lowercase: true,
      unique: false,
    },
    content: {
      type: String,
      required: true, 
      unique: true,
    },
    tags: {
      type: [String], 
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
