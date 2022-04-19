const express = require("express");
const { use } = require("express/lib/application");
const req = require("express/lib/request");
const User = require('../models/user')
const auth = require('../middleware/auth');
const multer = require('multer');
const { route } = require("express/lib/router");
const sharp = require("sharp");
const upload = multer({
    // dest: "images",
    limits: {
        fileSize: 2000000
    },
    fileFilter(req,file,callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error("Please provide image"));
        }
        callback(undefined,true);
    }
});

const router = new express.Router();

 router.post("/users",async(request,response)=>{
    const user = User(request.body);
    try{
        await user.save();
        const token = await user.generateToken();

        response.status(201).send({user,token});
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

router.post("/users/login",async(request,response)=>{
    try{
        const user = await User.findByCredentials(request.body.email,request.body.password);
        const token = await user.generateToken();
        // const publicProfile = 
        // await user.save()
        response.send({user,token});
    }catch(error){
        response.status(400).send({error: " Unable to login!"});
        console.log(error);
    }
    // const user = User(request.body);
    //  user.save().then((result)=>{
    //      response.send(user)
    //  }).catch((err)=>{
    //      response.status(400).send(err)
    //  });
    // console.log(request.body);
});

router.post("/users/logout",auth,async(request,response)=>{
    try{
        // console.log("my token" + request.token  );
      request.user.tokens = request.user.tokens.filter((token) => { 
          console.log(token);
           return token.token !== request.token  });
      await request.user.save();
      response.send('successfully logged out!');
    }catch(error){
        response.status(400).send({error});
    }
});

router.post("/users/logoutAll",auth,async(request,response)=>{
    try{
        // console.log("my token" + request.token  );
      request.user.tokens = [];
      await request.user.save();
      response.send('successfully logged out!');
    }catch(error){
        response.status(500).send({error});
    }
});
router.get("/users/me",auth,async(request,response)=>{
    try{
        response.status(200).send(request.user);
    }catch(e){
        response.status(500).send(e);
    }
    // User.find({}).then((users)=>{
    //     response.send(users);
    // }).catch((err)=>{
    //     response.status(500).send(err);
    // });
})
router.get("/getAllUsers",auth,async(request,response)=>{
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

router.patch("/users/me",auth,async(req,res)=>{
    const inputs = Object.keys(req.body);
    const validInputs = ["email","password","name","age"];
    const isValid = inputs.every((ele) => validInputs.includes(ele))
    // const _id = req.params.id;
    console.log(req.body);
    if(!isValid){
        return res.status(400).send({"error": "requested property does not exists."})
    }
    try{
        // const user = await User.findById(_id);
        // const user = await User.findByIdAndUpdate(_id,req.body,{runValidators: true});
        // if(!req.user){
        //     return res.status(404).send({"error":"user not found"});
        // }
        inputs.forEach((proprty)=>
            req.user[proprty] = req.body[proprty]
        );
        await req.user.save();
        res.send(req.user);
    }catch(e){
        res.status(400).send(e);
    }
});

router.delete("/users/me",auth,async(req,res)=>{
    // const _id = req.params.id;
    try{
        // const user = await User.findByIdAndDelete(_id);
        // if(!user){
        //     return res.status(404).send({"error":"user not found"});
        // }
        await req.user.remove();
        res.send(req.user);
    }catch(e){
        res.status(400).send(e);
    }
});

router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width: 250,height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send()
},(err,req,res,next)=>{
    res.status(400).send({error: err.message});
});

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar = undefined;
    await req.user.save();
    res.send()
},(err,req,res,next)=>{
    res.status(400).send({error: err.message});
});

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        // console.log('here')
        const user = await User.findById(req.params.id);
        // console.log(user.avatar)
        if(!user || !user.avatar){
            console.log('insdie');
            throw new Error();
        }
        res.set("Content-Type","image/jpg")
        res.send(user.avatar);
    }catch(e){
        res.status(404).send();
    }

});


module.exports = router;