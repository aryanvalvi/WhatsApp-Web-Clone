"use client"
import {
  useAppDispatch,
  useAppSelector,
} from "@/reduxStore/hook/customHookReducer"
import {setActiveTab} from "@/reduxStore/slices/DashboardSlice"
import {addPerson, getCounts} from "@/reduxStore/slices/Message"
import Image from "next/image"

import React, {useEffect, useState} from "react"
import {HiOutlineDotsVertical} from "react-icons/hi"
import {IoMdSearch} from "react-icons/io"
import {MdOutlinePersonAddAlt} from "react-icons/md"
import {io} from "socket.io-client"
import SearchResult from "./HelperFunctions/SearchResult"
const socket = io(process.env.NEXT_PUBLIC_Backend_Url)
const Chats = ({setShow}: any) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [onClickSearch, setOnClickSearch] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  console.log(onlineUsers)
  const {unReadMessage} = useAppSelector(state => state.messageReducer)
  const {getFriendsData, getGroups} = useAppSelector(
    getFriendsData => getFriendsData.friendSliceAuth
  )
  const allChat = [...(getFriendsData || []), ...(getGroups || [])]
  console.log(getFriendsData)
  const sortedChats = allChat.sort((a, b) => {
    const aHasUnread = a.unreadCount > 0
    const bHasUnread = b.unreadCount > 0

    // unread chats go above read chats
    if (aHasUnread && !bHasUnread) return -1
    if (!aHasUnread && bHasUnread) return 1

    // if both same (both unread or both read) → sort by lastMessageAt
    return (
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    )
  })
  console.log(sortedChats)
  const isnull =
    getFriendsData.some((e: any) => e.id == null) || getFriendsData.length === 0
  const dispatch = useAppDispatch()
  const user = useAppSelector(user => user.authReducer.user)
  // console.log(user)
  const handleAddPerson = (
    id: string,
    name: string,
    email: string,
    roomId: string,
    userImage: string,
    groupImage: {},
    group: boolean,
    groupRoomId: string
  ) => {
    if (group == true) {
      dispatch(
        addPerson({id, name, email, roomId: groupRoomId, groupImage, group})
      )
    } else {
      dispatch(
        addPerson({
          id,
          name,
          email,
          roomId,
          userImage,
          group: false,
        })
      )
      if (windowWidth < 928) {
        setShow("chat")
      }
    }

    console.log(id, name, email, group)
  }

  function formatTime(isoString: string) {
    const date = new Date(isoString)

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true, // shows AM/PM
    })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOnClickSearch(true)
    const value = e.target.value
    setSearchValue(value)
    if (value.trim() === "") {
      setOnClickSearch(false)
    }
  }
  useEffect(() => {
    dispatch(getCounts())
  }, [user, dispatch])
  useEffect(() => {
    if (!user?.id) return
    socket.emit("user_online", user.id)
    const handleFriendsOnline = (id: string) => {
      console.log(id + "is online")
      setOnlineUsers(prev => {
        if (prev.includes(id)) return prev
        return [...prev, id]
      })
    }
    const handleFriendsOffline = (id: string) => {
      console.log(id + "is offline")
      setOnlineUsers(prev => prev.filter(userid => userid !== id))
    }
    // Handle initial list of online friends
    const handleFriendsOnlineList = (onlineFriendsIds: string[]) => {
      console.log("Initial online friends:", onlineFriendsIds)
      setOnlineUsers(onlineFriendsIds)
    }

    socket.on("friend_online", handleFriendsOnline)
    socket.on("friend_offline", handleFriendsOffline)
    socket.on("friends_online_list", handleFriendsOnlineList)
    return () => {
      socket.off("friend_online", handleFriendsOnline)
      socket.off("friend_offline", handleFriendsOffline)
      socket.off("friends_online_list", handleFriendsOnlineList)
    }
  }, [user?.id])
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="relative z-10 p-5">
      {/* Header */}
      {/* <button onClick={() => dispatch(getFriends())}>Hello</button> */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-wide ">Convexle</h1>
          <div className="w-12 h-0.5 bg-[#FF8001] mt-1"></div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(setActiveTab("addperson"))}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10"
          >
            <MdOutlinePersonAddAlt className="text-xl" />
          </button>
          <button className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10">
            <HiOutlineDotsVertical className="text-xl" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          onChange={handleSearch}
          placeholder="Search conversations..."
          className="text-base w-full rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all duration-300 placeholder-white/60"
          type="text"
        />
        <IoMdSearch className="absolute top-4 left-4 text-xl text-white/60" />
      </div>

      {/* Chat List */}

      {onClickSearch ? (
        <SearchResult
          value={searchValue}
          friends={sortedChats}
          onlineUsers={onlineUsers}
          unReadMessage={unReadMessage}
          handleAddPerson={handleAddPerson}
          formatTime={formatTime}
        ></SearchResult>
      ) : isnull === true ? (
        <div className="flex items-center justify-center relative h-full">
          <div className="flex flex-col items-center justify-center">
            {/* <Image
              src="group.svg"
              width={300}
              height={300}
              alt="avatar"
              className="  w-75 h-75 object-contain"
            ></Image> */}
            <h1 className="text-neutral-400  ">Please add member to chat</h1>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
            Messages
          </h3>

          <div className="space-y-1 max-h-[calc(100vh-240px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {sortedChats.map((person: any) => {
              let img1: any, img2: any
              if (person.group) {
                ;[img1, img2] = person.participants
                  .map((p: any) => p.user?.userImage)
                  .splice(0, 2)
              }
              const isOnline = onlineUsers.includes(person.id)
              const isUnread = unReadMessage?.find(
                (e: any) => e.roomid === person.roomId
              )
              // console.log(isUnread)
              return (
                <div
                  key={person.id}
                  className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/10 cursor-pointer transition-all duration-300 border border-transparent hover:border-white/10"
                  onClick={() =>
                    handleAddPerson(
                      person.id,
                      person.name,
                      person.email,
                      person.roomId,
                      person.userImage,
                      {img1, img2},
                      person.group,
                      person.id
                    )
                  }
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {person.group === true ? (
                      <div className="relative flex items-center justify-center">
                        <Image
                          src={img1}
                          height={100}
                          width={100}
                          alt="group avatar"
                          className="h-12 w-12 rounded-full z-1 border-2 border-white"
                        ></Image>
                        <Image
                          src={img2}
                          height={100}
                          width={100}
                          alt="group avatar"
                          className="h-12 w-12 rounded-full absolute mr-5 mb-5 border-2 border-white"
                        ></Image>
                      </div>
                    ) : (
                      <Image
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20 border-2 border-white"
                        src={person.userImage || "/images/user.svg"}
                        width={100}
                        height={100}
                        alt={person.name}
                      />
                    )}
                    {isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-black "></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 relative">
                    <div className="flex justify-between items-start mb-1">
                      <span className="w-full">
                        <section className="flex justify-between w-full  items-center">
                          <h4 className="font-semibold text-white truncate group-hover:text-white/90">
                            {person.name}
                          </h4>
                          <span className="text-white text-sm">
                            {formatTime(person.lastMessageAt)}
                          </span>
                        </section>
                        {isUnread ? (
                          <section className="flex justify-between w-full  items-center">
                            <h4 className="text-xs text-neutral-300 mt-1">
                              {isUnread?.latestUnreadMessage?.content}
                            </h4>

                            <span className="text-white rounded-full h-5 w-5 bg-[#FF8001] font-bold text-sm  -right-2 top-2 flex items-center justify-center">
                              {unReadMessage.length}
                            </span>
                          </section>
                        ) : (
                          <h4 className="text-xs text-neutral-300 mt-1">
                            {person.lastMessage}
                          </h4>
                        )}
                        {/* <h4 className="text-xs text-neutral-300 mt-1">
                          {person.email}
                        </h4> */}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-white/60 group-hover:text-white/70">
                          {person.time}
                        </span>
                        {person.unread > 0 && (
                          <div className="bg-white text-black text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                            {person.unread}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-white/70 truncate group-hover:text-white/80">
                      {person.message}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Chats
