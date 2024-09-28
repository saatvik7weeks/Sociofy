const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://rishabpanda779:skpsmp123@cluster0.lwtcv.mongodb.net/")

const postSchema=mongoose.Schema({
 user: { 
     type: mongoose.Schema.Types.ObjectId,
     ref:"user"
 },

date: {
    type: Date,
    default: Date.now
 },

 content : String,

 likes:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
]

})

module.exports =mongoose.model('post',postSchema)