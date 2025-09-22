"use client"
import {
  useAppDispatch,
  useAppSelector,
} from "@/reduxStore/hook/customHookReducer"
import Image from "next/image"
import React, {useState} from "react"
import {IoIosArrowBack} from "react-icons/io"
import {AiOutlineEdit} from "react-icons/ai"
import {RiImageEditLine} from "react-icons/ri"
import {AiOutlineCheck} from "react-icons/ai"
import {MdDarkMode, MdDelete} from "react-icons/md"
import {FiLogOut, FiImage} from "react-icons/fi"
import {BsShield} from "react-icons/bs"
import {IoColorPalette} from "react-icons/io5"
import {motion, AnimatePresence} from "motion/react"
import Themes from "./settingsOptions/Themes"
import {accountDelete} from "@/reduxStore/slices/Profile"

const Settings = () => {
  const user = useAppSelector(state => state.authReducer)
  const dispatch = useAppDispatch()
  console.log(user)
  const [changeUserName, setChangeUserName] = useState(user.user?.name)
  const [showChangeName, setShowChangeName] = useState(false)
  const [showCheck, setShowCheck] = useState(false)
  const [currentStep, setCurrentStep] = useState(0) // 0 for main form, 1 for extra signup
  const [direction, setDirection] = useState(0)
  const [active, setActive] = useState("main")
  const [sure, Setsure] = useState(false)

  console.log(user)
  const handleNext = () => {
    setDirection(1) // Moving forward
    setCurrentStep(1)
  }

  const handleBack = () => {
    setDirection(-1) // Moving backward
    setCurrentStep(0)
    setActive("main")
  }
  const handleDelete = () => {
    dispatch(accountDelete())
  }

  const handleThemes = () => {
    setActive("themes")
    handleNext()
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
    <div className="relative h-full w-full mx-auto pt-6 overflow-auto">
      <h1 className="text-white text-xl font-bold mb-10 items-center justify-center flex">
        Settings
      </h1>
      <div>
        {sure && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/40 backdrop-blur-xl rounded-xl border border-white/20 p-6 sm:p-8 w-full max-w-md shadow-2xl mx-4">
              <div className="flex items-center justify-center flex-col">
                <p className="">Are u sure</p>
                <section className="flex gap-4 mt-6">
                  <button
                    onClick={handleDelete}
                    className="px-5 py-2 rounded-xl bg-red-500 text-white font-medium shadow-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => Setsure(false)}
                    className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 font-medium shadow-md hover:bg-gray-300 transition"
                  >
                    Back
                  </button>
                </section>
              </div>
            </div>
          </div>
        )}
        <span className="items-center justify-center flex flex-col p-4 ">
          <span className="relative group">
            <Image
              src={user.user?.userImage || "/images/user.svg"}
              width={100}
              height={100}
              alt="avatar"
              className="rounded-full h-20 w-20 object-cover mb-3 group-hover:blur-[1.9px] transition-all "
            ></Image>
            <RiImageEditLine className="absolute top-8 left-7 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white"></RiImageEditLine>
          </span>
          <span className="relative">
            <p className="text-md font-extrabold">
              {showChangeName ? (
                <span className="flex items-center justify-center">
                  <input
                    type="text"
                    value={changeUserName}
                    onChange={e => {
                      setChangeUserName(e.target.value), setShowCheck(true)
                    }}
                    className="text-white bg-transparent border-b-2 border-[#e85018] outline-none font-extrabold text-md px-2 py-1  text-center  "
                    autoFocus
                  />
                </span>
              ) : user && user.user?.name ? (
                user.user?.name.charAt(0).toUpperCase() +
                user?.user?.name.slice(1)
              ) : (
                ""
              )}
            </p>

            {showCheck ? (
              <AiOutlineCheck className="absolute -right-6 top-2 "></AiOutlineCheck>
            ) : (
              <AiOutlineEdit
                onClick={() => {
                  setShowChangeName(!showChangeName)
                }}
                className="absolute -right-6 top-1 "
              ></AiOutlineEdit>
            )}
          </span>
          <p className="border-b w-full mt-4 border-neutral-600 "></p>
        </span>
        {/* Settings Options */}

        <div className="px-4 space-y-4 mt-6">
          {/* Appearance Section */}
          <div className="flex items-center justify-center mb-10 relative">
            {currentStep === 1 && (
              <button
                onClick={handleBack}
                className="absolute left-4 text-white hover:text-gray-300"
              >
                <IoIosArrowBack className="text-xl" />
              </button>
            )}
            {/* <h1 className="text-white text-xl font-bold">Settings</h1> */}
          </div>
          <AnimatePresence mode="wait">
            {currentStep === 0 && active === "main" ? (
              <motion.div
                key="main-form"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: {type: "spring", stiffness: 300, damping: 30},
                  opacity: {duration: 0.1},
                }}
              >
                <div className="space-y-3">
                  <h3 className="text-white text-lg font-semibold mb-3">
                    Appearance
                  </h3>

                  {/* Set Wallpaper */}
                  <div
                    onClick={handleThemes}
                    className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <FiImage className="text-blue-400 text-xl" />
                      <span className="text-white">Set Wallpaper</span>
                    </div>
                    <IoIosArrowBack className="text-gray-400 rotate-180" />
                  </div>

                  {/* Theme */}

                  {/* <div className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MdDarkMode className="text-purple-400 text-xl" />
                      <span className="text-white">Dark Mode</span>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        darkMode ? "bg-blue-500" : "bg-gray-900"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          darkMode ? "translate-x-6" : "translate-x-0.5"
                        }`}
                      ></div>
                    </button>
                  </div> */}

                  {/* Color Theme */}
                  {/* <div className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <IoColorPalette className="text-pink-400 text-xl" />
                      <span className="text-white">Color Theme</span>
                    </div>
                    <IoIosArrowBack className="text-gray-400 rotate-180" />
                  </div> */}
                </div>

                {/* Account Actions */}
                <div className="space-y-3 pt-4">
                  <h3 className="text-white text-lg font-semibold mb-3">
                    Account
                  </h3>

                  {/* Delete Account */}
                  <div
                    onClick={() => Setsure(true)}
                    className="flex items-center justify-between p-3 bg-red rounded-lg hover:bg-red-900/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <MdDelete className="text-red-400 text-xl" />
                      <span className="text-red-400">Delete Account</span>
                    </div>
                    <IoIosArrowBack className="text-red-400 rotate-180" />
                  </div>

                  {/* Logout */}
                  {/* <div className="flex items-center justify-between p-3 bg-orange-900/30 rounded-lg hover:bg-orange-900/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <FiLogOut className="text-orange-400 text-xl" />
                      <span className="text-orange-400">Logout</span>
                    </div>
                    <IoIosArrowBack className="text-orange-400 rotate-180" />
                  </div> */}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="extra-signup"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: {type: "spring", stiffness: 300, damping: 30},
                  opacity: {duration: 0.1},
                }}
              >
                {currentStep === 1 && active === "themes" ? (
                  <Themes></Themes>
                ) : (
                  ""
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Settings

// {/* Privacy & Security */}
// <div className="space-y-3">
//   <h3 className="text-white text-lg font-semibold mb-3">
//     Privacy & Security
//   </h3>

//   {/* Notifications */}
//   <div className="flex items-center justify-between p-3 bg-neutral-600 rounded-lg">
//     <div className="flex items-center space-x-3">
//       <MdNotifications className="text-yellow-400 text-xl" />
//       <span className="text-white">Notifications</span>
//     </div>
//     <button
//       onClick={() => setNotifications(!notifications)}
//       className={`w-12 h-6 rounded-full transition-colors ${
//         notifications ? "bg-green-500" : "bg-gray-600"
//       }`}
//     >
//       <div
//         className={`w-5 h-5 bg-white rounded-full transition-transform ${
//           notifications ? "translate-x-6" : "translate-x-0.5"
//         }`}
//       ></div>
//     </button>
//   </div>

//   {/* Privacy Settings */}
//   <div className="flex items-center justify-between p-3 bg-neutral-600 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
//     <div className="flex items-center space-x-3">
//       <BsShield className="text-green-400 text-xl" />
//       <span className="text-white">Privacy Settings</span>
//     </div>
//     <IoIosArrowBack className="text-gray-400 rotate-180" />
//   </div>

//   {/* Blocked Users */}
//   <div className="flex items-center justify-between p-3 bg-neutral-600 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
//     <div className="flex items-center space-x-3">
//       <MdBlock className="text-red-400 text-xl" />
//       <span className="text-white">Blocked Users</span>
//     </div>
//     <IoIosArrowBack className="text-gray-400 rotate-180" />
//   </div>
// </div>

//  {/* General */}
//   <div className="space-y-3">
//     <h3 className="text-white text-lg font-semibold mb-3">General</h3>

//     {/* Language */}
//     <div className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
//       <div className="flex items-center space-x-3">
//         <MdLanguage className="text-indigo-400 text-xl" />
//         <span className="text-white">Language</span>
//       </div>
//       <span className="text-gray-400">English</span>
//     </div>

//     {/* Storage */}
//     <div className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
//       <div className="flex items-center space-x-3">
//         <MdSecurity className="text-orange-400 text-xl" />
//         <span className="text-white">Storage & Data</span>
//       </div>
//       <IoIosArrowBack className="text-gray-400 rotate-180" />
//     </div>
//   </div>
