import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"

export type User = {
  email: string
  exp: number
  iat: number
  id: string
  name: string
  userImage: string
}

type AuthState = {
  user: User | null
  loading: boolean
  error: string | null
  message: string | null
  success: boolean | null
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
  message: null,
  success: null,
}

export const verificationEmail = createAsyncThunk(
  "verificationEmail",
  async ({name, email, password}: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_Url}/verificationemail`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({name, email, password}),
        }
      )
      const data = await res.json()
      console.log(data)
      return data
    } catch (error) {
      console.log(error)
    }
  }
)

// Register function
export const registerFunction = createAsyncThunk(
  "auth/register",
  async ({
    email,
    password,
    name,
    image,
  }: {
    email: string
    password: string
    name: string
    image?: any
  }) => {
    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)
      formData.append("name", name)
      if (image) {
        formData.append("image", image)
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_Url}/register`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      )

      const data = await res.json()
      return data
    } catch (error) {
      throw error
    }
  }
)

// Login function
export const loginFunction = createAsyncThunk(
  "auth/login",
  async ({email, password}: {email: string; password: string}) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_Backend_Url}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({email, password}),
      })

      const data = await res.json()
      console.log("login", data)
      return data
    } catch (error) {
      throw error
    }
  }
)

// Auth check function
export const authCheckFunction = createAsyncThunk(
  "auth/check",
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
      console.log("auth/check", data)
      return data
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: state => {
      state.error = null
    },
    clearMessage: state => {
      state.message = null
    },
    logout: state => {
      state.user = null
      state.error = null
      state.message = null
      state.loading = false
    },
    resetStatus: state => {
      state.success = null
      state.error = null
      state.message = null
    },
  },
  extraReducers: builder => {
    // Register cases
    builder
      .addCase(registerFunction.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(registerFunction.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.message = action.payload.message
        state.error = action.payload.error
      })
      .addCase(registerFunction.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Registration failed"
      })

    // Login cases
    builder
      .addCase(loginFunction.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(loginFunction.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.message = action.payload.message
        state.error = action.payload.error
      })
      .addCase(loginFunction.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Login failed"
      })

    // Auth check cases
    builder
      .addCase(authCheckFunction.pending, state => {
        state.loading = true
      })
      .addCase(authCheckFunction.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user || action.payload
        state.error = null
      })
      .addCase(authCheckFunction.rejected, state => {
        state.loading = false
        state.user = null
        state.error = null // Don't show error for auth check failures
      })

    builder.addCase(verificationEmail.fulfilled, (state, action) => {
      state.success = action.payload.success
      state.error = action.payload.error
    })
  },
})

export const {clearError, clearMessage, logout, resetStatus} = authSlice.actions
export const authReducer = authSlice.reducer
