
const { use } = require('express/lib/router');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {type: String},
    age: {type: Number},
    password: {type: String,trim: true,required: true,minlength: 7,validate(val){
        // if(val.length <=6){
        //     throw new Error("password shouldn't be less than 6 characters.")
        // }
        if(val.toLowerCase().includes('password')){
            throw new Error('password should not be "password"')
        }
    }},
    email: {type: String,required: true,unique:true,validate(value){
        if(!validator.isEmail(value)){
            throw new Error('Invalid email!')
        }
    }},
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.generateToken = async function (){
    console.log('inside genrate token');
    const user = this;
    const token = jwt.sign({_id : user._id.toString()},"thisistoken");
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

userSchema.methods.toJSON = function (){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}
// userSchema.methods.generateToken = async function (){
//     console.log('inside genrate token');
//     const user = this;
//     const token = jwt.sign({_id : user._id.toString()},"thisistoken");
//     return token;
// }

userSchema.statics.findByCredentials = async(email,password)=>{
    console.log('here inside function');
    const user = await User.findOne({email});
    console.log(user);
    if(!user){
        throw new Error('User not found!');
    }
    const isMatched = await bcrypt.compare(password,user.password);
    console.log(isMatched);
    if(!isMatched){
        throw new Error('Unable to login!');
    }
    return user;
}
// userSchema.statics.findByCredentials = async(email,password)=>{
//     console.log('here inside function');
//     const user = await User.findOne({email});
//     console.log(user);
//     if(!user){
//         throw new Error('Unable to login!');
//     }
//     const isMatched = await bcrypt.compare(password,user.password);
//     if(!isMatched){
//         throw new Error('Unable to login!');
//     }
//     return user;
// }

userSchema.pre("save",async function(next){
const user = this;
console.log('here inside' + user);
if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password,8);
}
next();

})

const User = mongoose.model("User",userSchema);

module.exports = User;