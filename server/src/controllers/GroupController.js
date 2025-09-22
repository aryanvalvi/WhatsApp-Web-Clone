const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

const createGroup = async (req, res) => {
  const user = req.user
  const creatorId = user.id
  const {groupName, groupDescription, members} = req.body
  console.log(groupName, groupDescription, members)

  try {
    const exsitingRoom = await prisma.room.findMany({
      where: {
        name: groupName,
      },
      include: {
        participants: true,
      },
    })
    const duplicateRoom = exsitingRoom.find(room => {
      const participantsId = room.participants.map(p => p.userId).sort()
      const newMembers = [...members, creatorId].sort()
      return (
        participantsId.length === newMembers.length &&
        participantsId.every((id, idx) => id === newMembers[idx])
      )
    })

    if (duplicateRoom) {
      return res.status(401).json({
        message:
          "User cant create multiple group with same name and same members",
      })
    }

    const newRoom = await prisma.room.create({
      data: {
        name: groupName,
        Des: groupDescription,
        participants: {
          create: [
            {
              userId: creatorId,
              role: "ADMIN",
            },
            ...members.map(id => ({userId: id, role: "MEMBER"})),
          ],
        },
      },
      include: {
        participants: true,
      },
    })
    return res.status(200).json({message: "Room is created", newRoom})
  } catch (error) {
    res.status(500).json({message: "Internal server error"})
  }
}
module.exports = {createGroup}
