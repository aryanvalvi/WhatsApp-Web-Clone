"use client"
import {useAppDispatch} from "@/reduxStore/hook/customHookReducer"
import {setActiveTab} from "@/reduxStore/slices/DashboardSlice"
import React, {useState} from "react"
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io"
import {motion, AnimatePresence} from "motion/react"
import AddCommunity from "./AddCommunity"

const Communities = () => {
  const dispatch = useAppDispatch()
  const [currentStep, setCurrentStep] = useState(0) // 0 for main, 1 for add community
  const [direction, setDirection] = useState(0)

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
    <div className="relative  w-full max-w-md mx-auto pt-6 overflow-hidden h-full">
      <AnimatePresence mode="wait">
        {currentStep === 0 ? (
          <motion.div
            key="main"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: {type: "spring", stiffness: 300, damping: 30},
              opacity: {duration: 0.1},
            }}
            className="absolute inset-0 w-full p-6"
          >
            <IoIosArrowBack
              onClick={() => dispatch(setActiveTab("chat"))}
              className="h-7 w-7 absolute ml-6 cursor-pointer text-white"
            />

            <h2 className="text-white text-xl font-bold mb-10 items-center justify-center flex">
              Group
            </h2>

            <div className="h-full flex flex-col justify-center pb-40">
              <div className="flex items-center flex-col justify-center mt-10">
                <p className="text-sm text-white mt-5 w-90 ml-5 text-center">
                  A Group is a shared space where people come together around
                  common interests, goals, or topics. It connects members, lets
                  them interact, share ideas, and build meaningful relationships
                  in one central place.
                </p>
                <button
                  onClick={handleNext}
                  className="bg-[#D93901] rounded-full mt-4"
                >
                  <IoIosArrowForward className="text-4xl cursor-pointer text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="add-community"
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
            <AddCommunity
              onBack={handleBack}
              onComplete={() => dispatch(setActiveTab("chat"))}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Communities
