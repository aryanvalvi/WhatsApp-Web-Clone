import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"

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
  decison: null
  decisonFlag: null | ""
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
  decison: null,
  decisonFlag: null,
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
      console.log("freind request send kardi", data)
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
    console.log(data)
    console.log("get all request ka data mila", data)
    return data
  } catch (error) {
    console.log(error)
  }
})
export const getAllFriendRequestt = createAsyncThunk(
  "getallfriendsreq",
  async () => {
    console.log("🔍 API call started at:", new Date().toISOString())
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
      console.log("📊 API call completed at:", new Date().toISOString())

      console.log("get all friend request ka data mila", data)
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
      const data = await res.json()
      console.log("controlRequest response:", data) // ← Debug log
      return data
    } catch (error) {
      console.log("controlRequest error:", error)
      throw error
    }
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

export const requestDecisionFromUser = createAsyncThunk(
  "reqDec",
  async ({Decision}: {Decision: string}) => {
    try {
      const res = await fetch("http://localhost:5001/user_decision", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({Decision}),
      })
      const data = await res.json()
      console.log("data from request decison from user", data)
      return data
    } catch (error) {
      console.log(error)
    }
  }
)

const friendSlice = createSlice({
  name: "friendSlice",
  initialState,
  reducers: {
    setRefresh: (state, action) => {
      state.reredner = action.payload
    },
    addNewRequest: (state, action) => {
      state.requests.push(action.payload)
      state.requestCount = (state.requestCount || 0) + 1
    },
    removeSentRequest: (state, action) => {
      const requestId = action.payload
      if (requestId) {
        state.sendRequest = state.sendRequest.filter(
          req => req.id !== requestId
        )
        state.sendRequestCount = state.sendRequest.length
      } else {
        state.sendRequest = []
        state.sendRequestCount = 0
      }
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
    builder.addCase(controlRequest.fulfilled, (state, action) => {
      state.controlRequestSuccess = action.payload?.success || false
      state.message = action.payload?.message
      const requestId = action.meta.arg.manipulateId
      state.requests = state.requests.filter(req => req.id !== requestId)
      state.requestCount = state.requests.length
    })
    builder.addCase(requestDecisionFromUser.fulfilled, (state, action) => {
      state.decison = action.payload
      state.decisonFlag = action.payload
    })
  },
})

export const friendSliceAuth = friendSlice.reducer
export const {setRefresh, addNewRequest, removeSentRequest} =
  friendSlice.actions
