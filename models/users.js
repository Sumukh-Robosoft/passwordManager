const mongoose = require('mongoose');

require("dotenv").config()

const userSchema =new mongoose.Schema({
    phoneNumber : {
        type :Number,
        validate: {
            validator: function(v) {
                return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-.  ]?([0-9]{4})$/.test(v)
            },
            message: 'Please enter 10 digit Phone Number'
        },
        required:true,
        unique:true
    },
    mpin:{
        type:String,
        maxlength:4,
        minlength:4
    },
    mpinHash : {
        type : String,
        
    },
    token :{
        type:String,
        default:""
    },
    createdAt :{
        type:Date,
        default:Date.now()
    }
});


module.exports = mongoose.model("UserSchema",userSchema)