"use client"
import {useAppSelector} from "@/reduxStore/hook/customHookReducer"
import {useRouter} from "next/navigation"
import React, {useEffect, useState} from "react"

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const router = useRouter()
  const {user, loading} = useAppSelector(state => state.authReducer)

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  // console.log(user, loading, isMounted)
  useEffect(() => {
    if (isMounted && !loading && !user) {
      router.push("/")
    }
  }, [isMounted, user, loading, router])
  if (!isMounted || loading) {
    return <>Loading....</>
  }
  if (!user) {
    return null
  }
  return <div>{children}</div>
}

export default ProtectedRoute
