const mongoose = require('mongoose');

const issueReport = new mongoose.Schema({
    ppt:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    createdOn:{
        type:Date,
        default:Date.now()
    },
    name:{
        type:String
    }

})

const Issues = mongoose.model('Issue', issueReport);
module.exports = Issues;