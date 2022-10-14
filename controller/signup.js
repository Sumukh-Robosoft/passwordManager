const bcrypt = require("bcrypt")
const UserModel = require("../models/users")


const signup = async (req, res) => {
    const user = new UserModel({
      phoneNumber: req.body.phoneNumber,
      mpinHash: await bcrypt.hash(req.body.mpin.toString(),10)
    })
   
    try {
       await user.save()
       res.send("User Created Successfully")
    } catch(err){
       res.send(err)
    }
       
}

module.exports = signup;