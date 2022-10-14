const jwt = require("jsonwebtoken")
function authorizeToken(req,res,next){
     const bearerHeader = req.headers["authorization"];
     const token = bearerHeader && bearerHeader.split(" ")[1];
     if( token == null) return res.status(403).send("No authorization header")
     jwt.verify(token,process.env.SECRET_CODE,(err,user)=>{
     if(err) return res.status(401).send(err)
     req.user=user
   
})
next();
}
module.exports = authorizeToken;
