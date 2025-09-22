"use client"
import {useAppSelector} from "@/reduxStore/hook/customHookReducer"
import React from "react"
import {HiOutlineDotsVertical} from "react-icons/hi"
import {IoMdSearch} from "react-icons/io"
import {MdOutlinePersonAddAlt} from "react-icons/md"
import Chats from "./Left/Chats"
import AddPerson from "./Left/AddPerson"
import Notification from "./Left/Notification"

import Settings from "./Left/Settings"
import Profile from "./Left/Profile"
import Communities from "./Left/Group/Communities"

const LeftMain = ({setShow}: any) => {
  // const people = useAppSelector(state => state.messageReducer.people)
  const state = useAppSelector(state => state.authReducer)
  const friends = useAppSelector(state => state.friendSliceAuth.getFriendsData)
  // const isnull = friends?.some(e => e.id === null)
  const active = useAppSelector(state => state.dashBoardReducer.activeTab)
  // console.log(state)
  // console.log(isnull)
  // if (isnull) {
  //   // console.log(true)
  // } else {
  //   // console.log(false)
  // }
  // peopleData.ts
  // const people = [
  //   {
  //     id: 1,
  //     name: "Aryan Valvi",
  //     message: "Hey! How are you?",
  //     time: "10:45 AM",
  //     img: "https://i.pravatar.cc/150?img=1",
  //     online: true,
  //     unread: 2,
  //   },
  //   {
  //     id: 2,
  //     name: "John Smith",
  //     message: "Let's meet tomorrow!",
  //     time: "9:30 AM",
  //     img: "https://i.pravatar.cc/150?img=2",
  //     online: false,
  //     unread: 0,
  //   },
  //   {
  //     id: 3,
  //     name: "Emma Johnson",
  //     message: "Okay, see you soon.",
  //     time: "Yesterday",
  //     img: "https://i.pravatar.cc/150?img=3",
  //     online: true,
  //     unread: 1,
  //   },
  //   {
  //     id: 4,
  //     name: "Michael Brown",
  //     message: "What's the update?",
  //     time: "Monday",
  //     img: "https://i.pravatar.cc/150?img=4",
  //     online: false,
  //     unread: 0,
  //   },
  //   {
  //     id: 5,
  //     name: "Sophia Davis",
  //     message: "I'm on my way!",
  //     time: "Sunday",
  //     img: "https://i.pravatar.cc/150?img=5",
  //     online: true,
  //     unread: 0,
  //   },
  //   {
  //     id: 6,
  //     name: "Daniel Wilson",
  //     message: "Thanks a lot!",
  //     time: "Saturday",
  //     img: "https://i.pravatar.cc/150?img=6",
  //     online: false,
  //     unread: 3,
  //   },
  //   {
  //     id: 7,
  //     name: "Olivia Martinez",
  //     message: "Let's catch up soon.",
  //     time: "Friday",
  //     img: "https://i.pravatar.cc/150?img=7",
  //     online: true,
  //     unread: 0,
  //   },
  //   {
  //     id: 8,
  //     name: "James Taylor",
  //     message: "Sure, no problem.",
  //     time: "Thursday",
  //     img: "https://i.pravatar.cc/150?img=8",
  //     online: false,
  //     unread: 0,
  //   },
  //   {
  //     id: 9,
  //     name: "Isabella Anderson",
  //     message: "Call me when free.",
  //     time: "Wednesday",
  //     img: "https://i.pravatar.cc/150?img=9",
  //     online: true,
  //     unread: 0,
  //   },
  //   {
  //     id: 10,
  //     name: "William Thomas",
  //     message: "Got it, thanks!",
  //     time: "Tuesday",
  //     img: "https://i.pravatar.cc/150?img=10",
  //     online: false,
  //     unread: 0,
  //   },
  // ]

  return (
    <>
      <div className="text-white relative z-10 flex flex-col  w-full  backdrop-blur-xl  border border-white/20 shadow-2xl overflow-hidden">
        {/* className=" text-white h-[100vh] border-r relative  bg-black/40 backdrop-blur-xl  border border-white/20 shadow-2xl overflow-hidden" */}

        {/* Glass overlay */}
        {/* <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div> */}
        {active === "chat" && <Chats setShow={setShow}></Chats>}
        {active === "addperson" && <AddPerson></AddPerson>}
        {active === "notification" && <Notification></Notification>}
        {active === "groups" && <Communities></Communities>}
        {active === "settings" && <Settings></Settings>}
        {active === "profile" && <Profile></Profile>}

        {/* <AddPerson></AddPerson> */}
        {/* <AddPerson /> */}

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>
    </>
  )
}

export default LeftMain
