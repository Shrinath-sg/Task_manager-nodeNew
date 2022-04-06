
const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model("User",{
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
    email: {type: String,required: true,validate(value){
        if(!validator.isEmail(value)){
            throw new Error('Invalid email!')
        }
    }}
});

module.exports = User;