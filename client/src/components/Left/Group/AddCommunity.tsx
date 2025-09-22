"use client"
import {
  useAppDispatch,
  useAppSelector,
} from "@/reduxStore/hook/customHookReducer"
import {setActiveTab} from "@/reduxStore/slices/DashboardSlice"
import React, {useState} from "react"
import {IoIosArrowBack} from "react-icons/io"
import {FiCheck} from "react-icons/fi"
import {motion, AnimatePresence} from "motion/react"
import AddMembers from "./AddMembers"

export type AddCommunityProps = {
  onBack: () => void
  onComplete: () => void
}
const AddCommunity = ({onBack, onComplete}: AddCommunityProps) => {
  const dispatch = useAppDispatch()
  const [communityName, setCommunityName] = useState("")
  const [communityDes, setCommunityDes] = useState("")
  const [currentStep, setCurrentStep] = useState(0) // 0 for form, 1 for add members
  const [direction, setDirection] = useState(0)

  const friends = useAppSelector(state => state.friendSliceAuth.getFriendsData)

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
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {currentStep === 0 ? (
          <motion.div
            key="community-form"
            // custom={direction}
            // variants={slideVariants}
            // initial="enter"
            // animate="center"
            // exit="exit"
            // transition={{
            //   x: {type: "spring", stiffness: 300, damping: 30},
            //   opacity: {duration: 0.1},
            // }}
            className="absolute inset-0 w-full p-6"
          >
            <IoIosArrowBack
              onClick={onBack}
              className="h-7 w-7 absolute ml-6 cursor-pointer text-white"
            />

            {friends?.length < 1 ? (
              <div className="flex flex-col justify-center items-center h-full">
                <h2 className="text-white text-xl font-bold mb-1 items-center justify-center flex text-center">
                  You dont have any friends to create a group, Please add
                  Friends to create group
                </h2>
                <button
                  onClick={() => dispatch(setActiveTab("chat"))}
                  className="bg-[#D93901] rounded-full mt-4 cursor-pointer"
                >
                  <IoIosArrowBack className="text-white rotate-180 text-3xl" />
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-white text-xl font-bold mb-10 items-center justify-center flex">
                  New Group
                </h2>

                <input
                  type="text"
                  value={communityName}
                  onChange={e => setCommunityName(e.target.value)}
                  className="w-full px-0 py-3 border-b border-b-gray-100 text-white placeholder-gray-500 focus:outline-none focus:border-b-2 focus:border-[#D93901] bg-transparent transition-all duration-200"
                  placeholder="Group Name"
                  required
                />

                <textarea
                  value={communityDes}
                  onChange={e => setCommunityDes(e.target.value)}
                  className="w-full px-0 py-3 mt-5 border-b border-b-gray-100 text-white placeholder-gray-500 focus:outline-none focus:border-b-2 focus:border-[#D93901] bg-transparent transition-all duration-200 resize-none"
                  placeholder="Group Description"
                  rows={3}
                  required
                />

                <div className="flex items-center justify-center">
                  {communityName.trim() && (
                    <button
                      onClick={handleNext}
                      className="bg-[#D93901] rounded-full mt-8 p-2"
                    >
                      <FiCheck className="text-3xl text-white" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
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
            <AddMembers
              groupName={communityName}
              groupDes={communityDes}
              onBack={handleBack}
              onComplete={onComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AddCommunity
