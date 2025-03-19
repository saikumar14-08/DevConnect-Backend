const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  var { usercookie } = req?.cookies;
  if (!usercookie)
    res.status(401).send("There is no token!!. Please login again");
  else {
    var decodedObj = jwt.verify(usercookie, "Sai@1999");
    const { _id } = decodedObj;
    const userProfile = await User.findById({ _id });
    req.user = userProfile;
    next();
  }
};

module.exports = userAuth;
