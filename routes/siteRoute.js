const express = require("express")
const router = express.Router();
const {addSite,editSite,deleteSite,viewSite,filteredView, viewPassword,searchSite} = require("../controller/site");
const authorization = require("../middleware/auth")
router.post("/addSite",authorization,addSite)
router.patch("/editSite",authorization,editSite)
router.delete("/deleteSite",authorization,deleteSite)
router.get("/viewSite",authorization,viewSite)
router.post("/filterSite",authorization,filteredView)
router.post("/viewPassword",authorization,viewPassword)
router.post("/searchSite",authorization,searchSite)

module.exports = router