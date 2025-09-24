// utils/socket.js or lib/socket.js
import {io} from "socket.io-client"

// Create a single socket instance that can be shared across components
export const socket = io(process.env.NEXT_PUBLIC_Backend_Url, {
  autoConnect: false,
})

// console.log("🔥 ChatMain function ran, user:", user)

// console.log(typingIndicator)

// console.log(messages)

// console.log(chatPerson)

// console.log(user)
//new state

// console.log("PANATPAN", onlineFriends, typingUsers)

// console.log(messages)

// console.log(chatPerson)

// console.log(currentUserId?.id)

// useEffect(() => {
//   console.log("🔥 useEffect mounted, user.id:", user?.id)
// }, [user?.id])


  // useEffect(() => {
  //   console.log("use effect for previous is called ")
  //   if (user?.id) {
  //     console.log("Initializing socket connection for user:", user.id)

  //     // Disconnect existing socket if any
  //     if (socket) {
  //       socket.disconnect()
  //     }

  //     socket = io(process.env.NEXT_PUBLIC_Backend_Url, {
  //       transports: ["websocket"],
  //       autoConnect: true,
  //     })

  //     socket.on("connect", () => {
  //       console.log("Socket connected, emitting user_online")
  //       socket.emit("user_online", user.id)

  //       // Load previous chat if we have the necessary data
  //       if (chatPerson?.roomId && currentUserId?.id) {
  //         socket.emit("join_room", chatPerson.roomId)
  //         setCurrentRoom(chatPerson.roomId)
  //         dispatch(
  //           loadPriviousChat({
  //             roomId: chatPerson.roomId,
  //             currentId: currentUserId?.id,
  //           })
  //         )
  //       }
  //     })

  //     socket.on("disconnect", () => {
  //       console.log("Socket disconnected")
  //     })
  //   }

  //   return () => {
  //     if (socket) {
  //       socket.disconnect()
  //       socket = null
  //     }
  //   }
  // }, [currentUserId])
  // Only depend on user.id
  // Replace your room management useEffect with this:
  // useEffect(() => {
  //   if (
  //     !socket ||
  //     !socket.connected ||
  //     !chatPerson?.roomId ||
  //     !currentUserId?.id
  //   ) {
  //     return
  //   }

  //   const joinRoom = async () => {
  //     // Leave previous room if exists
  //     if (currentRoom && currentRoom !== chatPerson.roomId) {
  //       socket.emit("leave_room", currentRoom)
  //       console.log("Left room:", currentRoom)
  //     }

  //     // Join new room
  //     socket.emit("join_room", chatPerson.roomId)
  //     setCurrentRoom(chatPerson.roomId)
  //     console.log("Joined room:", chatPerson.roomId)

  //     // Load previous chat messages
  //     dispatch(
  //       loadPriviousChat({
  //         roomId: chatPerson.roomId,
  //         currentId: currentUserId?.id,
  //       })
  //     )
  //   }

  //   joinRoom()
  // }, [chatPerson?.roomId, currentUserId?.id, socket?.connected, user?.id])