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

const profilePicStorage = multer.diskStorage({
  destination:"./public/images/profile",
  filename:function(req,file,cb){
    cb(null, Date.now() + file.originalname);
  }
})

exports.profilePic = multer({
  storage:profilePicStorage,
  limits:{
    fieldSize:10000000
  }
}).single("profile");

const updateProfilePic = multer.diskStorage({
  destination:"./public/images/profile",
  filename:function(req,file,cb){
    cb(null, Date.now() + file.originalname)
  }
})

exports.updateProfile = multer({
  storage:updateProfilePic,
  limits:{
    fieldSize:10000000
  }
}).single("profile");