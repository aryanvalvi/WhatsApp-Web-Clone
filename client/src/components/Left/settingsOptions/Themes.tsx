import React from "react"
import {themes} from "./util/themes"
import Image from "next/image"
import {setActiveTab, setActiveTheme} from "@/reduxStore/slices/DashboardSlice"
import {useAppDispatch} from "@/reduxStore/hook/customHookReducer"
const Themes = () => {
  const dispatch = useAppDispatch()
  return (
    <div>
      <div className="grid grid-cols-3 w-full ">
        <div
          onClick={() => dispatch(setActiveTheme(null))}
          className="bg-black h-30 w-30 border-1 border-neutral-700 flex items-center justify-center hover:scale-105 transition duration-200 cursor-pointer"
        >
          <p>Default</p>
        </div>
        {themes.map(img => {
          return (
            <>
              <div
                onClick={() => dispatch(setActiveTheme(img.img))}
                key={img.id}
                className=""
              >
                <Image
                  src={img.img}
                  width={100}
                  height={100}
                  alt="themes"
                  className="h-30 w-30 m-2 blur-[0.7px] cursor-pointer border-1 border-neutral-700 hover:scale-105 transition duration-200 "
                ></Image>
              </div>
            </>
          )
        })}
      </div>
    </div>
  )
}

export default Themes
