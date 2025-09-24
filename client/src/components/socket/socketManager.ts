import {useAppDispatch} from "@/reduxStore/hook/customHookReducer"
import {loadPriviousChat} from "@/reduxStore/slices/Message"
import {io} from "socket.io-client"
export let socket: any = null

export const generate_socket_connection = userid => {
  if (!userid) return

  if (socket) {
    socket.disconnect()
  }

  socket = io(process.env.NEXT_PUBLIC_Backend_Url, {
    transports: ["websocket"],
    autoConnect: true,
  })

  socket.on("connect", () => {
    socket.emit("user_online", userid)
  })

  socket.on("disconnect", () => {
    console.log("socket disconnect")
  })

  return socket
}
export const join_rooom = roomid => {
  if (roomid) {
    socket.emit("join_room", roomid)
  }
}
export const leave_rooom = roomid => {
  if (roomid) {
    socket.emit("leave_room", roomid)
  }
}

export const generate_previous_chat = (dispatch, roomid, userid) => {
  if (roomid && userid) {
    dispatch(
      loadPriviousChat({
        roomId: roomid,
        currentId: userid,
      })
    )
  }
}
