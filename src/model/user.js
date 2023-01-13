const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const {Schema} = mongoose;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Please Enter Your First Name']
        },
        lastName: {
            type: String,
            required: [true, 'Please Enter Your Last Name']
        },
        email: {
            type: String,
            required: [true, 'Please Enter Your Email'],
            unique: true,
            trim: true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please enter a valid email",
              ]
        },
        password: {
            type: String,
            required: [true, 'Please Enter Your Password at least 6 characters'],
            minLength: [6, 'Password must be up to 6 characters']
        },
        mobile: {
            type: String,
            require: [true,'Please Enter Your Mobile Number'],
            unique: true,
            match: [
                /^(?:\+88|88)?(01[3-9]\d{8})$/
            ]
        },
        city: {
            type: String,
            require: [true, 'Please Enter Your Current City'],
            default: 'Dhaka'
        }
    },
    {timestamps: true, versionKey: false}
)


userSchema.pre('save', async function save(next){
    try{
        if (!this.isModified('password')) return next();
    
        // Hash password    
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(this.password, salt);
        this.password = hashedPassword;
        next();

    }catch(error){
        return next(error)
    }
})


const User = mongoose.model('User',userSchema);
module.exports = User;