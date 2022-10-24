const express = require('express');
const router = express.Router();
const authorization = require("../middleware/auth")
const {signin,refresh} = require("../controller/signin");
router.post("/signin",signin)
router.post("/refresh",authorization,refresh)
module.exports = router