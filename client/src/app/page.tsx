"use client"
import Home from "@/components/Home"
import React, {useEffect, useState} from "react"
import {io} from "socket.io-client"
const socket = io("http://localhost:5001")
const page = () => {
  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [currentMessage, setCurrentMessage] = useState("")

  // console.log(room)
  {
    /* Convexle */
  }
  const joinRoom = () => {
    socket.emit("join_room", room)
  }
  const sendMessage = () => {
    const messageData = {
      author: username,
      room,
      message: currentMessage,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    }
    socket.emit("send_message", messageData)
  }

  useEffect(() => {
    socket.on("recieve_message", data => {
      console.log(data)
    })
  }, [socket])

  return (
    <main className="flex w-full h-screen">
      <Home></Home>
      {/* <div>
        <input
          type="text"
          placeholder="aryann..."
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Join room"
          onChange={e => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
        <input
          type="text"
          placeholder="type message"
          onChange={e => setCurrentMessage(e.target.value)}
        />

        <button onClick={sendMessage}>Send Message</button>
      </div> */}
    </main>
  )
}

export default page
