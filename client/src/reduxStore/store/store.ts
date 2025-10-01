import {configureStore} from "@reduxjs/toolkit"
import {authReducer} from "../slices/LoginSlice"
import {messageReducer} from "../slices/Message"
import {AuthenticationReducer} from "../slices/Authentication"
import {dashBoardReducer} from "../slices/DashboardSlice"
import {friendSliceAuth} from "../slices/FriendSlice"
import {groupSlice} from "../slices/GroupSlice"
import {ProfileSliceReducer} from "../slices/Profile"
import {OnlineUserReducer} from "../slices/OnlineUsers"

export const store = configureStore({
  reducer: {
    authReducer,
    messageReducer,
    AuthenticationReducer,
    dashBoardReducer,
    friendSliceAuth,
    groupSlice,
    ProfileSliceReducer,
    OnlineUserReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
