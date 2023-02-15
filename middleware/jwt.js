const jwt = require("jsonwebtoken");

//routes that need auth will go through this
const verifyToken = (req, res, next) => {
  //for sake of example token is used in body but can be used in headers
  //most likely design with token in header
  const token = req.body.token;
  //  req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    //decode the token and pass through
    const decoded = jwt.verify(token, config.TOKEN_KEY);
  } catch (err) {
    //if invalid token we just return, don't proceed further
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
