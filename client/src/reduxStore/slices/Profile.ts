import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"

const initialState = {
  logoutSuccess: null,
}
export const updateProfile = createAsyncThunk(
  "updateProfile",
  async ({name, email}: {name?: string; email?: string}) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_Url}/update_profile`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({name, email}),
        }
      )
      const data = await res.json()
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
)

export const logoutUser = createAsyncThunk("logoutuser", async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_Backend_Url}/logout`, {
      method: "POST",
      credentials: "include",
    })
    const data = await res.json()
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
  }
})

export const accountDelete = createAsyncThunk("accountDelete", async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_Backend_Url}/accout_delete`,
      {
        method: "POST",
        credentials: "include",
      }
    )
    const data = await res.json()
    console.log(data)
  } catch (error) {
    console.log(error)
  }
})

const profileSlice = createSlice({
  name: "profileSlice",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.logoutSuccess = action.payload.success
    })
  },
})

export const ProfileSliceReducer = profileSlice.reducer
