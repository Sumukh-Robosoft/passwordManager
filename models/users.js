const mongoose = require('mongoose');
const validator = require('validator');

const userSchema =new mongoose.Schema({
    phoneNumber : {
        type :Number,
        validate: {
            validator: function(v) {
                return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(v)
            },
            message: 'Please enter 10 digit Phone Number'
        },
        required:true,
        unique:true
    },
    mpin:{
        type:Number,
        maxlength:4,
        minlength:4
    },
    mpinHash : {
        type : String,
        
    }
});

module.exports = mongoose.model("UserSchema",userSchema)