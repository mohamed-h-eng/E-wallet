const express = require("express")
const router = express.Router()
//add controllers
const {
    registerController,
    loginController} = require("../controllers/authController")
//add validation schemas
const validate = require("../validations/validate")
const {
    registerSchema,
    loginSchema} = require("../validations/userValidation")

router.post("/register", validate(registerSchema),registerController)
router.post("/login", validate(loginSchema),loginController)

module.exports = router