const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const errorMiddleware = require('../middleware/errorMiddleware');



exports.index = (req, res)=> {
    res.send('<h2>Welcome To My Todo Application</h2>');
}

//Generate Token
const generateToken = (id, name)=> {
    return jwt.sign({id,name},process.env.JWT_SECRET, {expiresIn: '7d'});
}

//Set Cookie
const setCookie = (res,token)=> {
    res.cookie('token', token, {
        path: '/',
        // secure: true,
        expires: new Date(Date.now() + 7 * 1000 * 86400), // 7 day
        httpOnly: true,
        sameSite: "none",
    })
}


// Register
exports.register = async(req, res)=> {
    try{      
            
        const {firstName, lastName, email, password, mobile} = req.body;

        if(!firstName || !lastName || !email || !password || !mobile){
            res.status(400);
            throw new Error('Please fill up all require fields');
        }

        if(password.length < 6){
            res.status(400);
            throw new Error('Password must be up to 6 characters')
        }

        const emailExists = await User.findOne({email:email});
        if(emailExists){
            res.status(400);
            throw new Error('This email already used')
        }

        const mobileExists = await User.findOne({mobile:mobile});
        if(mobileExists){
            res.status(400);
            throw new Error('This mobile already used')
        }

        //new user create
        const user = await new User({
            firstName, lastName, email, password, mobile
        }).save();

        // token function calling;
        const token = generateToken(user._id, user.firstName);
        // set cookie
        setCookie(res, token);

        if(user){
            res.status(201).json(user)
        }else{
            res.status(400);
            throw new Error("Invalid user data");    
        }

    }
    catch(error){    
        errorMiddleware(error, req, res)
    }

}


//User Login
exports.userLogin = async(req,res)=> {
    try{
        const {email, password} = req.body;

        if(!email, !password){
            res.status(400);
            throw new Error('Please add email and password');
        }

        //user exists
        const user = await User.findOne({email});

        if(!user){
            res.status(400);
            throw new Error('User not found please register')
        }

        //Password check 
        const passwordIsCorrect = await bcrypt.compare(password, user.password);

        // token function calling;
        const token = generateToken(user._id, user.firstName);
        // set cookie
        setCookie(res, token);

        if(user && passwordIsCorrect){
            res.status(200).json({user, token});
        }else{
            res.status(400);
            throw new Error('Invalid email or password');
        }
  

    }catch(error){    
        errorMiddleware(error, req, res)
    }
}


//Logout
exports.logOut = (req,res)=> {
    try{
        // remove cookie
        setCookie(res, "");
        res.status(200).json({message: 'Logged Out Successfully'})
    }catch(error){    
        errorMiddleware(error, req, res)
    }
}


// View Profile
exports.viewProfile = async(req, res)=> {
    try{
        const user = await User.findById(req.auth.id).select('-password');
        if (user) {           
            res.status(200).json(user);
        } 
        else {
            res.status(400);
            throw new Error("User Not Found");
        }
        
    }catch(error){    
        errorMiddleware(error, req, res)
    }
}


//update profile
exports.updateProfile = async(req, res)=> {
    try{
        const user = await User.findById(req.auth.id);

        if(user){
            const {firstName, lastName, password, mobile, city} = user;
       
            user.firstName = req.body.firstName || firstName;
            user.lastName = req.body.lastName || lastName;
            user.password = req.body.password || password;
            user.mobile = req.body.mobile || mobile;
            user.city = req.body.city || city;
               
            const userUpdate = await user.save();
            res.status(200).json(userUpdate);
        }else{
            res.status(400);
            throw new Error('User Not Found');
        }

    }catch(error){    
        errorMiddleware(error, req, res)
    }
}