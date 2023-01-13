const Todo = require('../model/todo');
const errorMiddleware = require('../middleware/errorMiddleware');

exports.createTodo = async(req, res)=>{
    try{

        const{subject, description} = req.body;

        if(!subject || !description ){
            res.status(400);
            throw new Error('Please fill up subject and description');
        }

        const todo  = await new Todo({
            name           : req.auth.name,
            subject        : subject,
            description    : description,
        }).save();

        if(todo){
            res.status(201).json(todo)
        }else{
            res.status(400);
            throw new Error("Todo List Not Create");    
        }
    }
    catch(error){    
        errorMiddleware(error, req, res)
    }
}




//Get todo
exports.getTodo = async(req, res)=> {
    try{
        const todo = await Todo.find({ name: req.auth.name});
        if(!todo){
            res.status(400);
            throw new Error('User not found please signup or login');
        }

        if(todo){
            res.status(200).json(todo)
        }
    }
    catch(error){    
        errorMiddleware(error, req, res)
    }
}


//Todo Update
exports.updateTodo = async(req, res)=>{
    try{
       const {_id, subject, description, status} = req.body;

       const todo = await Todo.findById(_id);
        
       if(todo){            
            todo.subject = subject || todo.subject;
            todo.description = description || todo.description;
            todo.status = status || todo.status;
            todo.updatedAt = Date.now() || todo.updatedAt;

           const todoUpdate = await todo.save();
           res.status(200).json(todoUpdate);
       }else{
         res.status(400);
         throw new Error('Todo Not Found');
       }

    }
    catch(error){    
        errorMiddleware(error, req, res)
    }
}


//Update Status
exports.updateStatus = async(req, res)=> {
    try{
        const todo = await Todo.findById(req.body.id);
        if(todo){
           
            todo.status = req.body.status || todo.status;
            todo.updatedAt = Date.now() || todo.updatedAt;

           const {status,updatedAt} = await todo.save();
           res.status(200).json({status,updatedAt});
        }else{
            res.status(400);
            throw new Error('Todo Not Found');
        }
    }
    catch(error){    
        errorMiddleware(error, req, res)
    }
}


//Todo Remove
exports.removeTodo = async(req, res)=> {
    
    try{       
       const todo = await Todo.findById(req.body.id);   

        if(!todo){
            res.status(400);
            throw new Error('Todo Not Found'); 
        }
        await todo.remove();
        res.status(200).json({ message: "Todo Delete Successfully" });

    }
    catch(error){    
        errorMiddleware(error, req, res)
    }
}


//Select Todo By Status
exports.selectToByStatus = async(req, res)=>{
    try{
        const todo = await Todo.find({ name: req.auth.name, status: req.body.status});

        if(!todo){
            res.status(400);
            throw new Error('User or status not found');
        }

        if(todo){
            res.status(200).json(todo)
        }
    }
    catch(error){    
        errorMiddleware(error, req, res)
    }
}



//Select Todo By Date
exports.selectToByDate = async(req, res)=> {
    try{
        const todo = await Todo.find({ name: req.auth.name, createdAt:{$gte: new Date(req.body.from), $lte: new Date(req.body.to) }   });

        if(!todo){
            res.status(400);
            throw new Error('User or date not found');
        }

        if(todo){
            res.status(200).json(todo)
        }
    }
    catch(error){    
        errorMiddleware(error, req, res)
    }
}