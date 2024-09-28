const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://rishabpanda779:skpsmp123@cluster0.lwtcv.mongodb.net/")

const userSchema=mongoose.Schema({
    username: String,
    name: String,
    age:Number,
    email: String,
    password: String,
    profilepic:{
         type: String, 
         default: 'default.jpeg'  //default profile picture
     },
     posts:[
         {
             type: mongoose.Schema.Types.ObjectId,
             ref: 'post'
            }
        ]
    })


module.exports =mongoose.model('user',userSchema)