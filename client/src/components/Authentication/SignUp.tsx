"use client"
import React, {useState, useEffect} from "react"
import {
  registerFunction,
  resetStatus,
  verificationEmail,
} from "@/reduxStore/slices/LoginSlice"
import {
  useAppDispatch,
  useAppSelector,
} from "@/reduxStore/hook/customHookReducer"
import {CiUser, CiMail} from "react-icons/ci"
import {RiGoogleFill} from "react-icons/ri"
import {BiLock} from "react-icons/bi"
import {useRouter} from "next/navigation"
import ExtraSignUp from "./ExtraSignUp"
import {IoArrowBackSharp} from "react-icons/io5"
import {RxCross1} from "react-icons/rx"
import {motion, AnimatePresence} from "motion/react"

export type AuthWrapperProps = {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>
}
const SignUp = ({setShowLogin, setShowSignUp}: AuthWrapperProps) => {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [success, setSuccess] = useState(false)
  const [loopingMessage, setLoopingMessage] = useState("")
  const [currentStep, setCurrentStep] = useState(0) // 0 for main form, 1 for extra signup
  const [direction, setDirection] = useState(0) // 1 for forward, -1 for backward
  const [showCross, setShowCross] = useState(true)
  const [loader, setLoader] = useState(false)
  const [localError, setLocalerror] = useState({
    name: "",
    error: "",
  })
  const router = useRouter()

  const dispatch = useAppDispatch()
  const state = useAppSelector(state => state.authReducer)

  const handleGoogleLogin = () => {
    alert("Google login would be implemented here")
  }

  const handleEmailSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSuccess(true)
    setLoopingMessage("Creating")
    dispatch(registerFunction({email, password, name}))
  }
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  const isValidEmail = (value: any) => emailRegex.test(value)
  const handleNext = () => {
    if (!isValidEmail(email)) {
      return setLocalerror({name: "email", error: "Please enter valid email"})
    }
    setLoader(true)
    setLoopingMessage("Verifying")
    dispatch(resetStatus())
    dispatch(verificationEmail({name, email, password}))
  }
  useEffect(() => {
    if (state.success === true) {
      setLoader(false)
      setDirection(1)
      setCurrentStep(1)
      setLoopingMessage("")
    } else if (state.success === false) {
      setLoader(false)
      setLoopingMessage("")
    }
  }, [state.success])

  const handleBack = () => {
    setDirection(-1) // Moving backward
    setCurrentStep(0)
  }

  useEffect(() => {
    dispatch(dispatch(resetStatus()))
    if (state.user) {
      setSuccess(false)
      router.push("/chat")
    }
  }, [state])

  // Animation variants for swiper effect
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 w-full max-w-md shadow-2xl mx-4 relative overflow-hidden">
        {/* Close button */}
        {showCross && (
          <button
            onClick={() => setShowLogin(false)}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 text-white/60 hover:text-white text-xl sm:text-2xl transition-colors z-10"
          >
            <RxCross1 />
          </button>
        )}

        {/* Back button - only show when on step 1 */}
        {currentStep === 1 && (
          <button
            onClick={handleBack}
            className="absolute top-3 sm:top-4 left-3 sm:left-4 text-white/60 hover:text-white text-xl sm:text-2xl transition-colors z-10"
          >
            <IoArrowBackSharp />
          </button>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          {currentStep === 0 ? (
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
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Create Account
                </h2>
                <p className="text-sm sm:text-base text-gray-300">
                  Join the conversation today
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 sm:space-y-6">
                {/* Name Input */}
                <div className="relative">
                  <CiUser className="absolute left-4 top-3.5 sm:top-4 text-white/60 text-lg" />
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all text-sm sm:text-base`}
                  />
                  {/* ${
                      state.username === false
                        ? " border-red-900 focus:ring-red-600/30"
                        : " border-white/20 focus:ring-white/30"
                    } */}
                  {/* {state.username === false && (
                    <p className="text-sm text-red-800 ml-2 mt-1">
                      {state.message}
                    </p>
                  )} */}
                </div>

                {/* Email Input */}
                <div className="relative">
                  <CiMail className="absolute left-4 top-3.5 sm:top-4 text-white/60 text-lg" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all text-sm sm:text-base${
                      state.success === false || localError.name === "email"
                        ? " border-red-900 focus:ring-red-600/30"
                        : " border-white/20 focus:ring-white/30"
                    }`}
                  />
                  {state.success === false ||
                    (localError.error && (
                      <p className="text-sm text-red-800 ml-2 mt-1">
                        {state.message}
                        {state.error}
                        {localError.error}
                      </p>
                    ))}
                </div>

                {/* Password Input */}
                <div className="relative">
                  <BiLock className="absolute left-4 top-3.5 sm:top-4 text-white/60 text-lg" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all text-sm sm:text-base`}
                    onKeyDown={e => e.key === "Enter" && handleNext()}
                  />
                  {/* ${
                      state.password === false
                        ? " border-red-900 focus:ring-red-600/30"
                        : " border-white/20 focus:ring-white/30"
                    } */}
                  {/* {state.password === false && (
                    <p className="text-sm text-red-800 ml-2 mt-1">
                      {state.message}
                    </p>
                  )} */}
                </div>

                {/* General Error */}
                {/* {state.error && (
                  <p className="text-sm text-red-800 ml-2">{state.error}</p>
                )} */}

                {/* Next Button */}
                <div className="flex items-center justify-center w-full relative gap-1">
                  <button
                    onClick={handleNext}
                    disabled={!name || !email || !password}
                    className="w-full py-3 sm:py-4 bg-white text-black font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loader && (
                      <div role="status" className="pb-0.5">
                        <svg
                          aria-hidden="true"
                          className="inline w-5 h-5 text-gray-900 animate-spin dark:text-gray-900 fill-gray-900 dark:fill-gray-300"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}

                    {loader ? loopingMessage : "Next"}
                  </button>
                </div>
                {/* <button
                  onClick={handleNext}
                  disabled={!name || !email || !password}
                  className="w-full py-3 sm:py-4 bg-white text-black font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Next
                </button> */}
              </div>

              {/* Divider */}
              <div className="my-4 sm:my-6 flex items-center">
                <div className="flex-1 h-px bg-white/20"></div>
                <span className="px-4 text-white/60 text-xs sm:text-sm">
                  or
                </span>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>

              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3 text-sm sm:text-base"
              >
                <RiGoogleFill className="text-lg sm:text-xl" />
                Continue with Google
              </button>

              {/* Sign In Link */}
              <div className="mt-4 sm:mt-6 text-center">
                <button
                  onClick={() => setShowSignUp(false)}
                  className="text-white/70 hover:text-white transition-colors text-xs sm:text-sm"
                >
                  Already have an account? Sign in
                </button>
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
              <ExtraSignUp
                setShowCross={setShowCross}
                name={name}
                email={email}
                password={password}
                // success={success}
                // loopingMessage={loopingMessage}
                // handleEmailSignUp={handleEmailSignUp}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SignUp
