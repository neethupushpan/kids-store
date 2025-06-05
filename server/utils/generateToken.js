// utils/generateToken.js
const jwt = require("jsonwebtoken");

const createToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d"
  });
};

module.exports = createToken;
