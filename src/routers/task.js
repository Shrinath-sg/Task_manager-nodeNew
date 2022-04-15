const express = require("express");
const Task = require('../models/task')
const auth = require('../middleware/auth');
const { request } = require("express");
const router = new express.Router();

router.post("/tasks",auth,async(request,response)=>{
    // const myTask = Task(request.body);
    const myTask = Task({
        ...request.body,
        "owner": request.user._id
    })
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

router.get("/getAllTasks",auth,async(request,response)=>{
    try{
        const tasks = await Task.find({"owner": request.user._id});
        if(!tasks){
            return  response.status(404).send();
        }
        // const data =await request.user.populate('tasks');
        response.status(200).send(tasks);
        // response.status(200).send(data);
    }catch(e){
        response.status(400).send(e);
    }
    // User.find({}).then((users)=>{
    //     response.send(users);
    // }).catch((err)=>{
    //     response.status(500).send(err);
    // });
})
router.get("/tasks/:id",auth,async(request,response)=>{
    try{
        const _id = request.params.id;
        const task = await Task.findOne({_id,"owner": request.user._id});
        if(!task){
            return response.status(404).send();
        }
        response.send(task)
    }catch(e){
        response.status(500).send(e);
    }
    // User.find({}).then((users)=>{
    //     response.send(users);
    // }).catch((err)=>{
    //     response.status(500).send(err);
    // });
})


router.patch("/tasks/:id",auth,async(req,res)=>{
    const inputs = Object.keys(req.body);
    const validInputs = ["description","isCompleted"];
    const isValid = inputs.every((ele) => validInputs.includes(ele))
    const _id = req.params.id;
    console.log(req.body);
    if(!isValid){
        return res.status(400).send({"error": "requested property does not exists."})
    }
    try{
        const task = await Task.findOne({_id,"owner":req.user._id});
        // const task = await Task.findById(_id);
        // const task = await Task.findByIdAndUpdate(_id,req.body,{runValidators: true});
        if(!task){
            return res.status(404).send({"error":"task not found"});
        }
        inputs.forEach((proprty)=>
        task[proprty] = req.body[proprty]
    );
    await task.save();
        res.send(task);
    }catch(e){
        res.status(400).send(e);
    }
});



router.delete("/tasks/:id",auth,async(req,res)=>{
    const _id = req.params.id;
    try{
        const task = await Task.deleteOne({_id,"owner":req.user._id});
        // const task = await Task.findByIdAndDelete(_id);
        if(!task){
            return res.status(404).send({"error":"task not found"});
        }
        res.send(task);
    }catch(e){
        res.status(400).send(e);
    }
});

module.exports = router;