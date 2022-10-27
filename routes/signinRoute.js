const express = require('express');
const router = express.Router();
const authorization = require("../middleware/auth")
const {signin,refresh,signout,getOtp,verifyOtp} = require("../controller/signin");
router.post("/signin",signin)
router.post("/refresh",refresh)
router.post("/signout",signout)
router.get("/getOtp",getOtp)
router.post("/verifyOtp",verifyOtp)
module.exports = router