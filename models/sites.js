const mongoose = require("mongoose");
require('mongoose-type-url');

const siteSchema = new mongoose.Schema({
   mobile:{
        type:Number
    },
    URL:{
        type:mongoose.SchemaTypes.Url,
        required:true
    },
    siteName:{
        type:String,
        required:true
    },
    sector:{
        type:String
    },
    userName:{
        type:String,
        required:true
    },
    sitePassword:{
        type:String,
        required:true
    },
    notes:{
        type:String
    }
})


module.exports = mongoose.model("SiteSchema",siteSchema)