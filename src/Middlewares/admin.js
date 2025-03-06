
const admincheck = (req,res,next) => {
  let admin = 'admin';
  if(admin !== 'admin') 
    res.status(401).send("YOu're not an Admin")
  else next();
}

module.exports = admincheck