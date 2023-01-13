const mongoose = require('mongoose');
const {Schema} = mongoose;

const todoSchema =  new Schema(
    {
        name:{
            type: String,
            require: [true, 'Please Enter The Name' ]
        },
        subject:{
            type: String,
            require: [true, 'Please Enter Subject' ]
        },
        description:{
            type: String,
        },
        status: {
            type: String,
            default: 'New'
        },
    },
    {timestamps: true, versionKey: false}
   
)


const Todo = mongoose.model('Todo',todoSchema);
module.exports = Todo;