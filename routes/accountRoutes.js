const express = require("express")
const router =express.Router()

const {createController,readController} = require("../controllers/accountController")
const {authMiddleWare} = require("../middleware/authmiddleware")
// const validate = require("../validations/validate")
// const sendSchema = require("../validations/accountValidation")

router.post("/account/create",authMiddleWare,createController)
router.get("/account/view",authMiddleWare,readController)

module.exports = router;