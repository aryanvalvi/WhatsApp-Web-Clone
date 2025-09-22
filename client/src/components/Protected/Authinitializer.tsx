"use client"
import {useAppDispatch} from "@/reduxStore/hook/customHookReducer"
import {authCheckFunction} from "@/reduxStore/slices/LoginSlice"

import React, {useEffect} from "react"

const Authinitializer = ({children}: {children: React.ReactNode}) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(authCheckFunction())
  }, [dispatch])
  return <div>{children}</div>
}

export default Authinitializer
