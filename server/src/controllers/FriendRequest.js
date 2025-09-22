const {PrismaClient, Prisma} = require("@prisma/client")
const prisma = new PrismaClient()
//working fine
const sendFriendRequest = async (req, res) => {
  // console.log("send called")
  // const userId = "cmeuy2kza0000ujjpq45in5vb"
  // const {recirverID} = req.body

  const user = req.user
  // console.log(user)
  const userid = user.id

  const {emailid} = req.body
  // console.log(emailid)
  if (!emailid) {
    return res.status(400).json({error: "email is required"})
  }
  if (user.email === emailid) {
    return res
      .status(400)
      .json({error: "Cannot send friend request to yourself"})
  }
  const thatUser = await prisma.user.findFirst({
    where: {
      email: emailid,
    },
  })
  if (!thatUser) {
    return res
      .status(404)
      .json({message: "User is not not register in convexel"})
  }
  const requestedUserID = thatUser.id

  try {
    const existingFriends = await prisma.friendship.findFirst({
      where: {
        OR: [
          {user1Id: userid, user2Id: requestedUserID},
          {user1Id: requestedUserID, user2Id: userid},
        ],
      },
    })
    if (existingFriends) {
      return res.status(400).json({error: "you are already a friend"})
    }
    // console.log(existingFriends)

    const isalreadySendRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            senderId: userid,
            receiverId: requestedUserID,
          },
          {
            senderId: requestedUserID,
            receiverId: userid,
          },
        ],
        status: "PENDING",
      },
    })
    if (isalreadySendRequest) {
      return res
        .status(400)
        .json({error: "you already sent an request to this user"})
    }

    const newFriendRequest = await prisma.friendRequest.create({
      data: {
        senderId: userid,
        receiverId: requestedUserID,
        status: "PENDING",
      },
    })
    // console.log("request send succcessfully")
    return res.status(200).json({
      message: "Friend request sent successfully",
      request: newFriendRequest,
      success: true,
    })
  } catch (error) {
    res.status(500).json({message: "server error", error})
  }
}

//working fine
const getAllRequestSender = async (req, res) => {
  // console.log("Request sender called")
  const user = req.user
  const userId = user.id

  try {
    const checkAllSenderRequest = await prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        status: "PENDING",
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {createdAt: "desc"},
      take: 50, // Limit results for better performance
    })

    // console.log("Data retrieved successfully")
    return res.status(200).json({
      message: "Sent requests retrieved successfully",
      requests: checkAllSenderRequest,
      count: checkAllSenderRequest.length,
    })
  } catch (error) {
    // console.error("Error fetching requests:", error)
    res.status(500).json({message: "Server error", error: error.message})
  }
}
//working fine
const controlFriendRequestSender = async (req, res) => {
  // console.log("controlrequest called")
  const user = req.user
  const userId = user.id
  const {manipulateId} = req.body
  if (!manipulateId) {
    return res.status(400).json({error: "Request ID is required"})
  }
  // console.log(manipulateId, userId)
  try {
    const isThere = await prisma.friendRequest.findFirst({
      where: {
        id: manipulateId,
      },
    })
    if (!isThere)
      return res
        .status(404)
        .json({message: "Friend request cancelation not found in db"})
    if (isThere.senderId !== userId) {
      return res
        .status(403)
        .json({error: "You can only cancel your own requests"})
    }

    if (isThere.status !== "PENDING") {
      return res.status(400).json({error: "Can only cancel pending requests"})
    }

    const deleteRequest = await prisma.friendRequest.delete({
      where: {
        id: manipulateId,
      },
    })
    return res.status(200).json({
      message: "friend request Delete",
      deletedReq: deleteRequest,
      success: true,
    })
  } catch (error) {
    res.status(500).json({message: "server error", error})
  }
}
//working fine
const getAllRequestReciver = async (req, res) => {
  // const userId = "cmeuy2kza0000ujjpq45in5vb"
  const user = req.user
  const userId = user.id
  // const userId = "cmewvpg6o0000ujnp2xrei3xj"
  try {
    checkAllSenderRequest = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: "PENDING",
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
      orderBy: {createdAt: "desc"},
    })
    if (!checkAllSenderRequest) {
      return res.status(404).json({message: "empty requests"})
    }
    const receiverId = checkAllSenderRequest[0]?.receiverId

    if (userId === receiverId) {
      return res.status(200).json({
        message: "Received requests retrieved successfully",
        requests: checkAllSenderRequest,
        count: checkAllSenderRequest.length,
      })
    }
  } catch (error) {
    // console.log(error)
    res.status(500).json({message: "server error", error})
  }
}

// this is also working fine 1) accepted 2) friends 3)room id 4) participasnts
const controlFriendRequestReciver = async (req, res) => {
  // const userId = "cmeuy2kza0000ujjpq45in5vb"
  const user = req.user
  const userId = user.id
  const {manipulateId, Decision} = req.body
  // console.log("king", manipulateId, Decision)

  if (!manipulateId || !Decision) {
    return res.status(400).json({error: "Request ID and decision are required"})
  }

  if (!["ACCEPTED", "REJECTED"].includes(Decision)) {
    return res
      .status(400)
      .json({error: "Decision must be ACCEPTED or REJECTED"})
  }
  try {
    const isThere = await prisma.friendRequest.findUnique({
      where: {
        id: manipulateId,
      },
    })
    if (!isThere)
      return res.status(404).json({message: "there is no Request in the queue"})
    if (isThere.receiverId !== userId) {
      return res
        .status(403)
        .json({error: "You can only respond to requests sent to you"})
    }

    if (isThere.status !== "PENDING") {
      return res.status(400).json({error: "Request has already been processed"})
    }

    if (Decision === "ACCEPTED") {
      const friendship = await prisma.friendship.createMany({
        data: {
          user1Id: isThere.senderId,
          user2Id: userId,
        },
      })

      const updateRequest = await prisma.friendRequest.update({
        where: {
          id: manipulateId,
        },
        data: {
          status: "ACCEPTED",
        },
      })

      const createRoom = await prisma.room.create({
        data: {
          name: null,
          participants: {
            create: [{userId: isThere.senderId}, {userId: isThere.receiverId}],
          },
        },
      })
      return res.status(200).json({
        message: "Request accepted",
        request: updateRequest,
        room: createRoom,
      })
    } else if (Decision === "REJECTED") {
      const updateRequest = await prisma.friendRequest.update({
        where: {
          id: manipulateId,
        },
        data: {
          status: "REJECTED",
        },
      })
      return req
        .status(200)
        .json({message: "Request Rejected", request: updateRequest})
    }
  } catch (error) {}
}
const getFriendList = async (req, res) => {
  // console.log("getFriendList called")
  // console.log(req.user)
  const userid = req.user.id

  if (!userid) return res.status(401).json({message: "user not found"})

  try {
    // Get all friendships for the user
    const getfriends = await prisma.friendship.findMany({
      where: {
        OR: [{user1Id: userid}, {user2Id: userid}],
      },
      orderBy: {createdAt: "desc"},
    })
    const groups = await prisma.room.findMany({
      where: {
        participants: {
          some: {userId: userid},
        },
        name: {not: null},
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    })
    console.log("groups", groups)

    // console.log("friendships found:", getfriends)

    // Extract friend IDs
    const friendIds = getfriends.map(friendship => {
      return friendship.user1Id === userid
        ? friendship.user2Id
        : friendship.user1Id
    })

    // console.log("friend IDs:", friendIds)

    // Get friend details with their corresponding room IDs

    const friendsWithRoomIds = await Promise.all(
      friendIds.map(async friendId => {
        // Get friend details
        const friendDetail = await prisma.user.findUnique({
          where: {id: friendId},
          select: {
            id: true,
            name: true,
            email: true,
            userImage: true,
          },
        })

        // Find the room between current user and this specific friend
        const room = await prisma.room.findFirst({
          where: {
            AND: [
              {
                participants: {
                  some: {userId: userid},
                },
              },
              {
                participants: {
                  some: {userId: friendId},
                },
              },
            ],
          },
          select: {
            id: true,
            createdAt: true,
            messages: {
              orderBy: {createdAt: "desc"},
              take: 1,
              select: {
                id: true,
                content: true,
                createdAt: true,
                isRead: true,
                senderId: true,
              },
            },
          },
        })
        const unreadCount = await prisma.message.count({
          where: {
            roomId: room?.id,
            senderId: friendId, // Messages sent by the friend
            isRead: false, // That haven't been read by current user
            // You might need additional conditions based on your schema
          },
        })
        const latestMessage = room?.messages?.[0] || null

        return {
          id: friendDetail.id,
          name: friendDetail.name,
          userImage: friendDetail.userImage,
          email: friendDetail.email,
          roomId: room ? room.id : null, // ✅ Room ID for this friend
          roomCreatedAt: room ? room.createdAt : null,
          lastMessage: latestMessage ? latestMessage.content : null,
          lastMessageAt: latestMessage ? latestMessage.createdAt : null,
          lastMessageRead: latestMessage ? latestMessage.isRead : null,
          unreadCount,
        }
      })
    )

    // console.log("friends with room details:", friendsWithRoomIds)

    return res.status(200).json({
      groups: groups.map(group => ({
        ...group,
        group: true,
      })),
      friendsDetail: friendsWithRoomIds,
      count: friendsWithRoomIds.length,
      success: true,
    })
  } catch (error) {
    // console.error("Error in getFriendList:", error)
    res.status(500).json({
      message: "server error",
      error: error.message,
    })
  }
}

module.exports = {
  sendFriendRequest,
  controlFriendRequestReciver,
  controlFriendRequestSender,
  getAllRequestSender,
  controlFriendRequestSender,
  getAllRequestReciver,
  getFriendList,
}
