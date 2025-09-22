"use client"
import {
  useAppDispatch,
  useAppSelector,
} from "@/reduxStore/hook/customHookReducer"
import Image from "next/image"
import React, {useEffect, useState} from "react"
import {AiOutlineEdit, AiOutlineCheck, AiOutlineClose} from "react-icons/ai"
import {RiImageEditLine} from "react-icons/ri"
import {FiLogOut} from "react-icons/fi"
import {MdEmail, MdPerson} from "react-icons/md"
import {logoutUser, updateProfile} from "@/reduxStore/slices/Profile"
import {authCheckFunction} from "@/reduxStore/slices/LoginSlice"

const Profile = () => {
  const user = useAppSelector(state => state.authReducer.user)
  const dispatch = useAppDispatch()
  const {logoutSuccess} = useAppSelector(state => state.ProfileSliceReducer)
  console.log(user)
  // Username state
  const [username, setUsername] = useState("")
  console.log(username)
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [tempUsername, setTempUsername] = useState<string | any>("")

  // Email state
  const [email, setEmail] = useState("")
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [tempEmail, setTempEmail] = useState<string | any>("")

  const handleUsernameEdit = () => {
    if (user) {
      setTempUsername(username)
    }
    setIsEditingUsername(true)
  }

  const handleUsernameSave = () => {
    setUsername(tempUsername)
    setIsEditingUsername(false)
    dispatch(updateProfile({name: tempUsername}))
    // Add your save logic here (API call, etc.)
  }

  const handleUsernameCancel = () => {
    setTempUsername("")
    setIsEditingUsername(false)
  }

  const handleEmailEdit = () => {
    setTempEmail(email)
    setIsEditingEmail(true)
  }

  const handleEmailSave = () => {
    setEmail(tempEmail)
    setIsEditingEmail(false)
    dispatch(updateProfile({email: tempEmail}))
    // Add your save logic here (API call, etc.)
  }

  const handleEmailCancel = () => {
    setTempEmail("")
    setIsEditingEmail(false)
  }

  const handleLogout = () => {
    // Add your logout logic here
    dispatch(logoutUser())
    console.log("Logout clicked")
  }

  const handleImageChange = () => {
    // Add your image change logic here
    console.log("Image change clicked")
  }

  useEffect(() => {
    if (logoutSuccess === true) {
      window.location.href = `${process.env.NEXT_PUBLIC_Frontend_Url}`
    }
  }, [logoutSuccess])
  useEffect(() => {
    if (user) {
      console.log("user is", user)
      setUsername(user.name)
      setEmail(user.email)
    }
  }, [user])
  return (
    <div className="relative h-full w-full mx-auto pt-6 bg-transparent">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <h1 className="text-white text-2xl font-bold mb-8 text-center">
          Profile
        </h1>

        {/* Profile Image Section */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700  transition-colors duration-300">
              <Image
                src={user?.userImage || "/images/user.svg"}
                width={128}
                height={128}
                alt="Profile"
                className="w-full h-full object-cover group-hover:blur-sm transition-all duration-300"
              />
            </div>
            <button
              onClick={handleImageChange}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
            >
              <RiImageEditLine className="text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full" />
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-6">
          {/* Username Section */}
          <div className=" rounded-lg p-4">
            <div className="flex items-center mb-2">
              <MdPerson className="text-white text-xl mr-2" />
              <label className="text-gray-300 text-sm font-medium">
                Username
              </label>
            </div>

            <div className="flex items-center justify-between">
              {isEditingUsername ? (
                <div className="flex items-center flex-1 mr-3">
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={e => setTempUsername(e.target.value)}
                    className=" text-white px-3 py-2  outline-none border-b-2 flex-1 border-[#e85018]"
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === "Enter") handleUsernameSave()
                      if (e.key === "Escape") handleUsernameCancel()
                    }}
                  />
                  <div className="flex ml-2 space-x-1">
                    <button
                      onClick={handleUsernameSave}
                      className="text-green-500 hover:text-green-400 p-1"
                    >
                      <AiOutlineCheck className="text-lg" />
                    </button>
                    <button
                      onClick={handleUsernameCancel}
                      className="text-red-500 hover:text-red-400 p-1"
                    >
                      <AiOutlineClose className="text-lg" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-white font-medium flex-1">
                    {username
                      ? username.charAt(0).toUpperCase() + username.slice(1)
                      : null}
                  </p>
                  <button
                    onClick={handleUsernameEdit}
                    className="text-gray-400 hover:text-white transition-colors "
                  >
                    <AiOutlineEdit className="text-lg" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Email Section */}
          <div className=" rounded-lg p-4">
            <div className="flex items-center mb-2">
              <MdEmail className="text-white text-xl mr-2" />
              <label className="text-gray-300 text-sm font-medium">Email</label>
            </div>

            <div className="flex items-center justify-between">
              {isEditingEmail ? (
                <div className="flex items-center flex-1 mr-3">
                  <input
                    type="email"
                    value={tempEmail}
                    onChange={e => setTempEmail(e.target.value)}
                    className=" text-white px-3 py-2  outline-none border-b-2 flex-1 border-[#e85018]"
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === "Enter") handleEmailSave()
                      if (e.key === "Escape") handleEmailCancel()
                    }}
                  />
                  <div className="flex ml-2 space-x-1">
                    <button
                      onClick={handleEmailSave}
                      className="text-green-500 hover:text-green-400 p-1"
                    >
                      <AiOutlineCheck className="text-lg" />
                    </button>
                    <button
                      onClick={handleEmailCancel}
                      className="text-red-500 hover:text-red-400 p-1"
                    >
                      <AiOutlineClose className="text-lg" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-white font-medium flex-1">
                    {email || "No email provided"}
                  </p>
                  <button
                    onClick={handleEmailEdit}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <AiOutlineEdit className="text-lg" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Additional Info Section */}
          <div className=" rounded-lg p-4">
            <h3 className="text-white font-medium mb-3">Account Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Member Since:</span>
                <span className="text-gray-300">January 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Login:</span>
                <span className="text-gray-300">Today</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Account Status:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 mb-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-900 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <FiLogOut className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
