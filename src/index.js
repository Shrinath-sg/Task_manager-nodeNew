const express = require('express');
const { use } = require('express/lib/application');
const User = require('./models/user')
const Task = require('./models/task');
const res = require('express/lib/response');
require('./mongoos')
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const jwt = require('jsonwebtoken')
const app = express();

const port =  process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);



// Task.countDocuments({isCompleted:false}).then((res)=>{
//     console.log(res);
// })
// const deleteTaskAndGetCount = async(id)=>{
//     await Task.findByIdAndDelete(id);
//     const count =await Task.countDocuments({isCompleted:false});
//     return count;
// }
// deleteTaskAndGetCount("623c3f8bc82c3df7d2e33595").then((res)=>{
//     console.log(res);
// }).catch((err)=>{console.log(err)});


app.listen(port,()=>{
    console.log(`listening on port ${port}`)
});