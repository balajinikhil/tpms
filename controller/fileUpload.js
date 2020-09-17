const multer = require("multer");
const cA = require("./../Utils/catchAsync");

const pptTeacherStorage = multer.diskStorage({
  destination: "./public/teacherUploads",
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

exports.teacherPPT = multer({
  storage: pptTeacherStorage,
  limits: {
    fieldSize: 10000000,
  },
}).single("ppt-teach");

