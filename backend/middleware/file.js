const multer = require("multer");

const MIME_TYPE_IMAGE = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'

};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_IMAGE[file.mimetype];
    let error = new Error("Invalid images extension");
    if (isValid) {
      error = null;
    }
    cb(error, "images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_IMAGE[file.mimetype];
    cb(null, name + '-' + Date.now() + "." + ext);
  }
});

module.exports =  multer({ storage: storage }).single("image");
