const app = require('./src/app');
const mongoose = require('mongoose');
const port = process.env.PORT || 8000;
const database = process.env.DATABASE;

mongoose.set('strictQuery', true);




mongoose.connect(database)
.then(()=> {
    app.listen(port, ()=> {
        console.log(`Server Run Successfully at http://localhost:${port}`);
    })
}).catch(error => {
    console.log(error.message)
})


