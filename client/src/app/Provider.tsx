"use client"
import {
  useAppDispatch,
  useAppSelector,
} from "@/reduxStore/hook/customHookReducer"
// import {verificationFunction} from "@/reduxStore/slices/LoginSlice"
import {store} from "@/reduxStore/store/store"
import {useEffect, useRef} from "react"
import {Provider} from "react-redux"
interface Children {
  children: React.ReactNode
}
const ReduxProvider = ({children}: Children) => {
  return (
    <Provider store={store}>
      {/* <AuthChecker></AuthChecker> */}
      {children}
    </Provider>
  )
}
// const AuthChecker = () => {
//   const dispatch = useAppDispatch()
//   const isInitilized = useRef(false)
//   useEffect(() => {
//     if (!isInitilized.current) {
//       dispatch(verificationFunction())
//       isInitilized.current = true
//     }
//   }, [dispatch])
//   const state = useAppSelector(state => state.SignupReducer)

//   return null
// }

export default ReduxProvider
