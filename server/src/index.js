const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const {Server} = require("socket.io")
const cors = require("cors")
const route = require("./routes/route")
const cookieParser = require("cookie-parser")
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
require("dotenv").config()

app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: [process.env.Frontend_Url, process.env.Frontend_Url2],
    methods: ["GET", "POST"],
    credentials: true,
  })
)
const io = new Server(server, {
  cors: {
    origin: [process.env.Frontend_Url, process.env.Frontend_Url2],
    methods: ["GET", "POST"],
    credentials: true,
  },
})

app.use(express.json({limit: "20mb"}))
app.use(express.urlencoded({limit: "20mb", extended: true}))
app.use(cookieParser())
app.use((req, res, next) => {
  req.io = io
  next()
})
app.use("/", route)

app.get("/", (req, res) => {
  res.json({message: "hi bro"})
})

const onlineUser = new Map()
const roomUsers = new Map()
const userSockets = new Map()
app.set("onlineUser", onlineUser)
io.on("connection", socket => {
  // console.log(`a user is connected with id ${socket.id}`)

  //FOR SENDING MESSAGES AND RECIVEING it
  socket.on("send_message", data => {
    // console.log(data)
    socket.to(data.room).emit("recieve_message", data)
  })

  //  NOW FOR INDICATORS SETUP
  // we need temp storage for indicators that why we crea onlineUser and roomUser
  // we need to fire 2 io event from frontedn to store in this Map and user accordnigly

  socket.on("join_room", roomId => {
    const userId = userSockets.get(socket.id)
    if (!userId) {
      console.log("No userId found for socket:", socket.id)
      return
    }
    console.log("the user id in join room is ", userId)

    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Set())
    }
    roomUsers.get(roomId).add(userId)
    socket.join(roomId)
    console.log(
      `user ${userId} joing the the room ${roomId} with id ${socket.id}`
    )
  })
  socket.on("typing", ({senderId, roomId}) => {
    console.log(`SERVER: ${senderId} is typing to room id ${roomId}`)
    const usersInRoom = roomUsers.get(roomId)
    if (!usersInRoom) {
      console.log(`No users found in room ${roomId}`)
      return
    }
    usersInRoom.forEach(userId => {
      if (userId !== senderId && onlineUser.has(userId)) {
        const userSocketId = onlineUser.get(userId)
        console.log(
          `Sending typing indicator to user ${userId} with socket ${userSocketId}`
        )
        io.to(userSocketId).emit("typing", {senderId, roomId})
      }
    })
  })

  socket.on("stop_typing", ({senderId, roomId}) => {
    console.log(`SERVER: User ${senderId} stopped typing in room ${roomId}`)

    const usersInRoom = roomUsers.get(roomId)
    if (!usersInRoom) {
      console.log(`No users found in room ${roomId}`)
      return
    }

    console.log(
      `Broadcasting stop typing to users in room ${roomId}:`,
      Array.from(usersInRoom)
    )

    // Broadcast to all users in the room except the sender
    usersInRoom.forEach(userId => {
      if (userId !== senderId && onlineUser.has(userId)) {
        const userSocketId = onlineUser.get(userId)
        console.log(
          `Sending stop typing to user ${userId} with socket ${userSocketId}`
        )
        io.to(userSocketId).emit("stop_typing", {senderId, roomId})
      }
    })
  })
  socket.on("user_online", async userId => {
    console.log(`${userId} is online with socket ${socket.id}`)
    // Store the mapping both ways
    onlineUser.set(userId, socket.id)
    userSockets.set(socket.id, userId)
    try {
      const friends = await prisma.friendship.findMany({
        where: {
          OR: [{user1Id: userId}, {user2Id: userId}],
        },
      })
      const friendsIds = friends.map(f =>
        f.user1Id === userId ? f.user2Id : f.user1Id
      )
      friendsIds.forEach(f => {
        const friendsSocket = onlineUser.get(f)
        if (friendsSocket) {
          io.to(friendsSocket).emit("friend_online", userId)
        }
        console.log("send to the friend")
      })
      // Send currently online friends to this user
      const onlineFriends = friendsIds.filter(friendId =>
        onlineUser.has(friendId)
      )

      if (onlineFriends.length > 0) {
        socket.emit("friends_online_list", onlineFriends)
      }
    } catch (error) {
      console.error("Error handling user_online:", error)
    }

    // console.log("All friends ", friends)
    // console.log("Friends ids", friendsIds)
    // // io.emit("get_online_users", Array.from(onlineUser.keys()))
  })
  socket.on("leave_room", roomId => {
    socket.leave(roomId)
  })
  socket.on("disconnect", async () => {
    let disconnectUserId = null
    for ([userId, sockId] of onlineUser.entries()) {
      if (sockId === socket.id) {
        disconnectUserId = userId
        onlineUser.delete(userId)
        break
      }
    }
    if (disconnectUserId) {
      const friends = await prisma.friendship.findMany({
        where: {
          OR: [{user1Id: disconnectUserId}, {user2Id: disconnectUserId}],
        },
      })
      const friendsIds = friends.map(f =>
        f.user1Id === disconnectUserId ? f.user2Id : f.user1Id
      )
      friendsIds.forEach(f => {
        const friendsSocket = onlineUser.get(f)
        if (friendsSocket) {
          io.to(friendsSocket).emit("friend_offline", disconnectUserId)
        }
        console.log("offline send  to the friend")
      })
      try {
      } catch (error) {
        console.error("Error handling disconnect:", error)
      }
    }
    // console.log(`a user is disconnect with id ${socket.id}`)
  })
})
server.listen(5006, () => {
  console.log("server is running on port 5001")
})
