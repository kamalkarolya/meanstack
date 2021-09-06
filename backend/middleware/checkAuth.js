const jwt = require("jsonwebtoken");

module.exports = (req,res,next) =>{
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {userEmail:decodedToken.email , userId : decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({messege:"You Are Not Authenticated!!"});
  }
}
