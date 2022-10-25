const bcrypt = require("bcrypt");
const UserModel = require("../models/users")
const JWT = require("jsonwebtoken") 
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
await UserModel.findOneAndUpdate({phoneNumber:req.body.phoneNumber},{
    token:refreshToken
}).then(()=>{
    res.json({"AccessToken":token,
   
})
}).catch(error=>res.send(error))   
    
}

const refresh = (req,res) => {
    const refreshToken= req.body.token
    const privateKey = process.env.REFRESH_TOKEN_SECRET;
    try{
        UserModel.findOne({ token:refreshToken}, (err, doc) =>{ 
            if (!doc)
               res.json({ error: true, message: "Invalid refresh token" })
            });
        JWT.verify(refreshToken.toString(), privateKey.toString(), (err, tokenDetails) => {
            if (err)
              res.json({ error: true, message: "Invalid refresh token" })
            });
    const accessToken = JWT.sign({phoneNumber:req.user.phoneNumber},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"15m"})
    res.json({accessToken:accessToken})
        
    }
    catch(err){
        res.send(err)
    }
}  
const  signout= async(req,res)=>{
        try{
            const user = await UserModel.findOne({phoneNumber:req.body.phoneNumber});
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



module.exports = {signin,refresh,signout}