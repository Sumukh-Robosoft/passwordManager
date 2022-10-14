const bcrypt = require("bcrypt");
const UserModel = require("../models/users")
const JWT = require("jsonwebtoken")
const fast2sms = require('fast-two-sms');

const signin = async (req,res) =>{
    const phoneNumber= req.body.phoneNumber;
    let [user] = await UserModel.find({phoneNumber:phoneNumber}).clone();
    if(!user){
        return res.status(400).send("Invalid credentials")
    }
    
   const isMatch = await bcrypt.compare(req.body.mpin.toString(),user.mpinHash)
   if(!isMatch){
    return res.status(400).send("Invalid credentials")
}
const payload = {
    phoneNumber:req.body.phoneNumber
}
const secretKey = process.env.SECRET_CODE
const option = {
    expiresIn:"60d",
}
const token = await JWT.sign(payload,secretKey,option)
     res.send(token)
}


const forgotPassword = async(req,res)=>{

}

module.exports = signin