const {readdirSync} = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const MongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const errorMiddleware = require('./middleware/errorMiddleware');


require('dotenv').config();
const app = express();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, 
	standardHeaders: true, 
	legacyHeaders: false, 
})


//Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(MongoSanitize());
app.use(limiter);


//Router 
readdirSync(path.join(__dirname,'routers')).map((routeFile)=> {
    app.use('/api/v1', require(`./routers/${routeFile}`))
})



//404 error handle
app.use((req,res, next)=> {
    res.status(404).json({message: '4💕4 Not Found'})
})

app.use(errorMiddleware);


module.exports = app;