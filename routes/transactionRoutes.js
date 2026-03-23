const express = require("express")
const router = express.Router()
//add controllers
const {
    depositController,
    sendController} = require("../controllers/transactionController")
const {authMiddleWare} = require("../middleware/authmiddleware")

//add validation schemas
// const validate = require("../validations/validate")
// const {
//     registerSchema,
//     loginSchema} = require("../validations/userValidation")

router.post("/transaction/deposit",authMiddleWare,depositController)
router.post("/transaction/send",authMiddleWare,sendController)

module.exports = router