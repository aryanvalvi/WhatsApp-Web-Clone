"use client"
import React, {useEffect, useState} from "react"
import {CiBellOn} from "react-icons/ci"
import {IoMdCheckmark} from "react-icons/io"
import {RxCross1} from "react-icons/rx"
import {LuUserPlus} from "react-icons/lu"
import {FiUserMinus} from "react-icons/fi"
import {GoClock} from "react-icons/go"
import {
  useAppDispatch,
  useAppSelector,
} from "@/reduxStore/hook/customHookReducer"
import {formatDistanceToNow} from "date-fns"
import {
  controlRequest,
  getAllFriendRequestt,
  getAllRequestt,
  getFriends,
  removeSentRequest,
  requestDecisionFromUser,
  widrawSentRequest,
} from "@/reduxStore/slices/FriendSlice"
import Image from "next/image"
import {generate_socket_connection, socket} from "../socket/socketManager"

const Notification = () => {
  const {decison, decisonFlag} = useAppSelector(state => state.friendSliceAuth)
  const state = useAppSelector(state => state.friendSliceAuth.requests)
  const state2 = useAppSelector(state => state.friendSliceAuth.sendRequest)
  const user = useAppSelector(state => state.authReducer.user)
  const [socketReady, setSocketReady] = useState(false)
  const [isUserDecied, setIsUserDecide] = useState(null)
  const {
    requestCount,
    sendRequestCount,
    withdrawRequestSuccess,
    controlRequestSuccess,
  } = useAppSelector(state => state.friendSliceAuth)

  const stateIsThere = state[0]?.sender?.id || null
  const stateIsThere2 = state2[0]?.receiver?.id || null

  const dispatch = useAppDispatch()
  console.log(stateIsThere)
  console.log(state)
  console.log(state2)
  console.log(state.length)
  // Sample data for incoming connection requests
  // const [incomingRequests, setIncomingRequests] = useState([
  //   {
  //     id: 1,
  //     name: "Sarah Johnson",
  //     avatar:
  //       "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
  //     mutualConnections: 12,
  //     timestamp: "2 hours ago",
  //     company: "Tech Solutions Inc.",
  //   },
  //   {
  //     id: 2,
  //     name: "Mike Chen",
  //     avatar:
  //       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
  //     mutualConnections: 8,
  //     timestamp: "5 hours ago",
  //     company: "Digital Marketing Pro",
  //   },
  //   {
  //     id: 3,
  //     name: "Emily Davis",
  //     avatar:
  //       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
  //     mutualConnections: 15,
  //     timestamp: "1 day ago",
  //     company: "Creative Agency",
  //   },
  // ])

  // Sample data for outgoing connection requests (pending)

  const [activeTab, setActiveTab] = useState("incoming")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // first render guard
    // if (user?.id) {
    //   generate_socket_connection(user.id)
    // }
    const checkConnection = setInterval(() => {
      if (socket && socket.connected) {
        setSocketReady(true)
        clearInterval(checkConnection)
      }
    }, 100)
    return () => clearInterval(checkConnection)
  }, [user?.id])
  useEffect(() => {
    if (!socketReady || !socket) return
    const handleDecisionMade = (data: any) => {
      console.log("new friend req", data)
      setIsUserDecide(data)
      if (data) {
        dispatch(removeSentRequest(data.requestId))
      }
      if (data.Decision === "ACCEPTED") {
        console.log(
          `${data.decidedByName || "User"} accepted your friend request!`
        )
      } else {
        console.log(
          `${data.decidedByName || "User"} declined your friend request.`
        )
      }
      dispatch(getFriends())
      dispatch(getAllFriendRequestt())
      dispatch(getAllRequestt())
    }
    socket.on("friend_request_decided", handleDecisionMade)
    return () => {
      socket.off("friend_request_decided", handleDecisionMade)
    }
  }, [socketReady, dispatch])
  // Handle accepting incoming requests
  const handleAcceptRequest = (requestId: string | any) => {
    dispatch(controlRequest({manipulateId: requestId, Decision: "ACCEPTED"}))
    dispatch(requestDecisionFromUser({Decision: "accepted"}))

    // setIncomingRequests(prev => prev.filter(req => req.id !== requestId))
    // You would typically make an API call here
    console.log(`Accepted connection request from ID: ${requestId}`)
  }

  // Handle declining incoming requests
  const handleDeclineRequest = (requestId: string | any) => {
    dispatch(controlRequest({manipulateId: requestId, Decision: "REJECTED"}))
    dispatch(requestDecisionFromUser({Decision: "rejected"}))
    // setIncomingRequests(prev => prev.filter(req => req.id !== requestId))
    // You would typically make an API call here
    console.log(`Declined connection request from ID: ${requestId}`)
  }

  // Handle withdrawing outgoing requests
  const handleWithdrawRequest = (requestId: string | any) => {
    dispatch(widrawSentRequest(requestId))
    // setOutgoingRequests(prev => prev.filter(req => req.id !== requestId))
    // You would typically make an API call here
    console.log(`Withdrew connection request to ID: ${requestId}`)
  }

  // const totalNotifications = incomingRequests.length + outgoingRequests.length
  useEffect(() => {
    console.log("Success states changed:", {
      controlRequestSuccess,
      withdrawRequestSuccess,
    })
  })
  useEffect(() => {
    if (decisonFlag) {
      console.log(decison, decisonFlag)

      dispatch(getFriends())
      dispatch(getAllFriendRequestt())
      dispatch(getAllRequestt())
    }
  }, [decison])
  useEffect(() => {
    if (controlRequestSuccess || withdrawRequestSuccess) {
      dispatch(getFriends())
      dispatch(getAllFriendRequestt())
      dispatch(getAllRequestt())
    }
  }, [controlRequestSuccess, withdrawRequestSuccess, dispatch])
  return (
    // <div className="relative z-10">
    //   <div className=" mb-8 w-full ">
    //     <div className=" p-6">
    <div className="relative">
      {/* Notification Bell */}
      {/* <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            > */}
      {/* <CiBellOn className="w-6 h-6 text-gray-600" />
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalNotifications}
                </span>
              )} */}
      {/* </button> */}

      {/* Notification Panel */}
      {
        <div className="w-full bg-transparent h-full rounded-lg shadow-lg   z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-500">
            <h3 className="text-lg font-semibold text-gray-100">
              Connection Requests
            </h3>

            {/* Tabs */}
            <div className="flex mt-3 space-x-1 bg-black/20 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("incoming")}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeTab === "incoming"
                    ? "bg-neutral-200 text-[#000000] shadow-sm"
                    : "text-neutral-100 hover:text-white"
                }`}
              >
                {requestCount ? <>Received ({requestCount})</> : <>Received</>}
              </button>
              <button
                onClick={() => setActiveTab("outgoing")}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeTab === "outgoing"
                    ? "bg-white text-black shadow-sm"
                    : "text-neutral-100 hover:text-white"
                }`}
              >
                {sendRequestCount ? <>Sent ({sendRequestCount})</> : <>Sent</>}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className=" overflow-y-auto">
            {activeTab === "incoming" && (
              <div className="p-4">
                {!stateIsThere ? (
                  <div className="text-center py-8">
                    <LuUserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-100">No incoming requests</p>
                  </div>
                ) : (
                  <div className="space-y-4 ">
                    {state.map(request => {
                      const formattedDate = request.createdAt
                        ? formatDistanceToNow(new Date(request.createdAt), {
                            addSuffix: true,
                          }).replace(/^about/, "")
                        : "Unknown date"
                      return (
                        <div
                          key={request.id}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-neutral-600 transition-colors duration-200"
                        >
                          <Image
                            src={request.sender.userImage || "/images/user.svg"}
                            height={100}
                            width={100}
                            alt={request.sender.name || ""}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-neutral-100 truncate">
                                {request.sender.name}
                              </h4>
                              <span className="text-xs text-neutral-100">
                                {formattedDate}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-300 mt-1">
                              {request.sender.email}
                            </p>
                            {/*
                          <p className="text-xs text-neutral-100 mt-1">
                            {request.mutualConnections} mutual connections
                          </p> */}
                            <div className="flex space-x-2 mt-3">
                              <button
                                onClick={() => handleAcceptRequest(request.id)}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-[#D93901] text-white text-xs rounded-md hover:bg-[#ff6128] transition-colors duration-200"
                              >
                                <IoMdCheckmark className="w-3 h-3" />
                                <span>Accept</span>
                              </button>
                              <button
                                onClick={() => handleDeclineRequest(request.id)}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 transition-colors duration-200"
                              >
                                <RxCross1 className="w-3 h-3" />
                                <span>Decline</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "outgoing" && (
              <div className="p-4">
                {!stateIsThere2 ? (
                  <div className="text-center py-8">
                    <GoClock className="w-12 h-12 text-neutral-100 mx-auto mb-3" />
                    <p className="text-gray-500">No pending requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {state2.map(request => {
                      const formattedDate = request.createdAt
                        ? formatDistanceToNow(new Date(request.createdAt), {
                            addSuffix: true,
                          }).replace(/^about/, "")
                        : "Unknown date"
                      return (
                        <div
                          key={request.id}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-neutral-600  transition-colors duration-200"
                        >
                          <img
                            src={
                              request.receiver.userImage || "/images/user.svg"
                            }
                            alt={request.receiver.name || ""}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-neutral-100 truncate">
                                {request.receiver.name}
                              </h4>
                              <span className="text-xs text-neutral-100 ">
                                {formattedDate}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-300 mt-1">
                              {request.receiver.email}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <GoClock className="w-3 h-3 text-amber-500" />
                              <span className="text-xs text-amber-600">
                                Pending
                              </span>
                            </div>
                            <button
                              onClick={() => handleWithdrawRequest(request.id)}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 text-red-700 text-xs rounded-md hover:bg-red-200 transition-colors duration-200 mt-3 cursor-pointer"
                            >
                              <FiUserMinus className="w-3 h-3" />
                              <span>Withdraw Request</span>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {/* {totalNotifications > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-sm text-[#D93901] hover:text-[#b22f00] font-medium transition-colors duration-200"
              >
                Close
              </button>
            </div>
          )} */}
        </div>
      }

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
    //     </div>
    //   </div>
    // </div>
  )
}

export default Notification
