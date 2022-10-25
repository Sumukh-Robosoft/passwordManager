const siteModel = require("../models/sites");
const userModel = require("../models/users")
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.ENCRYPT_KEY);
const bcrypt = require("bcrypt")


//ADD NEW SITES
const addSite = async(req,res) =>{
    const newSite = new siteModel({
        "mobile":req.user.phoneNumber,
       "URL":req.body.URL,
       "sector":req.body.sector,
        "siteName":req.body.siteName,
        "userName":req.body.userName,
        "sitePassword":cryptr.encrypt(req.body.sitePassword),
        "notes":req.body.notes
    })
    try {
        await newSite.save()
        res.status(200).send("site added Successfully")
     } catch(err){
        res.send(err)
     }

}

//EDIT EXISTING SITE
const editSite = async (req,res) =>{
   await  siteModel.findOneAndUpdate({$and:[{_id:req.body._id},{mobile:req.user.phoneNumber}]},{
        siteName:req.body.siteName,
        userName:req.body.userName,
        sitePassword:cryptr.encrypt(req.body.sitePassword),
        notes:req.body.notes
    }).then(()=>{
        res.send("updated")
    }).catch(error=>res.send(error))   
}

//DELETE SITE
const deleteSite = async (req,res)=>{
    await siteModel.findOneAndDelete({$and:[{_id:req.body._id},{mobile:req.user.phoneNumber}]}, function (err, docs){
       if (err){
           res.send(err)
       }
       else if(docs == null){
        res.status(404).send("not found");
       }
       else{
         res.status(200).send("deleted site");
       }
   }).clone(); 
}

//VIEW ALL SITES
const viewSite= async(req,res)=>{
      try{
       const response = await siteModel.find({
        mobile:req.user.phoneNumber
    })
     res.send(response)
  }
catch(err){
    res.status(404).send("not found")
    }
}


//VIEW SITES BASED ON SECTOR/FOLDER
const filteredView = async(req,res)=>{
    try{
        const fliteredResponse = await siteModel.find({$and:[{sector:req.body.sector},{mobile:req.user.phoneNumber}]
           
    })
        res.send(fliteredResponse)
    }
    catch(err){
        res.status(404).send("Not found")
    }
}

//VIEW SITE PASSWORD
const viewPassword = async(req,res)=>{
    try{
        const result = await siteModel.find({
            URL:req.body.URL
        })
       
        res.send(cryptr.decrypt(result[0].sitePassword))
    }
    catch(err){
       res.send(err)
    }
}



//SEARCH SITE BASED ON NOTES/SECTOR/USERNAME
const searchSite = async(req,res) =>{
   try{
   const siteResults=await siteModel.find({$or: 
       [{notes:{$regex:req.body.text} }
        ,{sector: {$regex:req.body.text}},
        {userName: {$regex:req.body.text}  }
        ]
    
    })
    res.send(siteResults)
   } 
   catch(error){
    res.send(error)
   }
    
}


//Update Mpin
const resetPassword = async(req,res)=>{
    await userModel.findOneAndUpdate({phoneNumber:req.body.phoneNumber},{
        mpinHash: await bcrypt.hash(req.body.mpin.toString(),10)
    }).then(()=>{
        res.send("Mpin Reset successful")
    }).catch(error=>res.send(error))   
}


module.exports={ addSite, editSite,deleteSite,viewSite,filteredView,viewPassword,searchSite,resetPassword}

