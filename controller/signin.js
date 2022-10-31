const bcrypt = require("bcrypt");
const UserModel = require("../models/users")
const JWT = require("jsonwebtoken") 
const speakeasy = require("speakeasy")
require("dotenv").config()

const signin = async (req,res) =>{
    const phoneNumber= req.body.phoneNumber;
    let [user] = await UserModel.find({phoneNumber:phoneNumber}).clone();
    if(!user){
        return res.status(401).send("Invalid credentials")
    }
    
   const isMatch = await bcrypt.compare(req.body.mpin.toString(),user.mpinHash)
   if(!isMatch){
    return res.status(401).send("Invalid credentials")
}

const token = await JWT.sign({
    phoneNumber:req.body.phoneNumber
},process.env.SECRET_CODE,{
    expiresIn:"15m",
})
const refreshToken = JWT.sign({
        phoneNumber: payload,
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
await UserModel.findOneAndUpdate({phoneNumber:req.body.phoneNumber},{
    token:refreshToken
}).then(()=>{
    res.json({"AccessToken":token,
   
})
}).catch(error=>res.send(error))   
    
}

const refresh =async (req,res) => {
    try{
       const user = await UserModel.find({token:req.body.token})
        if (user[0].token == null){
            res.json({ error: true, message: "kindly Login" })
        }
        else{
            JWT.verify(req.body.token.toString(),process.env.REFRESH_TOKEN_SECRET.toString(), (err, tokenDetails) => {
                if (err)
                  res.json({ error: true, message: "Invalid refresh token" })
                })
            
            const accessToken = JWT.sign({phoneNumber:req.body.phoneNumber},process.env.SECRET_CODE,{expiresIn:"15m"})
            res.json({accessToken:accessToken})
        }
    }
catch(err){
        res.send(err)
    }
}  


const  signout= async(req,res)=>{
        try{
            const user = await UserModel.findOne({token:req.body.token});
            if(!user){
                res.send("Not logged in")
            }
            await user.updateOne({$unset:{token:""}})
            res.send("logged out successfully")
        }
        catch(err){
            res.send(err)
        }
}



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
        res.send("invalid credentials")
    }
}
module.exports = {signin,refresh,signout,getOtp,verifyOtp}