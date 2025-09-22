"use client"
import React, {useState} from "react"
import SignIn from "./SignIn"
import SignUp from "./SignUp"

export type AuthWrapperProps = {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>
}
const AuthWrapper = ({setShowLogin}: AuthWrapperProps) => {
  const [showSignUp, setShowSignUp] = useState(false)

  if (showSignUp) {
    return <SignUp setShowLogin={setShowLogin} setShowSignUp={setShowSignUp} />
  }

  return <SignIn setShowLogin={setShowLogin} setShowSignUp={setShowSignUp} />
}

export default AuthWrapper
