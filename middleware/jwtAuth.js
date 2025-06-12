const jwt = require("jsonwebtoken");
require("dotenv").config();

function checkJWTAuth(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.accountData = decoded;
    next();
  } catch (err) {
    return res.redirect("/account/login");
  }
}

module.exports = { checkJWTAuth };
