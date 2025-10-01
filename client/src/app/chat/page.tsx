"use client"
import ChatMain from "@/components/ChatMain"
import Dashboard from "@/components/Dashboard"
import LeftMain from "@/components/LeftMain"
import ProtectedRoute from "@/components/Protected/ProtectedRoute"
import {
  generate_socket_connection,
  socket,
} from "@/components/socket/socketManager"
import {
  useAppDispatch,
  useAppSelector,
} from "@/reduxStore/hook/customHookReducer"
import {
  addUserOnline,
  removeOnlineFriend,
  setOnlineUsersList,
} from "@/reduxStore/slices/OnlineUsers"

import React, {useEffect, useState} from "react"

const page = () => {
  // const [isChatFullSize, setIsChatFullSize] = useState("")
  const [windowWidth, setWindowWidth] = useState(0)
  const [show, setShow] = useState("dashboard")
  const dispatch = useAppDispatch()
  const onlineusers = useAppSelector(state => state.OnlineUserReducer)
  console.log("online users are", onlineusers)
  const user = useAppSelector(state => state.authReducer.user)

  // console.log(windowWidth)
  const activeTheme = useAppSelector(
    state => state.dashBoardReducer.activeTheme
  )
  useEffect(() => {
    setWindowWidth(window.innerWidth)
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])
  useEffect(() => {
    if (user?.id) {
      console.log("from home page.tsx we initiliazed socekt connection ")
      generate_socket_connection(user.id)
    }
  }, [user?.id])
  useEffect(() => {
    if (socket) {
      const handleFriendsOnline = (id: string) => {
        dispatch(addUserOnline(id))
      }
      const handleFriendsOffline = (id: string) => {
        dispatch(removeOnlineFriend(id))
      }
      const handle_Initial_FriendsOnlineList = (onlineFriendsIds: string[]) => {
        console.log(
          "Initial online friends: friends_online_list",
          onlineFriendsIds
        )
        dispatch(setOnlineUsersList(onlineFriendsIds))
      }
      socket.on("friend_offline", handleFriendsOffline)
      socket.on("friend_online", handleFriendsOnline)
      socket.on("friends_online_list", handle_Initial_FriendsOnlineList)
      return () => {
        socket.off("friend_offline", handleFriendsOffline)
        socket.off("friend_online", handleFriendsOnline)
        socket.off("friends_online_list", handle_Initial_FriendsOnlineList)
      }
    }
  }, [user?.id])

  return (
    <ProtectedRoute>
      <div className="flex w-full h-screen relative bg-black ">
        {/* {windowWidth < 928 && renderMobileToggle()} */}
        <div
          className={
            "    absolute inset-0 z-1  bg-center bg-cover bg-no-repeat opacity-40 lg:opacity-100    "
          }
          style={activeTheme ? {backgroundImage: `url(${activeTheme})`} : {}}

          // bg-[url('/test/bg12.jpg')]
          // bg-neutral-900
        ></div>
        <div
          className={`${
            windowWidth < 928
              ? show === "dashboard"
                ? "block w-full"
                : "hidden"
              : "w-[30%]"
          } `}
        >
          <Dashboard setShow={setShow}></Dashboard>
        </div>

        {/* <div className="w-[30%]      bg-black/90"> */}
        {/* <LeftMain></LeftMain> */}
        {/* </div> */}
        <div
          className={`${
            windowWidth < 928
              ? show === "chat"
                ? "block w-full"
                : "hidden"
              : "w-[70%]"
          } `}
        >
          {/* {windowWidth < 1000 && windowWidth > 800 && (
            <button
              onClick={() => handleResize("chatMain")}
              className="absolute top-4 left-40 z-20 bg-white hover:bg-gray-700/80 text-black p-2 rounded-full transition-all duration-200"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )} */}
          <ChatMain setShow={setShow}></ChatMain>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default page
// className={` ${
//   isChatFullSize === "chatMain"
//     ? "w-0 overflow-hidden"
//     : isChatFullSize === "chat"
//     ? "w-full"
//     : "w-[30%]"
// }    bg-black transition-all duration-300`}
// onClick={() => handleResize("chat")}

// className={`${
//   isChatFullSize === "chat"
//     ? "w-0 overflow-hidden"
//     : isChatFullSize === "chatMain"
//     ? "w-full"
//     : "w-[70%]"
// } bg-black transition-all duration-500 ease-in-out`}
// onClick={() => handleResize("chat")}
