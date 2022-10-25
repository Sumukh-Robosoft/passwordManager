const express = require("express");
const speakeasy = require("speakeasy")
const UserModel = require("../models/users")
const bcrypt = require("bcrypt")



const getOtp=async(req, res) => {
    try {
      const secret = speakeasy.generateSecret({length: 10})
              res.send({
            "token": speakeasy.totp({
            secret: secret.base32,
            encoding: "base32",
            step: 60
        }),
        "secret":secret.base32,
       
    })
}
 catch (error) {
      
      res.status(500).send(error)
       } 
  } 

const verifyOtp = async(req, res) => {
    const otp = req.body.token;
    const phoneNumber=req.body.phoneNumber;
    const mpinHash = await bcrypt.hash( req.body.mpin,10)
    const user =await  UserModel.findOne({phoneNumber:phoneNumber})
    console.log(user)
    const verified = speakeasy.totp.verify({secret: req.body.secret, encoding: 'base32', token: otp,window:0,step:60});
    if(user != null && verified){
            user.updateOne({mpinHash:mpinHash},(err,docs)=>{
               if(err){
                  return res.send(err)
               }
               res.send("mpin updated")
            })
           
       }
    else{
        res.send("invalid otp/phoneNumber")
    }
}

module.exports = {getOtp,verifyOtp}