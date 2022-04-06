
const mongoose = require('mongoose')
const validator = require('validator')

async function main(){
    try{
    await mongoose.connect('mongodb+srv://shrinath:Shruta1998@cluster0.bcfzi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
// const User = mongoose.model("User",{
//     name: {type: String},
//     age: {type: Number},
//     password: {type: String,trim: true,required: true,minlength: 7,validate(val){
//         // if(val.length <=6){
//         //     throw new Error("password shouldn't be less than 6 characters.")
//         // }
//         if(val.toLowerCase().contains('password')){
//             throw new Error('password should not be "password"')
//         }
//     }},
//     email: {type: String,required: true,validate(value){
//         if(!validator.isEmail(value)){
//             throw new Error('Invalid email!')
//         }
//     }}
// });
// const Task = mongoose.model("Task",{
//     description: {type: String,trim: true,required: true},
//     isCompleted: {type: Boolean,default: false}
// });
// const me = new User({
//     name: "Jimmy",
//     age: 28,
//     email: "jacks@gmail.com",
//     password: 'password'
// });
// const task = new Task({
//     description: "    some description.       ",
//     // isCompleted: false,
// });
// // const res = await me.save();
// const res = await task.save();
// console.log(res);
    }catch(err){
        console.log(err)
    }finally{
        // mongoose.close()
    }
}
main().catch(console.error)

 