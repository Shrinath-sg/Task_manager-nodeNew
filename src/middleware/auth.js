const { use } = require("express/lib/router");
const jwt = require("jsonwebtoken");
const User = require('../models/user')
const auth = async(req,res,next)=>{
    try{
        // console.log(req);
        const token = req.header('Authorization').replace("Bearer","").trim();
        console.log(token);
        const decoded = jwt.verify(token,"thisistoken");
        const user = await User.findById(decoded._id);
        if(user.tokens.length == 0){
            throw new Error();
        }
        console.log(user);
        if(!user){
            throw new Error();
        }
        req.user = user;
        req.token = token;
        // console.log(token);
    }catch(e){
        res.status(401).send("please authenticate");
    }
    next();
}

module.exports = auth;