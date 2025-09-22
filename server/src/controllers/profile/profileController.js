const {PrismaClient} = require("@prisma/client")
const {jwtTokenCreator} = require("../../authentication/jwt")
const prisma = new PrismaClient()
const updateProfile = async (req, res) => {
  console.log("called")
  const userid = req.user.id
  console.log(userid)
  const {email, name} = req.body
  console.log(email, name)
  const updateData = {}
  if (email) {
    updateData.email = email
  }
  if (name) {
    updateData.name = name
  }
  try {
    const updatedData = await prisma.user.update({
      where: {id: userid},
      data: updateData,
    })

    const token = jwtTokenCreator({
      id: updatedData.id,
      userName: updatedData.name,
      email: updatedData.email,
      userImage: updatedData.userImage,
    })
    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    res.status(200).json({message: "Data updated Successfully", updatedData})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}
const logout = async (req, res) => {
  const userid = req.user.id
  if (!userid) {
    return res.status(400).json({success: false, message: "User not logged in"})
  }

  res.clearCookie("authToken")
  res.json({success: true, message: "logged out"})
}
const accountDelete = async (req, res) => {
  const userid = req.user.id
  if (!userid) {
    return res.status(400).json({success: false, message: "User not logged in"})
  }

  try {
    await prisma.user.delete({
      where: {id: userid},
    })
    res.clearCookie("authToken")
    res.status(200).json({
      success: true,
      message: "Account deleted successfully. Redirecting in 3 seconds...",
    })
  } catch (error) {}
}

module.exports = {
  updateProfile,
  logout,
  accountDelete,
}
