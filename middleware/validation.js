const { check, body, validationResult } = require("express-validator");

const validateRegistration = [
  check("account_firstname").notEmpty().withMessage("First name is required."),
  check("account_lastname").notEmpty().withMessage("Last name is required."),
  check("account_email").isEmail().withMessage("A valid email is required."),
  check("account_password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("notice", errors.array().map(e => e.msg).join(" "));
      return res.redirect("/account/register");
    }
    next();
  }
];

function accountUpdateRules() {
  return [
    body("account_firstname").notEmpty().withMessage("First name is required."),
    body("account_lastname").notEmpty().withMessage("Last name is required."),
    body("account_email").isEmail().withMessage("A valid email is required.")
  ];
}

function passwordRules() {
  return [
    body("account_password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
  ];
}

function checkUpdateData(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("notice", errors.array().map(e => e.msg).join(" "));
    return res.redirect("back");
  }
  next();
}

module.exports = {
  validateRegistration,
  accountUpdateRules,
  passwordRules,
  checkUpdateData
};
