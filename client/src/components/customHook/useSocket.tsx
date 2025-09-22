// hooks/useSocket.ts
import {useEffect, useRef, useState} from "react"
import {io, Socket} from "socket.io-client"

export const useSocket = (url: string, options: any = {}) => {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  // Use useRef for options to prevent recreation on every render
  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  useEffect(() => {
    // Only create socket if it doesn't exist
    if (!socketRef.current) {
      socketRef.current = io(url, {
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        ...optionsRef.current,
      })

      // Add connection event listeners
      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current?.id)
        setIsConnected(true)
      })

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected")
        setIsConnected(false)
      })

      socketRef.current.on("connect_error", error => {
        console.error("Socket connection error:", error)
        setIsConnected(false)
      })
    }

    return () => {
      // Only disconnect on component unmount
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setIsConnected(false)
      }
    }
  }, [url])

  return {
    socket: socketRef.current,
    isConnected,
  }
}
