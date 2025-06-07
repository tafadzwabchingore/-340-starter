// Needed Resources 
const express = require("express");
const router = new express.Router();
const utilities = require('../utilities/index');
const regValidate = require('../utilities/account-validation')
const invController = require("../controllers/invController")

const accountController = require('../controllers/accountController');

router.get('/login', accountController.buildLogin);

router.get('/register', accountController.buildRegister);

router.post('/register', utilities.handleErrors(accountController.registerAccount));

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

router.post("/update/", invController.updateInventory);

router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;