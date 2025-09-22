"use client"
import {
  useAppDispatch,
  useAppSelector,
} from "@/reduxStore/hook/customHookReducer"
import {createGroup} from "@/reduxStore/slices/GroupSlice"

import Image from "next/image"
import React, {useEffect, useState} from "react"
import {IoIosArrowBack} from "react-icons/io"
import {IoCheckmarkSharp} from "react-icons/io5"

type GroupSubmissionprops = {
  onback: () => void
  groupName: string
  groupDes: string
  selectedFriend: any
}

const GroupSubmission = ({
  onback,
  selectedFriend,
  groupName,
  groupDes,
}: GroupSubmissionprops) => {
  const user = useAppSelector(state => state.authReducer.user)
  const [finalGroup, setFinalGroup] = useState(selectedFriend)
  const oneUser = selectedFriend[0]
  const dispatch = useAppDispatch()
  const selectedFriendId = selectedFriend.map((id: any) => id.id)
  console.log(user)

  const handleSubmit = () => {
    dispatch(
      createGroup({
        groupName,
        groupDescription: groupDes,
        members: selectedFriendId,
      })
    )
  }
  useEffect(() => {
    setFinalGroup((prev: any) => {
      const isUserAlreadyInclude = prev.some((data: any) => data.id == user?.id)
      if (!isUserAlreadyInclude) {
        return [user, ...prev]
      }
      return prev
    })
  }, [])
  return (
    <div className="p-6 h-full w-full flex flex-col">
      <IoIosArrowBack
        onClick={onback}
        className="h-7 w-7 cursor-pointer text-white mb-4 absolute"
      />
      <h2 className="text-white text-xl font-bold mb-6 text-center">
        Final Group Detail
      </h2>
      <div className="relative flex items-center justify-center">
        <Image
          src={user?.userImage || "/images/user.svg"}
          height={100}
          width={100}
          alt="group avatar"
          className="h-20 w-20 rounded-full z-1 border-5 border-white"
        ></Image>
        <Image
          src={oneUser.userImage}
          height={100}
          width={100}
          alt="group avatar"
          className="h-20 w-20 rounded-full absolute mr-10 mb-5 border-5 border-white"
        ></Image>
      </div>
      <div className="flex flex-col items-center justify-center mt-5">
        <section className=""></section>
        <h1 className="text-lg font-extrabold">{groupName}</h1>
        <p className="mt-2 font-light text-sm text-neutral-300">{groupDes}</p>
        <div className="mt-10  ">
          {/* <p className="text-sm text-neutral-400 absolute left-8">Members</p> */}

          {finalGroup.map((friend: any) => (
            <div
              key={friend.id}
              className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/10 cursor-pointer transition-all duration-300 border border-transparent hover:border-white/10 overflow-auto"
            >
              <div className="relative flex-shrink-0">
                <Image
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                  src={friend.userImage || "/images/user.svg"}
                  width={48}
                  height={48}
                  alt={friend.name}
                />
                {friend.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white truncate group-hover:text-white/90">
                  {friend.name || friend.userName}
                </h4>
                <p className="text-xs text-neutral-300">{friend.email}</p>
                {friend.message && (
                  <p className="text-sm text-white/70 truncate group-hover:text-white/80 mt-1">
                    {friend.message}
                  </p>
                )}
              </div>
              {friend.id === user?.id ? (
                <div>
                  <p className="text-sm text-neutral-400">Admin</p>
                </div>
              ) : (
                ""
              )}

              <div className="flex items-center gap-3">
                {friend.time && (
                  <span className="text-xs text-white/60 group-hover:text-white/70">
                    {friend.time}
                  </span>
                )}
                {friend.unread > 0 && (
                  <div className="bg-white text-black text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                    {friend.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleSubmit}
          className="bg-[#D93901] rounded-full p-3 shadow-lg hover:bg-[#B8300C] transition-colors duration-200"
        >
          <IoCheckmarkSharp className="text-2xl text-white"></IoCheckmarkSharp>
        </button>
      </div>
    </div>
  )
}

export default GroupSubmission
