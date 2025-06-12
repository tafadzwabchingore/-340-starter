const jwt = require("jsonwebtoken");
require("dotenv").config();

function checkAccountRole(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const accountType = decoded.account_type;
    
    if (accountType === "Employee" || accountType === "Admin") {
      res.locals.accountData = decoded;
      next();
    } else {
      req.flash("notice", "You do not have permission to access that resource.");
      res.redirect("/account/login");
    }
  } catch (err) {
    req.flash("notice", "Invalid session. Please log in again.");
    res.redirect("/account/login");
  }
}

module.exports = { checkAccountRole };