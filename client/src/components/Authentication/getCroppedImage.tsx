import {Area} from "react-easy-crop"

export const getCroppedImage = async (
  img: string,
  crop: Area,
  fileName = "cropped-image.jpg"
): Promise<File> => {
  const image = new Image()
  image.src = img

  return new Promise<File>((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return reject(new Error("Failed to get canvas context"))

      canvas.width = crop.width
      canvas.height = crop.height

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      )

      canvas.toBlob(
        blob => {
          if (!blob) return reject(new Error("Failed to create blob"))

          const file = new File([blob], fileName, {
            type: "image/jpeg",
            lastModified: Date.now(),
          })

          resolve(file)
        },
        "image/jpeg",
        0.9
      )
    }

    image.onerror = () => reject(new Error("Failed to load image"))
  })
}
