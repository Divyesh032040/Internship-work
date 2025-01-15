// Import the Express module
const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const connectDB = require("./src/database/db")
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const ErrorHandler = require('./src/Middleware/ErrorHandler');

const app = express();

dotenv.config();

//Middlewares
app.use(morgan('combined'));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));       
app.use(cookieParser());
app.use(helmet());
app.use(express.static('public'))
app.use(express.static('Student'))
app.use(express.json());

//connecting with database
connectDB()

// Import routes
const userRouter = require('./src/routes/user.route');
const router = require('./src/routes/Post.route');
const uploadRoute = require('./src/routes/upload.route');
const studentRoute = require('./src/routes/Student.route');

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Mount the user routes
app.use('/api/v1', userRouter);
app.use('/api/v1' , uploadRoute);
app.use('/api/v1' , studentRoute);


//Global Error Handling Middleware
app.use(ErrorHandler); 

// Set the port for the server
const PORT = process.env.PORT || 3000;

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
