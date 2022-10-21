const bcrypt = require("bcrypt");
const UserModel = require("../models/users")
const JWT = require("jsonwebtoken")
const fast2sms = require('fast-two-sms');
const cookieparser = require('cookie-parser');
const bodyParser = require('body-parser');

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
const payload = {
    phoneNumber:req.body.phoneNumber
}
const secretKey = process.env.SECRET_CODE
const option = {
    expiresIn:"60m",
}
const token = await JWT.sign(payload,secretKey,option)
const refreshToken = JWT.sign({
        phoneNumber: payload,
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
    res.cookie('JWT', refreshToken, { httpOnly: true, 
        sameSite: 'None', 
        maxAge: 24 * 60 * 60 * 1000 });
await UserModel.findOneAndUpdate({phoneNumber:req.body.phoneNumber},{
    token:refreshToken
}).then(()=>{
    res.send(token)
}).catch(error=>res.send(error))   
    
}

const refresh = async(req,res)=>{
    try {
        const cookies = req.cookies.JWT;
        if (!cookies) return res.sendStatus(401);
    
        const refreshToken = cookies;
    
        UserModel.findOne({token }, async (err, docs) => {
          if (err)
          
          return res.status(400).json({ status: 400, errors: errors.array() });
         if(docs) {
            JWT.verify(
              refreshToken,
              process.env.REFRESH_TOKEN_SECRET,
              (err, decoded) => {
                if (err || docs.token !==decoded.token ) return res.sendStatus(403);
                const token = JWT.sign(
                  { phoneNumber:req.body.phoneNumber },
                  process.env.SECRET_CODE,
                  { expiresIn: "60m" }
                );
             console.log(token);
              }
            );
          }
        });
      } catch (error) {
        res.send(error)
      }
}
    




const forgotPassword = async(req,res)=>{
    let otp = Math.floor(1000 + Math.random() * 9000)
    const number = req.body.phoneNumber
    const response = await fast2sms.sendMessage({authorization : process.env.API_KEY, otp :otp, 
        numbers:number })
    res.send(response)
}



module.exports = {signin,refresh}