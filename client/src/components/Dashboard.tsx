"use client"
import React, {useEffect, useState} from "react"
import {LuMessageSquareText} from "react-icons/lu"
import {MdOutlineGroups} from "react-icons/md"
import {CiSettings} from "react-icons/ci"
import {
  useAppDispatch,
  useAppSelector,
} from "@/reduxStore/hook/customHookReducer"
import {IoIosNotifications} from "react-icons/io"
import LeftMain from "./LeftMain"
import {
  getAllFriendRequestt,
  getAllRequestt,
  getFriends,
} from "@/reduxStore/slices/FriendSlice"
import Notification from "./Left/Notification"
import {setActiveTab} from "@/reduxStore/slices/DashboardSlice"
import Image from "next/image"

const Dashboard = ({setShow}: any) => {
  const state = useAppSelector(state => state.authReducer.user)
  console.log(state)
  const success = useAppSelector(
    state => state.friendSliceAuth.sendRequestSuccess
  )
  const widrawSuccess = useAppSelector(
    state => state.friendSliceAuth.withdrawRequestSuccess
  )
  const controlSuccess = useAppSelector(
    state => state.friendSliceAuth.controlRequestSuccess
  )
  console.log("sucess", success)
  const Notification = useAppSelector(state => state.friendSliceAuth)
  const Notification2 = useAppSelector(
    state => state.friendSliceAuth.sendRequestCount
  )
  console.log(Notification.requestCount, Notification2)
  // console.log(Notification)
  const dispatch = useAppDispatch()
  const active = useAppSelector(state => state.dashBoardReducer.activeTab)
  // const [optionSelect, setOptionSelect] = useState("chat")
  // console.log(state)

  useEffect(() => {
    // setTimeout(() => {
    dispatch(getAllRequestt())
    dispatch(getAllFriendRequestt())
    dispatch(getFriends())
    // }, 1000)
  }, [success, widrawSuccess, controlSuccess])

  return (
    // className="flex flex-col justify-between items-center gap-4 md:mt-5"
    <div className="flex">
      <div className="text-white h-screen p-2 relative z-10 flex flex-col  bg-black/1 backdrop-blur-xl  border border-white/20 items-center md:pt-5 gap-4">
        <div
          onClick={() => dispatch(setActiveTab("chat"))}
          className={`hover:bg-white/10 hover:scale-110 transition duration-200 p-[0.5rem] rounded-full cursor-pointer ${
            active === "chat" ? `bg-white/20` : ""
          }`}
        >
          <LuMessageSquareText className="h-6 w-6 text-white "></LuMessageSquareText>
        </div>
        <div
          onClick={() => dispatch(setActiveTab("groups"))}
          className={`hover:bg-white/10 hover:scale-110 transition duration-200 p-[0.5rem] rounded-full cursor-pointer ${
            active === "groups" ? `bg-white/20` : ""
          }`}
        >
          <MdOutlineGroups className="h-6 w-6  text-white "></MdOutlineGroups>
        </div>

        <div
          onClick={() => dispatch(setActiveTab("settings"))}
          className={`hover:bg-white/10 hover:scale-110 transition duration-200 p-[0.3rem] rounded-full cursor-pointer ${
            active === "settings" ? `bg-white/20` : ""
          }`}
        >
          <CiSettings className="h-8 w-8  text-white "></CiSettings>
        </div>

        <div
          onClick={() => dispatch(setActiveTab("notification"))}
          className={`hover:bg-white/10 hover:scale-110 transition duration-200 p-[0.5rem] rounded-full cursor-pointer relative ${
            active === "notification" ? `bg-white/20` : ""
          }`}
        >
          <IoIosNotifications className="h-7 w-7  text-white "></IoIosNotifications>
          {Notification.requestCount !== null || Notification2 > 0 ? (
            <p className="bg-[#de3b00]  items-center flex justify-center w-4 h-4 rounded-full absolute top-0 right-2 text-[14px]">
              <>{Notification.requestCount || Notification2}</>
            </p>
          ) : (
            <p className="bg-black"></p>
          )}
        </div>
        <div
          onClick={() => dispatch(setActiveTab("profile"))}
          className="h-12 w-12 bg-black rounded-full items-center justify-center flex font-bold text-white text-lg border-1 border-neutral-400 hover:bg-white/10 hover:scale-105 transition duration-200 "
        >
          {state?.userImage ? (
            <Image
              src={state.userImage}
              className="rounded-full"
              height={100}
              width={100}
              alt="avatar"
            ></Image>
          ) : (
            <p className="border-white">{state?.name.charAt(0)}</p>
          )}
        </div>
      </div>
      <LeftMain setShow={setShow}></LeftMain>
    </div>
  )
}

export default Dashboard
