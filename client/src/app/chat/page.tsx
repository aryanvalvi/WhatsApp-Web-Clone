"use client"
import ChatMain from "@/components/ChatMain"
import Dashboard from "@/components/Dashboard"
import LeftMain from "@/components/LeftMain"
import ProtectedRoute from "@/components/Protected/ProtectedRoute"
import {useAppSelector} from "@/reduxStore/hook/customHookReducer"
import React, {useEffect, useState} from "react"

const page = () => {
  // const [isChatFullSize, setIsChatFullSize] = useState("")
  const [windowWidth, setWindowWidth] = useState(0)
  const [show, setShow] = useState("dashboard")
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
  const renderMobileToggle = () => (
    <div className="fixed top-4 left-4 z-50 flex gap-2">
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded"
        onClick={() => setShow("dashboard")}
      >
        Dashboard
      </button>
      <button
        className="px-3 py-1 bg-green-500 text-white rounded"
        onClick={() => setShow("chat")}
      >
        Chat
      </button>
    </div>
  )
  // useEffect(() => {
  //   setWindowWidth(window.innerWidth)
  // }, [])

  // console.log(activeTheme)
  // console.log("hellooooo")
  // const handleResize = e => {
  //   if (windowWidth < 1000 && windowWidth > 800) {
  //     if (e === "chat") {
  //       setIsChatFullSize(prev => (prev === "chat" ? "" : "chat"))
  //     } else if (e === "chatMain") {
  //       setIsChatFullSize(prev => (prev === "chatMain" ? "" : "chatMain"))
  //     }
  //   }
  // }

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
