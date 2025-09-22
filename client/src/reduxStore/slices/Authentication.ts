import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"

export type User = {
  email: string
  exp: number // Expiration timestamp (typically a UNIX time)
  iat: number // Issued at timestamp
  id: string // User ID
  userName: string
  userImage: string
}
type Userstate = {
  user: User | null
  loading: boolean
}

const initialState: Userstate = {
  user: null,
  loading: true,
}

export const authCheckFunction = createAsyncThunk(
  "authCheckFunction",
  async (_, {rejectWithValue}) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_Url}/authcheck`,
        {
          method: "GET",
          credentials: "include",
        }
      )
      if (!res.ok) {
        throw new Error("Not authenticated")
      }
      const data = await res.json()
      console.log("from authcheck", data)
      return data
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

const protectedRouteSlice = createSlice({
  name: "protectedSlice",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(authCheckFunction.pending, state => {
      state.loading = true
    })
    builder.addCase(authCheckFunction.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user || action.payload
    })
    builder.addCase(authCheckFunction.rejected, state => {
      state.loading = false
      state.user = null
    })
  },
})

export const AuthenticationReducer = protectedRouteSlice.reducer
