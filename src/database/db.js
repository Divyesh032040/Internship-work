

const mongoose = require("mongoose")
const DB_NAME = "divyesh032040";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection is FAILED ", error);
        process.exit(1);
    }
}

module.exports = connectDB
