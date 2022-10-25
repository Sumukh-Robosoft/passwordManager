const express = require('express');
const router = express.Router();

const {getOtp,verifyOtp} = require("../controller/forgot");
router.get("/getOtp",getOtp)
router.post("/verifyOtp",verifyOtp)

module.exports = router