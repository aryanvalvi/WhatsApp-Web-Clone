import Image from "next/image"
import React, {useEffect, useState} from "react"
import {MdOutlineAddAPhoto} from "react-icons/md"
import Cropper from "react-easy-crop"
import {getCroppedImage} from "./getCroppedImage"
import {useAppDispatch} from "@/reduxStore/hook/customHookReducer"
import {registerFunction} from "@/reduxStore/slices/LoginSlice"
export type Props = {
  setShowCross: React.Dispatch<React.SetStateAction<boolean>>
  name: string
  email: string
  password: any
}
const ExtraSignUp = ({setShowCross, name, email, password}: Props) => {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [crop, setCrop] = useState({x: 0, y: 0})
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [finalCroppedImage, setFinalCroppedImage] = useState<string | null>(
    null
  )
  const [fileImage, setFileImage] = useState<File | null>(null)
  const dispatch = useAppDispatch()
  console.log("File image", fileImage)

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
    dispatch(registerFunction({email, password, name, image: fileImage}))
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

  return (
    <div className="flex flex-col items-center justify-center space-y-4  mx-auto max-w-md px-4">
      <p className="text-white text-sm">
        {finalCroppedImage ? (
          <p className="text-lg font-bold">Final Submission </p>
        ) : (
          "Upload a photo"
        )}
      </p>

      {preview ? (
        <div className="flex flex-col items-center space-y-4">
          {finalCroppedImage ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src={finalCroppedImage}
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
      {finalCroppedImage ? (
        <button
          onClick={handleUpload}
          className="w-full py-1 sm:py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3 text-sm sm:text-base"
        >
          Create Account
        </button>
      ) : (
        <button className="text-neutral-500 text-sm hover:text-white transition-colors">
          skip for now
        </button>
      )}

      {/* <h1 className="text-white">Hello</h1> */}
    </div>
  )
}

export default ExtraSignUp
