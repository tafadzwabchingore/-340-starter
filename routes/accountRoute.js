// Needed Resources 
const express = require("express");
const router = new express.Router();
const utilities = require('../utilities/index');
const regValidate = require('../utilities/account-validation')

const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation')

router.get('/login', accountController.buildLogin);

router.get('/register', accountController.buildRegister);

router.post('/register', utilities.handleErrors(accountController.registerAccount));

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

router.post(
    "/register",
    regValidate.registationRules(),
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