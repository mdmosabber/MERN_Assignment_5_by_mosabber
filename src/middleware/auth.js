const errorMiddleware = require('../middleware/errorMiddleware');
const jwt = require('jsonwebtoken');
const User = require('../model/user');


const authVerify = async(req, res, next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            res.status(401);
            throw new Error("Not authorized, please login");
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        req.auth = verified;
        next();

    }catch(error){        
        errorMiddleware(error, req, res)
    }
}

module.exports = authVerify;


