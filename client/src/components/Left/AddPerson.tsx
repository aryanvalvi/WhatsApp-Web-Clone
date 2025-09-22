import {useAppDispatch} from "@/reduxStore/hook/customHookReducer"
import {setActiveTab} from "@/reduxStore/slices/DashboardSlice"
import {sendFriendRequest, setRefresh} from "@/reduxStore/slices/FriendSlice"
import React from "react"
import {IoIosArrowBack} from "react-icons/io"

const AddPerson = () => {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const dispatch = useAppDispatch()
  // const handleSubmit = e => {
  //   e.preventDefault()
  //   console.log("Form Submitted:", {name, email})
  //   // Add your submit logic here (e.g., API call)
  // }
  const addFriend = () => {
    if (email) {
      dispatch(sendFriendRequest(email))
      // dispatch(setRefresh(true))
    }
  }

  return (
    <div className="relative z-10">
      <div className=" mb-8 w-full ">
        <div className=" p-6">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <IoIosArrowBack
                onClick={() => dispatch(setActiveTab("chat"))}
                className="h-7 w-7  absolute"
              ></IoIosArrowBack>
              <h2 className="text-white text-xl font-bold mb-10 items-center justify-center flex">
                Send request
              </h2>

              <div className="space-y-4">
                {/* <div>
                  <label
                    className="block text-gray-400 text-sm font-medium mb-2"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3  border-b  border-b-gray-100  text-white placeholder-gray-500 focus:outline-none  focus:ring-neutral-700 bg-transparent bg-none focus:border-transparent transition-all duration-200"
                    placeholder="Enter your name"
                    required
                  />
                </div> */}
                <div>
                  <label
                    className="block text-gray-400 text-sm font-medium mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3  border-b  border-b-gray-100  text-white placeholder-gray-500 focus:outline-none  focus:ring-neutral-700 bg-transparent bg-none focus:border-transparent transition-all duration-200"
                    placeholder="Enter Email"
                    required
                  />
                </div>
                <button
                  onClick={addFriend}
                  className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 font-medium mt-6"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddPerson
