import {createSlice} from "@reduxjs/toolkit"

const initialState = {
  activeTab: "chat",
  activeTheme: null,
}
const dashBoardSlice = createSlice({
  name: "dahboardSlice",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    },
    setActiveTheme: (state, action) => {
      state.activeTheme = action.payload
    },
  },
})

export const dashBoardReducer = dashBoardSlice.reducer
export const {setActiveTab, setActiveTheme} = dashBoardSlice.actions
