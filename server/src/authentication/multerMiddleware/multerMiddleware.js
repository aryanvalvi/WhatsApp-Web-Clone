const multer = require("multer")
const path = require("path")
const fs = require("fs")
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/images")
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, {recursive: true})
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname) || ".jpg"
    const uniqueName = `image_${Date.now()}_${Math.round(Math.random() * 1e9)}`
    return cb(null, uniqueName + extension)
  },
})
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../UserMediauploads/images")
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, {recursive: true})
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname) || ".jpg"
    const uniqueName = `image_${Date.now()}_${Math.round(Math.random() * 1e9)}`
    return cb(null, uniqueName + extension)
  },
})
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
})

const upload2 = multer({
  storage: storage2,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
})

module.exports = {upload, upload2}
