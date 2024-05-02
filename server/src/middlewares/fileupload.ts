import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-'+ file.originalname )
  }
})

const upload = multer({storage, limits: {
  fileSize: 1 * 1024 * 250
}});

export default upload;