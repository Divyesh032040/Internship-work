function ErrorHandler(error , req , res , next ){
    const statusCode = error.statusCode || 500 ;
    const message = error.message || "INternal server Error" ;

    //log the error detail for debug 
    console.log(`Error : ${message} , statusCode ${statusCode}`);

    res.status(statusCode)
    .json({
        success : false , 
        message ,
        stack : process.env.NODE_ENV == 'production'? null : error.stack
    });

}

module.exports = ErrorHandler;