import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"

const chat = {
  id: null,
  name: null,
  email: null,
  roomId: null,
  userImage: null,
  groupImage: {
    img1: null,
    img2: null,
  },
  group: false,
}

const unReadMessage: any = []
const initialState = {
  chat,
  unReadMessage,
  message: [
    {
      id: null,
      fromMe: null,
      userImage: "",
      media: null,
      text: "",
      time: null,
    },
  ],
  prevMsg: {
    messages: [],
    loading: false,
    error: null,
    skeletonImage: true,
  },
}

export const getCounts = createAsyncThunk("getCounts", async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_Backend_Url}/get_unread_counts`,
      {
        method: "GET",
        credentials: "include",
      }
    )
    const data = await res.json()
    console.log("unreadMesaages", data)
  } catch (error) {
    console.log(error)
  }
})

export const loadPriviousChat = createAsyncThunk(
  "loadPriviousMsg",
  async ({roomId, currentId}: {roomId: any; currentId?: any}) => {
    if (!roomId || !currentId) {
      console.error("Missing required data:", {roomId, currentId})
      return []
    }
    try {
      console.log("loadPriviousMsg this is called", roomId, currentId)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_Url}/get_message/${roomId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      const data = await res.json()
      console.log("bhosdike room id ", roomId, currentId)
      console.log("bkl2", data)
      const transFormData = data.data.messages.map((message: any) => ({
        id: message.id,
        text: message.content,
        fromMe: message.senderId === currentId,
        time: new Date(message.createdAt).toLocaleTimeString(),
        senderName: message.senderName,
        userImage: message.userImage,
        media: message.media,
        senderId: message.senderId,
      }))
      console.log("BKL", transFormData)
      return transFormData
    } catch (error) {}
  }
)
export const sendMessageThunk = createAsyncThunk(
  "sendMessage",
  async ({
    image,
    roomId,
    content,
  }: {
    image?: any
    roomId: any
    content?: any
  }) => {
    const formData = new FormData()
    formData.append("content", content)
    formData.append("roomId", roomId)
    if (image) {
      formData.append("image", image)
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_Url}/send_message`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      )
      const data = await res.json()
      console.log("data after sending message", data)
      return data
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }
)
const messageSlice = createSlice({
  name: "messageSlice",
  initialState,
  reducers: {
    addPerson: (state, action) => {
      state.chat = action.payload
    },
    addMessage: (state, action) => {
      state.message.push(action.payload)
    },
    clearMessages: state => {
      state.message = []
    },
  },
  extraReducers: builder => {
    builder.addCase(getCounts.fulfilled, (state, action) => {
      state.unReadMessage = action.payload
    })
    builder.addCase(loadPriviousChat.fulfilled, (state, action) => {
      if (action.payload) {
        state.message = action.payload
      }
    })
  },
})

export const messageReducer = messageSlice.reducer
export const {addPerson, addMessage, clearMessages} = messageSlice.actions
