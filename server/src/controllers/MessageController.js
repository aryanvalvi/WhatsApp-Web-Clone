const {PrismaClient, Prisma} = require("@prisma/client")
const prisma = new PrismaClient()
const cloudinary = require("cloudinary").v2
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
})

const getMessage = async (req, res) => {
  const user = req.user
  const userid = user.id
  const {roomId} = req.params
  const {page = 1, limit = 50} = req.query
  if (!roomId) {
    return res.status(400).json({
      error: "roomId is required",
    })
  }
  try {
    const isParticipant = await prisma.room.findFirst({
      where: {
        id: roomId,
        participants: {
          some: {userId: userid},
        },
      },
    })

    if (!isParticipant) {
      return res.status(403).json({
        error: "You're not a participant in this room",
      })
    }
    await prisma.message.updateMany({
      where: {
        roomId,
        senderId: {not: userid},
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    const messages = await prisma.message.findMany({
      where: {
        roomId: roomId,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            name: true,
            userImage: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    })
    const totalMessages = await prisma.message.count({
      where: {roomId: roomId},
    })
    const transformedMessages = messages.map(message => ({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      senderName: message.sender.name,
      roomId: message.roomId,
      createdAt: message.createdAt,
      sender: message.sender,
      userImage: message.sender.userImage,
      media: message.media,
    }))

    return res.status(200).json({
      success: true,
      data: {
        messages: transformedMessages,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalMessages / limit),
          totalMessages,
          hasMore: page * limit < totalMessages,
        },
      },
    })
  } catch (error) {
    console.log("error while fetching messages", error),
      res.status(500).json({
        message: "server error",
        error: error.message,
      })
  }
}
const sendMessage = async (req, res) => {
  console.log("send Message Called")
  const userid = req.user.id
  const {roomId, content} = req.body
  const image = req.file

  console.log("image is", image)

  // const {roomId, content} = req.body
  if (!roomId || (!content?.trim() && !req.file)) {
    return res.status(400).json({
      error: "roomId and content are required",
    })
  }
  // if (content.trim().length === 0) {
  //   return res.status(400).json({
  //     error: "Message content cannot be empty",
  //   })
  // }

  try {
    const isroom = await prisma.room.findFirst({
      where: {
        id: roomId,
        participants: {
          some: {userId: userid},
        },
      },
    })
    if (!isroom) {
      return res.status(404).json({
        error: "Room not found or you're not a participant",
      })
    }

    let mediaUrl
    if (image) {
      const mediaUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "convexel_media",
        resource_type: "image",
      })
      mediaUrl = mediaUpload.secure_url
    }
    console.log("media url", mediaUrl)

    const newMessage = await prisma.message.create({
      data: {
        content: content.trim() || "",
        senderId: userid,
        roomId,
        isRead: false,
        media: mediaUrl,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            userImage: true,
          },
        },
      },
    })

    const messageData = {
      id: newMessage.id,
      content: newMessage.content,
      senderId: newMessage.senderId,
      senderName: newMessage.sender.name,
      roomId: newMessage.roomId,
      createdAt: newMessage.createdAt,
      sender: newMessage.sender,
      userImage: newMessage.sender.userImage,
      media: newMessage.media,
    }
    req.io.to(roomId).emit("recieve_message", messageData)
    console.log(`Message sent successfully to room ${roomId}`)

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: messageData,
    })
  } catch (error) {
    console.error("Error sending message:", error)
    res.status(500).json({
      message: "Server error",
      error: error.message,
    })
  }
}
const getUnreadCounts = async (req, res) => {
  const user = req.user
  const userid = user.id

  try {
    const userRoom = await prisma.room.findMany({
      where: {
        participants: {
          some: {
            userId: userid,
          },
        },
      },
      select: {
        id: true,
      },
    })

    const roomIds = userRoom.map(room => room.id)

    const unreadData = await Promise.all(
      roomIds.map(async roomid => {
        const unreadCount = await prisma.message.count({
          where: {
            roomId: roomid,
            senderId: {not: userid},
            isRead: false,
          },
        })
        const latestMessage =
          unreadCount > 0
            ? await prisma.message.findFirst({
                where: {
                  roomId: roomid,
                  senderId: {not: userid},
                  isRead: false,
                },
                include: {
                  sender: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
                orderBy: {
                  createdAt: "desc",
                },
              })
            : null
        return {
          roomid,
          unreadCount,
          latestUnreadMessage: latestMessage
            ? {
                id: latestMessage.id,
                content: latestMessage.content,
                senderId: latestMessage.senderId,
                senderName: latestMessage.sender.name,
                createdAt: latestMessage.createdAt,
                sender: latestMessage.sender,
              }
            : null,
        }
      })
    )
    const roomsWithUnread = unreadData.filter(room => room.unreadCount > 0)
    res.status(200).json({
      success: true,
      data: {
        totalUnreadMessage: roomsWithUnread.length,
        unreadData: roomsWithUnread,
      },
    })
  } catch (error) {
    console.error("Error sending message:", error)
    res.status(500).json({
      message: "Server error",
      error: error.message,
    })
  }
}
module.exports = {sendMessage, getMessage, getUnreadCounts}
