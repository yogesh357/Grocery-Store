import multer from "multer";


// we will use this to upload images to cloudinary.
export const upload = multer({ storage: multer.diskStorage({}) })