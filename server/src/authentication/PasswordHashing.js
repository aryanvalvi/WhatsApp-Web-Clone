const bcrypt = require("bcrypt")
const passwordHasher = password => {
  const hashedpassword = bcrypt.hash(password, 12)
  return hashedpassword
}

const passwordMatcher = (password, userPassword) => {
  const isMatched = bcrypt.compare(password, userPassword)
  return isMatched
}
module.exports = {passwordHasher, passwordMatcher}
