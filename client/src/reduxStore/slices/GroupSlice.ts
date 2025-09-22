import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"

const initialState: any = {}
export const createGroup = createAsyncThunk(
  "createGroup",
  async ({groupName, groupDescription, members}: any) => {
    console.log("called")
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_Url}/create_group`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({groupName, groupDescription, members}),
        }
      )
      const data = await res.json()
      console.log(data)
      return data
    } catch (error) {}
  }
)

const GroupSlice = createSlice({
  name: "GroupSlice",
  initialState,
  reducers: {},
  extraReducers: builder => {},
})

export const groupSlice = GroupSlice.reducer
