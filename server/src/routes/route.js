const express = require("express")
const {
  signup,
  login,
  verificationFunction,
} = require("../authentication/signup")
const {jwtVerify, jwtMiddlerware} = require("../authentication/jwt")
const {
  sendFriendRequest,
  getAllRequestSender,
  controlFriendRequestSender,
  getAllRequestReciver,
  controlFriendRequestReciver,
  getFriendList,
} = require("../controllers/FriendRequest")
const {
  sendMessage,
  getMessage,
  getUnreadCounts,
} = require("../controllers/MessageController")
const {
  upload,
  upload2,
} = require("../authentication/multerMiddleware/multerMiddleware")
const {createGroup} = require("../controllers/GroupController")
const {getOnlineStatus} = require("../controllers/StatusSocket")
const {
  updateProfile,
  logout,
  accountDelete,
} = require("../controllers/profile/profileController")
const router = express.Router()
router.post("/verificationemail", verificationFunction)
router.post("/register", upload.single("image"), signup)
router.post("/login", login)
router.get("/test", (req, res) => res.send({message: "working"}))
router.get("/authcheck", jwtVerify)

//friend request management and room creation
router.post("/sent_friend_Request", jwtMiddlerware, sendFriendRequest)
router.get("/pending_request", jwtMiddlerware, getAllRequestSender)
router.post(
  "/pending_sender_withdraw",
  jwtMiddlerware,
  controlFriendRequestSender
)
router.get(
  "/pending_request_reciever_end",
  jwtMiddlerware,
  getAllRequestReciver
)
router.post(
  "/pending_recirver_dicision",
  jwtMiddlerware,
  controlFriendRequestReciver
)

//friends get
router.get("/getfriends", jwtMiddlerware, getFriendList)

//sending Message
router.post(
  "/send_message",
  upload2.single("image"),
  jwtMiddlerware,
  sendMessage
)
router.get("/get_message/:roomId", jwtMiddlerware, getMessage)
router.get("/get_unread_counts", jwtMiddlerware, getUnreadCounts)

//creating group
router.post("/create_group", jwtMiddlerware, createGroup)

//status
router.get("/get_user_status", getOnlineStatus)

//profile setting
router.post("/update_profile", jwtMiddlerware, updateProfile)
router.post("/logout", jwtMiddlerware, logout)
router.post("/accout_delete", jwtMiddlerware, accountDelete)

module.exports = router
