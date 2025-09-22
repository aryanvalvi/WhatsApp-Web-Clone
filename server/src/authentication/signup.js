const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const {PrismaClient} = require("@prisma/client")
const {jwtTokenCreator} = require("./jwt")
const {passwordMatcher, passwordHasher} = require("./PasswordHashing")
const prisma = new PrismaClient()
const cloudinary = require("cloudinary").v2

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
})
const verificationFunction = async (req, res) => {
  const {email, password, name} = req.body
  if (!email || !password || !name) {
    return res.send({success: false, error: "Please fill all the coloumn"})
  }
  try {
    const isAlreadyRegistered = await prisma.user.findFirst({
      where: {email},
    })
    if (isAlreadyRegistered) {
      return res.status(401).json({
        error: "user is already registed with this email",
        success: false,
      })
    }
    if (!isAlreadyRegistered) {
      return res.status(200).json({
        success: true,
      })
    }
  } catch (error) {
    res.status(500).json({message: "Server error", error, success: false})
  }
}
const signup = async (req, res) => {
  console.log("signup called")

  const {email, password, name} = req.body
  const image = req.file
  console.log(email, password, name, image)
  if (!email || !password || !name)
    return res.send({error: "Please fill all the coloumn"})

  try {
    const isAlreadyRegistered = await prisma.user.findFirst({
      where: {email},
    })
    if (isAlreadyRegistered) {
      return res.status(401).json({
        message: "user is already registed with this email",
        email: false,
      })
    }
    // const isUserNameTaken = await prisma.user.findFirst({
    //   where: {name},
    // })
    // if (isUserNameTaken) {
    //   return res.status(401).json({
    //     message: "user is already taken with this username ",
    //     username: false,
    //   })
    // }
    const hashedpassword = await passwordHasher(password)
    // const hashedpassword = await bcrypt.hash(password, 12)
    const profileImage = await cloudinary.uploader.upload(req.file.path, {
      folder: "whatsapps_Profile",
      resource_type: "image",
    })

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedpassword,
        name,
        userImage: profileImage.secure_url,
      },
    })

    console.log("data added")

    const token = jwtTokenCreator({
      id: user.id,
      name: user.name,
      email: user.email,
      userImage: user.userImage,
    })
    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    res.status(200).json({
      message: "User registered successfully",
      user,
      username: true,
      email: true,
      userImage: profileImage.secure_url,
    })
  } catch (error) {
    res.status(500).json({message: "data Not added", error})
    console.log("error while puting data in it", error)
  }
}

const login = async (req, res) => {
  const {email, password} = req.body
  if (!email || !password)
    return res.send({error: "Please add both email and password"})

  try {
    const user = await prisma.user.findFirst({
      where: {email},
    })
    if (!user) {
      return res.status(401).json({
        message: "user is Not registed please register",
        email: false,
      })
    }
    const passwordCheck = passwordMatcher(password, user.password)
    // const passwordCheck = await bcrypt.compare(password, user.password)
    if (!passwordCheck) {
      return res.status(401).json({
        message: "Invalid password please use correct password",
        password: false,
      })
    }
    console.log("yamate2", user)
    const token = jwtTokenCreator({
      id: user.id,
      name: user.name,
      email: user.email,
      userImage: user.userImage,
    })
    // const token = jwt.sign(
    //   {id: user.id, username: user.name, email: user.email},
    //   "gandubro",
    //   {
    //     expiresIn: "7d",
    //   }
    // )
    console.log("token is ", token)
    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })

    console.log("data added")

    res.status(200).json({
      message: "User login successfully",
      password: true,
      email: true,
      user,
    })
  } catch (error) {
    res.status(500).json({message: "data Not added", error})
    console.log("error while puting data in it", error)
  }
}

module.exports = {signup, login, verificationFunction}
