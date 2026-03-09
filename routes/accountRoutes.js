const express = require("express")
const router =express.Router()

const {createController,sendController} = require("../controllers/accountController")

// const validate = require("../validations/validate")
// const sendSchema = require("../validations/accountValidation")

router.post("/account/create",createController)
router.post("/account/send",sendController)

module.exports = router;