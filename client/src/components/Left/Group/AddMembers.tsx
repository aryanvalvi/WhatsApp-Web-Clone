"use client"
import React, {useState} from "react"
import {IoIosArrowBack} from "react-icons/io"
import {
  useAppDispatch,
  useAppSelector,
} from "@/reduxStore/hook/customHookReducer"
import {setActiveTab} from "@/reduxStore/slices/DashboardSlice"
import Image from "next/image"
import {FaArrowRight} from "react-icons/fa6"
import {RxCross1} from "react-icons/rx"
import {motion, AnimatePresence} from "motion/react"
import GroupSubmission from "./GroupSubmission"
type AddMembersProps = {
  groupName: string
  groupDes: string
  onBack: () => void
  onComplete: () => void
}
const AddMembers = ({
  groupName,
  groupDes,
  onBack,
  onComplete,
}: AddMembersProps) => {
  const [selectedFriend, setSelectedFriend] = useState<string[] | any>([])
  const [searchTerm, setSearchTerm] = useState("")
  const friends = useAppSelector(state => state.friendSliceAuth.getFriendsData)
  const [currentStep, setCurrentStep] = useState(0) // 0 for form, 1 for add members
  const [direction, setDirection] = useState(0)
  const dispatch = useAppDispatch()

  const handleAddFriend = (friendId: string | any) => {
    const getFriendData = friends.find(data => data.id === friendId)
    const isAlreadySelected = selectedFriend.some(
      (data: any) => data.id === friendId
    )

    if (isAlreadySelected) {
      setSelectedFriend((prev: any) =>
        prev.filter((data: any) => data.id !== friendId)
      )
    } else {
      setSelectedFriend((prev: any) => [...prev, getFriendData])
    }
  }

  const handleRemoveFriend = (friendId: string) => {
    setSelectedFriend((prev: any) => prev.filter((f: any) => f.id !== friendId))
  }

  const filteredFriends =
    friends?.filter(
      (friend: any) =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  const handleCreateGroup = () => {
    console.log("Creating group:", {
      name: groupName,
      description: groupDes,
      members: selectedFriend,
    })
    onComplete()
  }

  const handleNext = () => {
    setDirection(1) // Moving forward
    setCurrentStep(1)
  }

  const handleBack = () => {
    setDirection(-1) // Moving backward
    setCurrentStep(0)
  }

  const slideVariants = {
    enter: (direction: any) => ({
      x: direction > 0 ? "5%" : "-5%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: any) => ({
      x: direction > 0 ? "-5%" : "5%",
      opacity: 0,
    }),
  }
  return (
    <div className="p-6 h-full w-full flex flex-col">
      <AnimatePresence mode="wait">
        {currentStep === 0 ? (
          <div>
            <IoIosArrowBack
              onClick={onBack}
              className="h-7 w-7 cursor-pointer text-white mb-4"
            />

            <h2 className="text-white text-xl font-bold mb-6 text-center">
              Add Members
            </h2>

            {/* Selected Members Display */}
            <div className="flex flex-wrap gap-2 items-center w-full rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 min-h-[56px] focus-within:ring-2 focus-within:ring-white/30 focus-within:bg-white/15 transition-all duration-300 mb-4">
              {selectedFriend.map((data: any) => (
                <div
                  key={data.id}
                  className="relative group gap-2 flex items-center bg-white/20 text-white font-medium text-sm rounded-full px-3 py-1 pr-8"
                >
                  <Image
                    src={data.userImage || "/images/user.svg"}
                    width={24}
                    height={24}
                    alt="avatar"
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="max-w-20 truncate">{data.name}</span>
                  <button
                    onClick={() => handleRemoveFriend(data.id)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-white bg-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <RxCross1 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              <input
                placeholder="Search friends..."
                className="bg-transparent text-white text-base focus:outline-none flex-1 placeholder-white/60 min-w-32"
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Friends List */}
            <div className="flex-1 overflow-y-auto">
              {filteredFriends.length > 0 ? (
                <div className="space-y-2">
                  {filteredFriends.map((friend: any) => (
                    <div
                      key={friend.id}
                      onClick={() => handleAddFriend(friend.id)}
                      className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/10 cursor-pointer transition-all duration-300 border border-transparent hover:border-white/10"
                    >
                      <div className="relative flex-shrink-0">
                        <Image
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                          src={friend.userImage || "/images/user.svg"}
                          width={48}
                          height={48}
                          alt={friend.name || ""}
                        />
                        {friend.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate group-hover:text-white/90">
                          {friend.name}
                        </h4>
                        <p className="text-xs text-neutral-300">
                          {friend.email}
                        </p>
                        {friend.message && (
                          <p className="text-sm text-white/70 truncate group-hover:text-white/80 mt-1">
                            {friend.message}
                          </p>
                        )}
                      </div>

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
                        <input
                          type="checkbox"
                          checked={selectedFriend.some(
                            (f: any) => f.id === friend.id
                          )}
                          onChange={() => handleAddFriend(friend.id)}
                          className="h-5 w-5 accent-[#D93901]"
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-white/60">
                  {searchTerm
                    ? "No friends found matching your search"
                    : "No friends available"}
                </div>
              )}
            </div>

            {/* Create Group Button */}
            {selectedFriend.length > 0 && (
              <div className="fixed bottom-6 right-6">
                <button
                  onClick={handleNext}
                  className="bg-[#D93901] rounded-full p-3 shadow-lg hover:bg-[#B8300C] transition-colors duration-200"
                >
                  <FaArrowRight className="text-2xl text-white" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            key="add-members"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: {type: "spring", stiffness: 300, damping: 30},
              opacity: {duration: 0.1},
            }}
            className="absolute inset-0 w-full"
          >
            <GroupSubmission
              onback={handleBack}
              selectedFriend={selectedFriend}
              groupName={groupName}
              groupDes={groupDes}
            ></GroupSubmission>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AddMembers
