// Needed Resources 
const express = require("express");
const router = new express.Router();
const utilities = require('../utilities/index');
const regValidate = require('../utilities/account-validation')
const invController = require("../controllers/invController")
const accountController = require('../controllers/accountController');
const { checkJWTAuth } = require("../middleware/jwtAuth");
const { accountUpdateRules, passwordRules, checkUpdateData } = require("../middleware/validation");

router.get("/update/:id", checkJWTAuth, accountController.buildAccountUpdate);
router.post("/update", accountUpdateRules(), checkUpdateData, accountController.updateAccount);
router.post("/update-password", passwordRules(), checkUpdateData, accountController.updatePassword);


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

router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  req.flash("notice", "You have successfully logged out.");
  res.redirect("/");
});

module.exports = router;