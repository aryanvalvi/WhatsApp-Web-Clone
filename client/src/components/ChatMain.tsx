"use client"
import React, {useEffect, useRef, useState} from "react"
import {IoIosArrowDroprightCircle, IoMdSearch} from "react-icons/io"
import {HiOutlineDotsVertical} from "react-icons/hi"
import {RiEmojiStickerLine} from "react-icons/ri"
import {BiPaperclip, BiMicrophone} from "react-icons/bi"
import EmojiPicker from "emoji-picker-react"
import {io} from "socket.io-client"
import {IoChevronBackSharp} from "react-icons/io5"

import emojiRegex from "emoji-regex"
import {
  useAppDispatch,
  useAppSelector,
} from "@/reduxStore/hook/customHookReducer"
import Image from "next/image"
import {
  addMessage,
  loadPriviousChat,
  sendMessageThunk,
} from "@/reduxStore/slices/Message"
import {RxCross1} from "react-icons/rx"
import SkeletonLoader from "./skeleton/ImageSkeleton"
// const socket = io("http://localhost:5001")
let socket: any = null
const ChatMain = ({setShow}: any) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const user = useAppSelector(state => state.authReducer.user)
  console.log("🔥 ChatMain function ran, user:", user)
  const dispatch = useAppDispatch()
  const [typingIndicator, setTypingIndicator] = useState("")
  // console.log(typingIndicator)
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<any>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // console.log(messages)
  const [newMessage, setNewMessage] = useState("")
  const [emoji, setEmoji] = useState<string[]>([]) // keep history if you want
  const [loading, setLoding] = useState(false)
  const state = useAppSelector(state => state.friendSliceAuth.getFriendsData)
  const active = useAppSelector(state => state.dashBoardReducer.activeTab)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const isnull = state?.some(e => e.id === null)
  const chatPerson = useAppSelector(state => state.messageReducer.chat)
  console.log(chatPerson)

  console.log(user)
  //new state
  const [onlineFriends, setOnlineFriends] = useState<string[] | string>([])
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  const [preview, setPreview] = useState<string | null>(null)
  const [image, setImage] = useState(null)
  const [skeletonImage, setSkeletonImage] = useState(false)
  const [currentRoom, setCurrentRoom] = useState(null)
  console.log("PANATPAN", onlineFriends, typingUsers)

  const messages = useAppSelector(state => state.messageReducer.message)
  console.log(messages)

  // console.log(chatPerson)
  const currentUserId = useAppSelector(state => state.authReducer.user)

  console.log(currentUserId?.id)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
  }

  useEffect(() => {
    console.log("🔥 useEffect mounted, user.id:", user?.id)
  }, [user?.id])

  useEffect(() => {
    console.log("Auth state check:", {
      user: user?.id,
      currentUserId: currentUserId?.id,
      isAuthReady,
    })
    if (user?.id && currentUserId?.id) {
      if (!isAuthReady) {
        console.log("Authentication is now ready")
        setIsAuthReady(true)
      }
    } else {
      if (isAuthReady) {
        console.log("Authentication lost")
        setIsAuthReady(false)
      }
    }
  }, [user?.id, currentUserId?.id, isAuthReady])
  // socket connection

  // Replace your current socket initialization useEffect with this:
  useEffect(() => {
    console.log("use effect for previous is called ")
    if (user?.id) {
      console.log("Initializing socket connection for user:", user.id)

      // Disconnect existing socket if any
      if (socket) {
        socket.disconnect()
      }

      socket = io(process.env.NEXT_PUBLIC_Backend_Url, {
        transports: ["websocket"],
        autoConnect: true,
      })

      socket.on("connect", () => {
        console.log("Socket connected, emitting user_online")
        socket.emit("user_online", user.id)

        // Load previous chat if we have the necessary data
        if (chatPerson?.roomId && currentUserId?.id) {
          socket.emit("join_room", chatPerson.roomId)
          setCurrentRoom(chatPerson.roomId)
          dispatch(
            loadPriviousChat({
              roomId: chatPerson.roomId,
              currentId: currentUserId?.id,
            })
          )
        }
      })

      socket.on("disconnect", () => {
        console.log("Socket disconnected")
      })
    }

    return () => {
      if (socket) {
        socket.disconnect()
        socket = null
      }
    }
  }, [currentUserId]) // Only depend on user.id
  // Replace your room management useEffect with this:
  useEffect(() => {
    if (
      !socket ||
      !socket.connected ||
      !chatPerson?.roomId ||
      !currentUserId?.id
    ) {
      return
    }

    const joinRoom = async () => {
      // Leave previous room if exists
      if (currentRoom && currentRoom !== chatPerson.roomId) {
        socket.emit("leave_room", currentRoom)
        console.log("Left room:", currentRoom)
      }

      // Join new room
      socket.emit("join_room", chatPerson.roomId)
      setCurrentRoom(chatPerson.roomId)
      console.log("Joined room:", chatPerson.roomId)

      // Load previous chat messages
      dispatch(
        loadPriviousChat({
          roomId: chatPerson.roomId,
          currentId: currentUserId?.id,
        })
      )
    }

    joinRoom()
  }, [chatPerson?.roomId, currentUserId?.id, socket?.connected, user?.id])
  useEffect(() => {
    const hasAuth = user?.id && currentUserId?.id
    if (hasAuth && !isAuthReady && socket?.connected) {
      setIsAuthReady(true)
    } else if (!hasAuth && isAuthReady) {
      setIsAuthReady(false)
    }
  }, [user?.id, currentUserId?.id, socket?.connected])
  useEffect(() => {
    if (!socket || !isAuthReady) return

    const handleFriendOnline = (friendId: string) => {
      setOnlineFriends(prev => {
        if (!prev.includes(friendId)) {
          return [...prev, friendId]
        }
        return prev
      })
    }

    const handleFriendOnlineList = (friendIds: string) => {
      setOnlineFriends(friendIds)
    }
    const handleTyping = ({
      senderId,
      roomId: typingRoom,
    }: {
      senderId: string
      roomId: string
    }) => {
      if (typingRoom === chatPerson.roomId && !typingUsers.includes(senderId)) {
        setTypingUsers(prev => [...prev, senderId])
      }
    }
    const handleStopTyping = ({
      senderId,
      roomId: typingRoom,
    }: {
      senderId: string
      roomId: string
    }) => {
      if (typingRoom === chatPerson.roomId) {
        setTypingUsers(prev => prev.filter(id => id !== senderId))
      }
    }
    const handleReceiveMessage = (messageData: any) => {
      console.log("receiver message data", messageData)
      if (messageData.roomId === chatPerson.roomId) {
        // Only add message if it's NOT from the current user
        // (to avoid duplicate messages when user sends a message)
        if (messageData.senderId !== currentUserId?.id) {
          const transformData = {
            id: messageData.id,
            text: messageData.content,
            fromMe: false, // Always false for received messages
            time: new Date(messageData.createdAt).toLocaleTimeString(),
            senderName: messageData.senderName,
            userImage: messageData.userImage,
            media: messageData.media,
          }
          dispatch(addMessage(transformData))
        }
      }
    }

    socket.on("friend_online", handleFriendOnline)
    socket.on("friends_online_list", handleFriendOnlineList)
    socket.on("typing", handleTyping)
    socket.on("stop_typing", handleStopTyping)
    socket.on("recieve_message", handleReceiveMessage)

    return () => {
      socket.off("friend_online", handleFriendOnline)
      socket.off("friends_online_list", handleFriendOnlineList)
      socket.off("typing", handleTyping)
      socket.off("stop_typing", handleStopTyping)
      socket.off("recieve_message", handleReceiveMessage)
    }
  }, [chatPerson?.roomId, currentUserId, user?.id, typingUsers])

  useEffect(() => {
    scrollToBottom()
  }, [messages])
  const typing = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewMessage(value)
    if (!socket || !chatPerson?.roomId) return

    if (!isTyping) {
      setIsTyping(true)
      socket.emit("typing", {
        senderId: user?.id,
        roomId: chatPerson.roomId,
      })
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      socket.emit("stop_typing", {
        senderId: user?.id,
        roomId: chatPerson.roomId,
      })
    }, 1500) // Add a slightly longer delay for smoother UX
  }
  const sendMessage = async () => {
    if (!newMessage.trim() && !preview) return console.log("bruhh")

    if (preview) {
      setSkeletonImage(true)
    }
    if (isTyping) {
      setIsTyping(false)
      socket.emit("stop_typing", {
        senderId: user?.id,
        roomId: chatPerson.roomId,
      })
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    const tempMessage = {
      id: Date.now(),
      text: newMessage,
      fromMe: true,
      time: new Date().toLocaleTimeString(),
      SenderName: user?.name,
      userImage: user?.userImage,
      media: preview,
    }
    dispatch(addMessage(tempMessage))
    const messageToSend = newMessage
    const imageToSend = image
    setPreview(null)
    setNewMessage("")
    setImage(null)

    setPreview(null)
    setNewMessage("")
    setImage(null)
    if (preview) {
      setSkeletonImage(true)
    }
    try {
      // Send to server
      await dispatch(
        sendMessageThunk({
          image: imageToSend,
          roomId: chatPerson.roomId,
          content: messageToSend,
        })
      )
    } catch (error) {
      console.error("Failed to send message:", error)
      // Optionally remove the message from local state if sending failed
      // Or show an error indicator
    } finally {
      setSkeletonImage(false)
    }
  }
  const handleSelectEmoji = (emojiObj: any) => {
    setNewMessage(prev => prev + emojiObj.emoji + " ")
    // setEmoji(prev => [...prev, emojiObj.emoji])
  }
  const hasOnlyEmojis = (text: string) => {
    // Remove all whitespace and check if what's left are only emojis
    const cleanText = text.trim()

    if (cleanText.length === 0) return false
    const regex = emojiRegex()
    const textWithoutEmojis = cleanText.replace(regex, "").trim()

    // Check if there are emojis in the original text
    const hasEmojis = regex.test(cleanText)

    // Return true only if there are emojis AND nothing else remains
    const result = hasEmojis && textWithoutEmojis.length === 0

    return result
  }
  const handleImage = (e: any) => {
    const file = e.target.files?.[0]
    console.log(file)
    setPreview(URL.createObjectURL(file))
    setImage(file)
  }

  // const lund = () => {
  //   console.log("lund called")

  //   if (currentUserId && chatPerson.roomId) {
  //     dispatch(loadPriviousChat({roomId: chatPerson.roomId, currentUserId}))
  //   }
  // }
  // useEffect(() => {
  //   console.log("lund called")
  //   lund()
  // }, [currentUserId, chatPerson])
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
    <div className="flex flex-col h-screen backdrop-blur-xl  bg-black/1 z-10 relative">
      {/* <button className="text-white" onClick={lund}>
        LUND
      </button> */}
      {/* hidden xl:block absolute top-1/2 right-8 transform -translate-y-1/2 */}
      {/* Glass overlay */}
      {/* <div className="absolute inset-0 backdrop-blur-sm"></div> */}
      {active === "groups" && (
        <div className="flex items-center justify-center flex-col h-full z-2">
          <Image
            src="/images/group.svg"
            width={600}
            height={600}
            alt="avatar"
            className="  w-55 h-55 object-contain"
          ></Image>
          <h1 className="text-neutral-400 text-2xl">Group</h1>
        </div>
      )}
      {active === "settings" && (
        <div className="flex items-center justify-center flex-col h-full z-2">
          <Image
            src="/images/setings.svg"
            width={600}
            height={600}
            alt="avatar"
            className="  w-55 h-55 object-contain"
          ></Image>
          <h1 className="text-neutral-400 text-2xl">Settings</h1>
        </div>
      )}
      {active === "notification" && (
        <div className="flex items-center justify-center flex-col h-full z-2">
          <Image
            src="/images/notification.svg"
            width={600}
            height={600}
            alt="avatar"
            className="  w-45 h-45 object-contain"
          ></Image>
          <h1 className="text-neutral-400 text-2xl">Notifications</h1>
        </div>
      )}
      {active === "profile" && (
        <div className="flex items-center justify-center flex-col h-full z-2">
          <Image
            src="/images/profile.svg"
            width={600}
            height={600}
            alt="avatar"
            className="  w-45 h-45 object-contain"
          ></Image>
          <h1 className="text-neutral-400 text-2xl">Profile</h1>
        </div>
      )}
      {active === "chat" && (
        <>
          {chatPerson.id === null ? (
            <div className="flex items-center justify-center flex-col h-full z-2">
              <Image
                src="/images/Chating.svg"
                width={600}
                height={600}
                alt="avatar"
                className="  w-55 h-55 object-contain"
              ></Image>
              <h1 className="text-neutral-400 text-2xl">Chats</h1>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col h-full w-full  backdrop-blur-xl  border border-white/20 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-black/10 backdrop-blur-md text-white border-b border-white/10 ">
                <div className="flex justify-between items-center p-5">
                  <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center">
                      {windowWidth < 928 && (
                        <IoChevronBackSharp
                          onClick={() => setShow("dashboard")}
                          className="h-8 w-8 mr-8"
                        />
                      )}
                      {chatPerson.groupImage !== null &&
                      chatPerson.group === true ? (
                        <div className="relative flex items-center justify-center">
                          <Image
                            src={
                              chatPerson.groupImage.img1 || "/images/user.svg"
                            }
                            height={100}
                            width={100}
                            alt="group avatar"
                            className="h-12 w-12 rounded-full z-1 border-2 border-white"
                          ></Image>
                          <Image
                            src={
                              chatPerson.groupImage.img2 || "/images/user.svg"
                            }
                            height={100}
                            width={100}
                            alt="group avatar"
                            className="h-12 w-12 rounded-full absolute mr-5 mb-5 border-2 border-white"
                          ></Image>
                        </div>
                      ) : (
                        <img
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-white/20"
                          src={chatPerson.userImage || "/images/user.svg"}
                          alt={chatPerson.userImage || "avatar"}
                        />
                      )}

                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black"></div>
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">
                        {chatPerson.name}
                      </h2>
                      <p className="text-sm">
                        {typingUsers.includes(chatPerson.id)
                          ? `${chatPerson.name} is typing...`
                          : "Online now"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/10">
                      <IoMdSearch className="text-xl" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/10">
                      <HiOutlineDotsVertical className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>

              {preview ? (
                <div className="flex h-full w-full  items-center justify-center relative  p-0 flex-col">
                  <div className="flex-shrink-0 w-full pt-2 pb-2 bg-white/10 text-neutral-200 top-0 border-transparent ">
                    <p className=" text-2xl font-bold flex items-center justify-center">
                      preview
                    </p>
                    <RxCross1
                      onClick={() => setPreview(null)}
                      className="p-2 h-10 w-10 absolute top-1 font-extrabold text-3xl left-3 hover:bg-white/10 rounded-xl cursor-pointer transition-all duration-300 "
                    />
                  </div>
                  <div className="flex-1 flex items-center justify-center overflow-hidden">
                    <Image
                      src={preview}
                      height={400}
                      width={400}
                      className="max-w-full max-h-full object-contain"
                      style={{
                        maxHeight: "70vh", // Ensure it doesn't exceed viewport minus header/footer space
                        maxWidth: "calc(100vw - 40px)",
                        width: "auto",
                        height: "auto",
                      }}
                      alt="preview"
                    ></Image>
                  </div>

                  <div className="w-full  flex-shrink-0  bg-black/20    backdrop-blur-xl  border border-white/20 shadow-2xl overflow-hidden  ">
                    <div className="p-5">
                      <div className="flex items-end gap-3">
                        {/* Left buttons */}
                        <div className="flex gap-2 items-center justify-center">
                          {/* <button className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-white border border-white/10"> */}

                          <label
                            htmlFor="image"
                            className=" p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-white border border-white/10"
                          >
                            <BiPaperclip className="text-xl text-white " />

                            <input
                              onChange={handleImage}
                              id="image"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              name=""
                            />
                          </label>

                          {/* </button> */}

                          <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-white border border-white/10"
                          >
                            <RiEmojiStickerLine className="text-xl text-white" />
                          </button>
                        </div>

                        {/* Message Input */}
                        <div className="flex-1 relative ">
                          <input
                            type="text"
                            placeholder="Type your message..."
                            className="w-full rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all duration-300 pr-14"
                            value={newMessage}
                            onChange={typing}
                            onKeyDown={e => {
                              if (e.key === "Enter") sendMessage()
                            }}
                          />

                          {/* Send/Mic Button */}

                          <button
                            onClick={sendMessage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white hover:bg-white/90 transition-all duration-300 text-black"
                          >
                            <IoIosArrowDroprightCircle className="text-2xl" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b relative ">
                    {messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.fromMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!msg.fromMe && (
                          <Image
                            src={msg.userImage}
                            height={100}
                            width={100}
                            alt="avatar"
                            className="h-7 w-7 rounded-full"
                          ></Image>
                        )}
                        {}
                        <div
                          className={`group max-w-[75%] ${
                            msg.fromMe ? "flex flex-col items-end" : ""
                          }`}
                        >
                          <div
                            className={`transition-all duration-300 ${
                              msg.media
                                ? "bg-transparent border-none"
                                : hasOnlyEmojis(msg.text)
                                ? "bg-transparent border-none "
                                : `py-1 px-[1rem] rounded-2xl backdrop-blur-md border ${
                                    msg.fromMe
                                      ? "bg-gradient-to-r from-red-500 to-[#FF8001] text-white border-black/20  "
                                      : "bg-gradient-to-r from-neutral-800 to-neutral-900 text-white border-none "
                                  }`
                            }`}
                          >
                            {msg.text.trim() === "" && msg.media ? (
                              <p className="bg-none">
                                {/* <SkeletonLoader></SkeletonLoader> */}
                                <Image
                                  src={msg.media}
                                  height={300}
                                  width={300}
                                  alt="media"
                                ></Image>
                                {/* <p
                                  className={`leading-relaxed  ${
                                    hasOnlyEmojis(msg.text)
                                      ? "text-5xl -mb-3 "
                                      : "text-sm "
                                  }`}
                                >
                                  {msg.text}
                                </p> */}
                              </p>
                            ) : msg.text.trim() !== "" && msg.media ? (
                              <>
                                <Image
                                  src={msg.media}
                                  height={300}
                                  width={300}
                                  alt="media"
                                ></Image>
                                <p
                                  className={`leading-relaxed text-white bg-gradient-to-r from-neutral-800 to-neutral-900  border-none  py-1 px-[1rem]   ${
                                    hasOnlyEmojis(msg.text)
                                      ? "text-5xl -mb-3 "
                                      : "text-sm "
                                  }`}
                                >
                                  {msg.text}
                                </p>
                              </>
                            ) : (
                              <p
                                className={`leading-relaxed ${
                                  hasOnlyEmojis(msg.text)
                                    ? "text-5xl -mb-3 "
                                    : "text-sm  "
                                }`}
                              >
                                {msg.text}
                              </p>
                            )}
                          </div>

                          <span className=" text-xs mt-1 px-2 opacity-40 text-white  ">
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    ))}
                    {/* <div className="absolute right-5">
                      <SkeletonLoader></SkeletonLoader>
                    </div> */}
                    <div ref={messagesEndRef}></div>
                    <div className="text-lg text-white">{typingIndicator}</div>
                  </div>

                  {/* Input Area */}
                  <div className="w-full bg-black/20 backdrop-blur-xl  border border-white/20 shadow-2xl overflow-hidden ">
                    <div className="p-5">
                      <div className="flex items-end gap-3">
                        {/* Left buttons */}
                        <div className="flex gap-2 items-center justify-center">
                          {/* <button className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-white border border-white/10"> */}

                          <label
                            htmlFor="image"
                            className=" p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-white border border-white/10"
                          >
                            <BiPaperclip className="text-xl text-white " />

                            <input
                              onChange={handleImage}
                              id="image"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              name=""
                            />
                          </label>

                          {/* </button> */}

                          <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-white border border-white/10"
                          >
                            <RiEmojiStickerLine className="text-xl text-white" />
                          </button>
                        </div>

                        {/* Message Input */}
                        <div className="flex-1 relative ">
                          <input
                            type="text"
                            placeholder="Type your message..."
                            className="w-full rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all duration-300 pr-14"
                            value={newMessage}
                            onChange={typing}
                            onKeyDown={e => {
                              if (e.key === "Enter") sendMessage()
                            }}
                          />

                          {/* Send/Mic Button */}

                          <button
                            onClick={sendMessage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white hover:bg-white/90 transition-all duration-300 text-black"
                          >
                            <IoIosArrowDroprightCircle className="text-2xl" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-24 left-5 z-50">
                      <EmojiPicker onEmojiClick={handleSelectEmoji} />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ChatMain
