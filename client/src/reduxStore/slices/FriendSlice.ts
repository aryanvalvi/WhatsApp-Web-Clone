import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"

// const requests = [
//   {
//     createdAt: null,
//     id: null,
//     sender: {
//       email: null,
//       id: null,
//       name: null,
//     },
//   },
// ]
// const sendRequest = [
//   {
//     createdAt: null,
//     id: null,
//     receiver: {
//       email: null,
//       id: null,
//       name: null,
//     },
//   },
// ]

// const getFriendsData = [
//   {
//     id: null,
//     name: null,
//     email: null,
//     roomId: null,

//     lastMessage: null,
//     lastMessageAt: null,
//     lastMessageRead: null,

//     roomCreatedAt: null,

//     unreadCount: null,
//     userImage: null,
//   },
// ]
// const getGroups = [
//   {
//     group: true,
//     bruhh: "",
//     id: "",
//     name: "",
//     Des: "",
//     createdAt: "",
//     participants: [
//       {
//         id: "",
//         userId: "",
//         roomId: "",
//         role: "",
//         joinedAt: "",
//         user: {
//           id: "",
//           name: "",
//           email: "",
//           userImage: "",
//         },
//       },
//     ],
//   },
// ]
// const initialState = {
//   requestCount: null,
//   sendRequestCount: 0,
//   deletedReq: null,
//   requests,
//   sendRequest,
//   message: null,
//   reredner: false,
//   sendRequestSuccess: null,
//   withdrawRequestSuccess: null,
//   controlRequestSuccess: null,
//   getFriendsDataSuccess: null,
//   getFriendsData,
//   getGroups,
// }
// Types
type User = {
  id: string | null
  name: string | null
  email: string | null
  userImage?: string | null
  image: string | null
}

type Request = {
  id: string | null
  createdAt: string | null
  sender: User
}

type SentRequest = {
  id: string | null
  createdAt: string | null
  receiver: User
}

type Friend = User & {
  roomId: string | null
  lastMessage: string | null
  lastMessageAt: string | null
  lastMessageRead: boolean | null
  roomCreatedAt: string | null
  unreadCount: number | null
}

type Group = {
  id: string
  name: string
  Des: string
  createdAt: string
  group: true
  unreadCount: any
  lastMessageAt: any
  participants: {
    id: string
    userId: string
    roomId: string
    role: string
    joinedAt: string
    user: User
  }[]
}

type State = {
  requestCount: number | null
  sendRequestCount: number
  requests: Request[]
  sendRequest: SentRequest[]
  getFriendsData: Friend[]
  getGroups: Group[]
  message: string | null
  reredner: boolean
  deletedReq: string | null
  sendRequestSuccess: boolean | null
  withdrawRequestSuccess: boolean | null
  controlRequestSuccess: boolean | null
  getFriendsDataSuccess: boolean | null
}

// Initial state
const initialState: State = {
  requestCount: null,
  sendRequestCount: 0,
  deletedReq: null,
  requests: [],
  sendRequest: [],
  message: null,
  reredner: false,
  sendRequestSuccess: null,
  withdrawRequestSuccess: null,
  controlRequestSuccess: null,
  getFriendsDataSuccess: null,
  getFriendsData: [],
  getGroups: [],
}
export const sendFriendRequest = createAsyncThunk(
  "sendFriendReq",
  async (email: string, {dispatch}) => {
    console.log(email)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_Url}/sent_friend_Request`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({emailid: email}),
        }
      )
      const data = await res.json()
      // await dispatch(getAllFriendRequest())
      // await dispatch(getAllRequest())
      // console.log(data)
      console.log("freind request send kardi")
      return data
    } catch (error) {
      console.log(error)
    }
  }
)

export const getAllRequestt = createAsyncThunk("getAllRequest", async () => {
  console.log("get all request called ")
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_Backend_Url}/pending_request`,
      {
        method: "GET",
        credentials: "include",
      }
    )
    const data = await res.json()
    // console.log(data)
    console.log("get all request ka data mila")
    return data
  } catch (error) {
    console.log(error)
  }
})
export const getAllFriendRequestt = createAsyncThunk(
  "getallfriendsreq",
  async () => {
    console.log("get all friend request called")
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_Url}/pending_request_reciever_end`,
        {
          method: "GET",
          credentials: "include",
        }
      )
      const data = await res.json()
      // console.log(data)
      console.log("get all friend request ka data mila")
      return data
    } catch (error) {
      console.log(error)
    }
  }
)

export const widrawSentRequest = createAsyncThunk(
  "widrawSentRequest",
  async (manipulateId: string, {dispatch}) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_Url}/pending_sender_withdraw`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({manipulateId}),
        }
      )
      const data = await res.json()
      console.log("lund ke bal", data)
      // await dispatch(getAllFriendRequest())
      // await dispatch(getAllRequest())
      return data
    } catch (error) {
      console.log(error)
    }
  }
)
export const controlRequest = createAsyncThunk(
  "controlRequest",
  async (
    {
      manipulateId,
      Decision,
    }: {
      manipulateId: string
      Decision: string
    },
    {dispatch}
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_Url}/pending_recirver_dicision`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({manipulateId, Decision}),
        }
      )
      // dispatch(getAllFriendRequest())
      // dispatch(getAllRequest())
    } catch (error) {}
  }
)
export const getFriends = createAsyncThunk("getallFriends", async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_Backend_Url}/getfriends`,
      {
        method: "GET",
        credentials: "include",
      }
    )
    const data = await res.json()
    console.log("data from get freinds", data)
    return data
  } catch (error) {
    console.log(error)
  }
})

const friendSlice = createSlice({
  name: "friendSlice",
  initialState,
  reducers: {
    setRefresh: (state, action) => {
      state.reredner = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getAllFriendRequestt.fulfilled, (state, action) => {
      state.requestCount = action.payload.count
      state.requests = action.payload.requests
    })
    builder.addCase(getAllRequestt.fulfilled, (state, action) => {
      state.sendRequestCount = action.payload.count
      state.sendRequest = action.payload.requests
    })
    builder.addCase(widrawSentRequest.fulfilled, (state, action) => {
      state.deletedReq = action.payload.deletedReq
      state.message = action.payload.message
      state.withdrawRequestSuccess = action.payload.success
    })
    builder.addCase(sendFriendRequest.fulfilled, (state, action) => {
      state.sendRequestSuccess = action.payload.success
    })
    builder.addCase(getFriends.fulfilled, (state, action) => {
      state.getFriendsDataSuccess = action.payload.success
      state.getFriendsData = action.payload.friendsDetail
      state.getGroups = action.payload.groups
    })
  },
})

export const friendSliceAuth = friendSlice.reducer
export const {setRefresh} = friendSlice.actions
