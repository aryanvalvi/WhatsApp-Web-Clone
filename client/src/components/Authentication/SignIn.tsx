"use client"
import React, {useState, useEffect} from "react"
import {loginFunction} from "@/reduxStore/slices/LoginSlice"
import {
  useAppDispatch,
  useAppSelector,
} from "@/reduxStore/hook/customHookReducer"
import {CiMail} from "react-icons/ci"
import {RiGoogleFill} from "react-icons/ri"
import {BiLock} from "react-icons/bi"
import {useRouter} from "next/navigation"
import {AuthWrapperProps} from "./SignUp"

const SignIn = ({setShowLogin, setShowSignUp}: AuthWrapperProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // const [success, setSuccess] = useState(false)
  const [loopingMessage, setLoopingMessage] = useState("")
  const [loader, setLoader] = useState(false)
  const [localError, setLocalerror] = useState({
    name: "",
    error: "",
  })
  console.log(localError)
  const router = useRouter()

  const dispatch = useAppDispatch()
  const state = useAppSelector(state => state.authReducer)

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  const isValidEmail = (value: any) => emailRegex.test(value)
  const handleGoogleLogin = () => {
    alert("Google login would be implemented here")
  }

  const handleEmailLogin = (e: any) => {
    e.preventDefault()
    setLoader(true)
    if (!isValidEmail(email)) {
      return setLocalerror({name: "email", error: "Please enter valid email"})
    }

    // setSuccess(true)
    setLoopingMessage("Verifying")
    dispatch(loginFunction({email, password}))
    // setLoader(false)
  }

  useEffect(() => {
    if (state.user) {
      setLoader(false)
      router.push("/chat")
    }
  }, [state])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 w-full max-w-md shadow-2xl mx-4">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
            Sign in to continue chatting
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="relative">
            <CiMail className="absolute left-4 top-3.5 sm:top-4 text-white/60 text-lg" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all text-sm sm:text-base${
                localError.name === "email"
                  ? " border-red-900 focus:ring-red-600/30"
                  : " border-white/20 focus:ring-white/30"
              }`}
            />
            <p className="text-sm text-red-800 ml-2">
              {state.success === false ? state.message : ""}
            </p>
          </div>

          <div className="relative">
            <BiLock className="absolute left-4 top-3.5 sm:top-4 text-white/60 text-lg" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-all text-sm sm:text-base`}
              onKeyDown={e => e.key === "Enter" && handleEmailLogin(e)}
            />
            {/* ${
                state.password === false
                  ? " border-red-900 focus:ring-red-600/30"
                  : " border-white/20 focus:ring-white/30"
              } */}
            {/* <p className="text-sm text-red-800 ml-2">
              {state.password === false ? state.message : ""}
            </p> */}
          </div>

          <p className="text-sm text-red-800 ml-2">
            {state.error ? state.error : ""}
            {localError.error}
          </p>

          <button
            onClick={handleEmailLogin}
            className="w-full py-3 sm:py-4 bg-white text-black font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] text-sm sm:text-base flex"
          >
            <div className="flex items-center justify-center w-full relative gap-1">
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
              {loader ? loopingMessage : "Sign In"}
            </div>
          </button>
        </div>

        <div className="my-4 sm:my-6 flex items-center">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="px-4 text-white/60 text-xs sm:text-sm">or</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3 text-sm sm:text-base"
        >
          <RiGoogleFill className="text-lg sm:text-xl" />
          Continue with Google
        </button>

        <div className="mt-4 sm:mt-6 text-center">
          <button
            onClick={() => setShowSignUp(true)}
            className="text-white/70 hover:text-white transition-colors text-xs sm:text-sm"
          >
            Don't have an account? Sign up
          </button>
        </div>

        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-white/60 hover:text-white text-xl sm:text-2xl transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default SignIn
