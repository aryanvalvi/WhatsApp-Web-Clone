const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

const getOnlineStatus = (req, res) => {
  try {
    const users = Array.from(req.app.get("onlineUser").keys())
    res.json({onlineUser: users})
  } catch (error) {}
}

module.exports = {getOnlineStatus}
