import React, {useState} from "react"
import {HiOutlineDotsVertical} from "react-icons/hi"

import {IoIosArrowDroprightCircle} from "react-icons/io"

import Link from "next/link"

import AuthWrapper from "./Authentication/AuthWrapper"

const Home = () => {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="w-full max-w-[1920px] mx-auto ">
      <div className="min-h-screen bg-[#000] relative overflow-hidden w-full  ">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-4 sm:-bottom-8 left-10 sm:left-20 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-gray-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row min-h-screen ">
          {/* Left Side - Hero Section */}
          <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-16 py-8 lg:py-0">
            <div className="w-full max-w-2xl text-center">
              <div className="mb-6 sm:mb-8">
                <h1 className="text-4xl  sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 sm:mb-4 tracking-tight leading-tight">
                  Convexle
                </h1>
                <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-gray-400 to-gray-500 mx-auto rounded-full"></div>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
                Connect Beyond
                <span className="bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
                  {" "}
                  Boundaries
                </span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 leading-relaxed px-2">
                Experience seamless communication with our next-generation chat
                platform. Beautiful design meets powerful functionality.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
                <button
                  // onClick={handleDemoLogin}
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl w-full sm:w-auto"
                >
                  <Link href={"/chat"}>
                    <span className="flex items-center justify-center gap-2">
                      Try Demo
                      <IoIosArrowDroprightCircle className="text-lg sm:text-xl group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </button>

                <button
                  onClick={() => setShowLogin(true)}
                  className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/20 text-white font-semibold rounded-2xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                >
                  Get Started
                </button>
              </div>

              {/* Demo credentials info */}
              <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 mx-2">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">
                  Demo Credentials
                </h3>
                <div className="text-sm sm:text-base text-gray-300 space-y-1 sm:space-y-2">
                  <p>
                    <strong>Email:</strong> demo@convexle.com
                  </p>
                  <p>
                    <strong>Password:</strong> demo123
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Chat Preview & Background Image */}
          <div className="hidden  lg:block flex-1 relative min-h-[300px] lg:min-h-screen">
            {/* Background Image */}
            <div className="hidden lg:block absolute inset-0 bg-[url('/images/hero.jpg')] bg-center bg-cover bg-no-repeat opacity-40 lg:opacity-100"></div>

            {/* Chat Preview - Hidden on mobile, visible on desktop */}
            <div className="hidden lg:block absolute top-1/2 right-8 transform -translate-y-1/2">
              <div className="w-80 bg-black/20 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                <div className="bg-black/30 backdrop-blur-sm p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                          src="images/aryan.jpeg"
                          alt="Demo User"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">
                          Demo Chat
                        </h3>
                        <p className="text-xs text-white/60">Online now</p>
                      </div>
                    </div>
                    <HiOutlineDotsVertical className="text-white/60" />
                  </div>
                </div>

                <div className="p-4 space-y-3 h-64 overflow-y-auto">
                  <div className="flex justify-start">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 max-w-[80%]">
                      <p className="text-white text-sm">
                        Welcome to Convexle! 👋
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-white text-black rounded-2xl px-4 py-2 max-w-[80%]">
                      <p className="text-sm">This looks amazing!</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 max-w-[80%]">
                      <p className="text-white text-sm">
                        Try the demo to explore all features ✨
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-white/10">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-2">
                    <input
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent text-white placeholder-white/50 text-sm focus:outline-none"
                      disabled
                    />
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <IoIosArrowDroprightCircle className="text-white text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Chat Preview - Shows on tablets */}
            {/* <div className="hidden lg:block xl:hidden absolute bottom-8 right-4 left-4">
              <div className="max-w-sm mx-auto bg-black/20 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                <div className="bg-black/30 backdrop-blur-sm p-3 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <img
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20"
                          src="https://i.pravatar.cc/150?img=1"
                          alt="Demo User"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-black"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-xs">
                          Demo Chat
                        </h3>
                        <p className="text-xs text-white/60">Online</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 space-y-2 h-32 overflow-hidden">
                  <div className="flex justify-start">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1.5 max-w-[80%]">
                      <p className="text-white text-xs">
                        Welcome to Convexle! 👋
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-white text-black rounded-xl px-3 py-1.5 max-w-[80%]">
                      <p className="text-xs">This looks amazing!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Login Modal */}
        {showLogin && <AuthWrapper setShowLogin={setShowLogin}></AuthWrapper>}

        {/* <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style> */}
      </div>
    </div>
  )
}

export default Home
