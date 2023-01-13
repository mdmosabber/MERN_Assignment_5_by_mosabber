const errorMiddleware = (err, req, res, next)=> {
    const statuscode = res.statusCode ? res.statusCode : 500;

    res.status(statuscode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    })
}

module.exports = errorMiddleware;

