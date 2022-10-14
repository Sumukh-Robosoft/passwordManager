const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config()

const signupRoute = require("./routes/signupRoute")
const signinRoute = require("./routes/signinRoute")
const site = require("./routes/siteRoute")



const app = express()

app.use(express.json())
app.use('/',signupRoute)
app.use('/',signinRoute)
app.use('/',site)



mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.listen(process.env.PORT || 3000,()=>{
    console.log(`Server Running on port ${process.env.PORT}`)
})