const express = require('express');
const { use } = require('express/lib/application');
const User = require('./models/user')
const Task = require('./models/task');
const res = require('express/lib/response');
require('./mongoos')
const app = express();

const port =  process.env.PORT || 3000;
app.use(express.json());

 app.post("/users",async(request,response)=>{
    const user = User(request.body);
    try{
        await user.save()
        response.status(201).send(user);
    }catch(e){
        response.status(400).send(e);
    }
    // const user = User(request.body);
    //  user.save().then((result)=>{
    //      response.send(user)
    //  }).catch((err)=>{
    //      response.status(400).send(err)
    //  });
    // console.log(request.body);
});

app.post("/tasks",async(request,response)=>{
    const myTask = Task(request.body);
    try{
        await myTask.save();
        response.status(201).send(myTask);
    }catch(e){
        response.status(400).send(e);
    }
    // try{
    //     myTask.save().then((result)=>{
    //      response.send(myTask)
    //  }).catch((err)=>{
    //      response.status(400).send(err)
    //  });

    console.log(request.body);
    // response.send('tensting!!');
});
app.get("/getAllUsers",async(request,response)=>{
    try{
        const users = await User.find({});
        response.status(200).send(users);
    }catch(e){
        response.status(400).send(e);
    }
    // User.find({}).then((users)=>{
    //     response.send(users);
    // }).catch((err)=>{
    //     response.status(500).send(err);
    // });
})

app.get("/getUserById/:id",async(request,response)=>{
    const _id = request.params.id;
    console.log(request.params);
    try{
        const user = await User.findById(_id);
        if(!user){
            return response.status(400).send();
        }
        response.status(200).send(user);
    }catch(e){
        response.status(400).send(e);
    }
    // User.findById(_id).then((user)=>{
        // if(!user){
        //     return response.status(400).send();
        // }
    //     response.send(user);
    // }).catch((err)=>{
    //     response.status(500).send(err);
    // });
});

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