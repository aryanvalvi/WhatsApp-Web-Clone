import Image from "next/image"
import React, {useEffect, useState} from "react"
import {MdOutlineAddAPhoto} from "react-icons/md"
import Cropper from "react-easy-crop"
import {getCroppedImage} from "./getCroppedImage"
import {
  useAppDispatch,
  useAppSelector,
} from "@/reduxStore/hook/customHookReducer"
import {registerFunction} from "@/reduxStore/slices/LoginSlice"
import {useRouter} from "next/navigation"
export type Props = {
  setShowCross: React.Dispatch<React.SetStateAction<boolean>>
  name: string
  email: string
  password: any
}
const ExtraSignUp = ({setShowCross, name, email, password}: Props) => {
  const user = useAppSelector(state => state.authReducer)
  console.log(user)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null | any>(null)
  const [crop, setCrop] = useState({x: 0, y: 0})
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [skipImage, setSkipImage] = useState(false)
  const [loader, setLoader] = useState(false)
  const [finalCroppedImage, setFinalCroppedImage] = useState<string | null>(
    null
  )
  const [fileImage, setFileImage] = useState<File | null>(null)
  const dispatch = useAppDispatch()
  console.log("File image", fileImage)
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log(file)
    if (file && file.type.startsWith("image/")) {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
      if (finalCroppedImage) {
        URL.revokeObjectURL(finalCroppedImage)
      }
      setImage(file)
      setPreview(URL.createObjectURL(file))
      setFinalCroppedImage(null)
      setFileImage(null)
    }
  }

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    console.log(croppedArea, croppedAreaPixels)
    setCroppedAreaPixels(croppedAreaPixels)
  }
  const handleSaveCrop = async () => {
    console.log("Saving cropped image:", croppedAreaPixels)
    const originalFileName = image?.name || "profile-image.jpg"
    const fileName = `cropped-${originalFileName}`
    const croppedImageFile: File = await getCroppedImage(
      preview!,
      croppedAreaPixels!,
      fileName
    )
    const croppedImageBlob = URL.createObjectURL(croppedImageFile)
    console.log(croppedImageFile)
    console.log("file is ", croppedImageFile)
    setFinalCroppedImage(croppedImageBlob)
    setFileImage(croppedImageFile)

    setShowCross(true)
  }

  const handleCancel = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    if (finalCroppedImage) {
      URL.revokeObjectURL(finalCroppedImage)
    }

    setPreview(null)
    setImage(null)
    setFinalCroppedImage(null)
    setShowCross(true)
  }
  const handleUpload = () => {
    setLoader(true)
    if (skipImage) {
      dispatch(registerFunction({email, password, name, image: false}))
    } else {
      dispatch(registerFunction({email, password, name, image: fileImage}))
    }
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
      if (finalCroppedImage) {
        URL.revokeObjectURL(finalCroppedImage)
      }
    }
  }, [])

  useEffect(() => {
    if (preview) {
      setShowCross(false)
    }
  }, [preview])
  useEffect(() => {
    if (user.user) {
      router.push("/chat")
      setLoader(false)
    }
  }, [user])

  return (
    <div className="flex flex-col items-center justify-center space-y-4  mx-auto max-w-md px-4">
      <p className="text-white text-sm">
        {finalCroppedImage || skipImage ? (
          <p className="text-lg font-bold">Final Submission </p>
        ) : (
          "Upload a photo"
        )}
      </p>

      {preview || skipImage ? (
        <div className="flex flex-col items-center space-y-4">
          {skipImage ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src={"/images/user.svg"}
                width={100}
                height={100}
                alt="avatar"
                className="h-30 w-30 rounded-full object-cover"
              ></Image>
              <p className="text-white text-sm">{name}</p>
              <p className="text-neutral-500 text-sm">{email}</p>
            </div>
          ) : finalCroppedImage ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src={finalCroppedImage || "/images/user.svg"}
                width={300}
                height={300}
                alt="avatar"
                className="h-30 w-30 rounded-full object-contain"
              ></Image>
              <p className="text-white text-sm">{name}</p>
              <p className="text-neutral-500 text-sm">{email}</p>
            </div>
          ) : (
            <>
              <div className="h-100 w-100 relative">
                <Cropper
                  image={preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                ></Cropper>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleSaveCrop}
                  className=" px-4 py-2 bg-[#D93901] text-white rounded-lg hover:bg-[#c33704] transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
          {/* {finalCroppedImage ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src={finalCroppedImage || "/images/user.svg"}
                width={300}
                height={300}
                alt="avatar"
                className="h-30 w-30 rounded-full object-contain"
              ></Image>
              <p className="text-white text-sm">{name}</p>
              <p className="text-neutral-500 text-sm">{email}</p>
            </div>
          ) : (
            <>
              <div className="h-100 w-100 relative">
                <Cropper
                  image={preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                ></Cropper>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleSaveCrop}
                  className=" px-4 py-2 bg-[#D93901] text-white rounded-lg hover:bg-[#c33704] transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )} */}
        </div>
      ) : (
        // <Image
        //   src={preview}
        //   alt="avatar"
        //   width={100}
        //   height={100}
        //   className="h-50 w-50 object-cover "
        // ></Image>

        <label
          className="h-20 w-20 bg-neutral-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-neutral-400 transition-colors"
          htmlFor="image"
        >
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          ></input>
          <MdOutlineAddAPhoto className="text-white text-3xl  "></MdOutlineAddAPhoto>
        </label>
      )}
      {finalCroppedImage || skipImage ? (
        loader ? (
          <div role="status" className="pb-0.5">
            <svg
              aria-hidden="true"
              className="inline w-5 h-5 text-gray-900 animate-spin dark:text-gray-900 fill-gray-900 dark:fill-gray-300"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <button
            onClick={handleUpload}
            className="w-full py-1 sm:py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3 text-sm sm:text-base"
          >
            Create Account
          </button>
        )
      ) : (
        <button
          onClick={() => setSkipImage(true)}
          className="text-neutral-500 text-sm hover:text-white transition-colors"
        >
          skip for now
        </button>
      )}

      {/* <h1 className="text-white">Hello</h1> */}
    </div>
  )
}

export default ExtraSignUp
