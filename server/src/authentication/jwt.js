const jwt = require("jsonwebtoken")
const jwtVerify = (req, res, next) => {
  const token = req.cookies.authToken

  if (!token) {
    return res.status(401).json({user: null, message: "token is not there"})
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    console.log("yamate", decode)
    res.json({user: decode})
    // console.log(decode)
    // req.user = decode

    // next()
  } catch (error) {
    res.status(401).json({error: error.message, user: null})
  }
}
const jwtMiddlerware = (req, res, next) => {
  const token = req.cookies.authToken

  if (!token) {
    return res.status(401).json({user: null, message: "token is not there"})
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decode
    next()
  } catch (error) {
    res.status(401).json({error: error.message, user: null})
  }
}

const jwtTokenCreator = ({id, name, email, userImage}) => {
  const token = jwt.sign({id, userImage, name, email}, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
  return token
}
module.exports = {jwtVerify, jwtMiddlerware, jwtTokenCreator}
