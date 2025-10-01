import {createSlice, PayloadAction} from "@reduxjs/toolkit"
const initialState: string[] = []
const OnlineUser = createSlice({
  name: "onlineUser",
  initialState,
  reducers: {
    addUserOnline: (state, action: PayloadAction<string>) => {
      if (!state.includes(action.payload)) {
        state.push(action.payload)
      }
    },
    removeOnlineFriend: (state, action: PayloadAction<string>) => {
      return state.filter(id => id !== action.payload)
    },
    setOnlineUsersList: (state, action: PayloadAction<string[]>) => {
      return action.payload
    },
  },
})
export const OnlineUserReducer = OnlineUser.reducer
export const {addUserOnline, removeOnlineFriend, setOnlineUsersList} =
  OnlineUser.actions
