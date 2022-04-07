const express = require("express");
const User = require('../models/user')
const router = new express.Router();

 router.post("/users",async(request,response)=>{
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

router.get("/getAllUsers",async(request,response)=>{
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

router.get("/getUserById/:id",async(request,response)=>{
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

router.patch("/users/:id",async(req,res)=>{
    const inputs = Object.keys(req.body);
    const validInputs = ["email","password","name","age"];
    const isValid = inputs.every((ele) => validInputs.includes(ele))
    const _id = req.params.id;
    console.log(req.body);
    if(!isValid){
        return res.status(400).send({"error": "requested property does not exists."})
    }
    try{
        const user = await User.findByIdAndUpdate(_id,req.body,{runValidators: true});
        if(!user){
            return res.status(404).send({"error":"user not found"});
        }
        res.send(user);
    }catch(e){
        res.status(400).send(e);
    }
});

router.delete("/users/:id",async(req,res)=>{
    const _id = req.params.id;
    try{
        const user = await User.findByIdAndDelete(_id);
        if(!user){
            return res.status(404).send({"error":"user not found"});
        }
        res.send(user);
    }catch(e){
        res.status(400).send(e);
    }
});

module.exports = router;