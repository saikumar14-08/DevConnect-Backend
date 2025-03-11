const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    var { usercookie } = req.cookies;
    if (!usercookie) res.send("There is no token!!. Please login again");
    var decodedObj = jwt.verify(usercookie, "Sai@1999");
    const { _id } = decodedObj;
    const userProfile = await User.findById({ _id });
    req.user = userProfile;
    next();
  } catch (e) {
    res.send(e.message);
  }
};

module.exports = userAuth;
