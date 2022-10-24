const express = require('express');
const router = express.Router();
const authorization = require("../middleware/auth")
const {signin,refresh,signout} = require("../controller/signin");
router.post("/signin",signin)
router.post("/refresh",authorization,refresh)
router.post("/signout",authorization,signout)
module.exports = router