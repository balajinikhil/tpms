const fs = require("fs");
const jwt = require("jsonwebtoken");
const cA = require("./../Utils/catchAsync");
const teacherModel = require("./../model/teacherModel");
const sendMail = require("./../Utils/sendMail");
const AppError = require("./../Utils/appError");
const teacherPPTModel = require("./../model/pptTeacher");
const { findOneAndUpdate } = require("./../model/teacherModel");

const createToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SCERET, {
    expiresIn: "90d",
  });
};
const cookieOptions = {
  expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

exports.teacherSignUpGET = cA(async (req, res, next) => {
  res.status(200).render("teacher-signup");
});

exports.teacherSignUpPOST = cA(async (req, res, next) => {

  let filename;

  if(req.file) filename = req.file.filename 
  
  

  const creatObj ={...req.body, pic:filename }
  const newTeach = await teacherModel.create(creatObj);

  //   res.status(201).json({
  //     status: "success",
  //     newTeach,
  //   });
  await sendMail.emailAuthMail(newTeach);

  res.status(201).render("checkMail");
});

exports.confirmEmail = cA(async (req, res, next) => {
  let token = req.params.emailAuthToken;

  const teacher = await teacherModel.findOneAndUpdate(
    {
      emailAuthToken: token,
    },
    { emailVerifed: true }
  );

  if (!teacher) {
    next(new AppError("Please login again", 401));
  } else {
    const token = await createToken(teacher._id);
    res.cookie("teach", token, cookieOptions);

    res.status(200).redirect("/teacher/teacher-ppt");
  }
});

exports.teacherAddPPTGET = cA(async (req, res, next) => {
  const teacher = req.user;
  const teacherPPT = await teacherPPTModel.find({
    email: teacher.email,
  }).sort("-uploadedOn");

  res.status(200).render("teacherPPT", {
    teacher,
    teacherPPT,
  });
});

// UPLOAD PPT 
exports.teacherAddPPTPOST = cA(async (req, res, next) => {
  
  const file = req.file.filename.split('.')

  let obj = {
    name: req.body.name,
    email: req.body.email,
    class: req.body.class,
    language: req.body.language,
    notes: req.body.notes,
    ppt: req.file.filename,
    format:file[file.length -1]
  };

  const pptTeach = await teacherPPTModel.create(obj);

  //   res.send(pptTeach);
  res.status(201).redirect("/teacher/teacher-ppt");
});


// EDIT TEACHER INFO PAGE RENDER
exports.updateTeacherDataGET = cA(async (req, res, next) => {
  const email = req.params.email;

  const teacher = await teacherModel.findOne({ email: email });

  res.status(200).render("updateTeacherInfo", {
    teacher,
  });
});


//EDIT TEACHER INFO POST
exports.updateTeacherDataPOST = cA(async (req, res, next) => {
  let email = req.body.email;
  let obj = {
    name: req.body.name,
    phone: req.body.phone,
    designation: req.body.designation,
    school: req.body.school,
  };

  const teacher = await teacherModel.findOneAndUpdate({ email: email }, obj);

  res.status(202).redirect("/teacher/teacher-ppt");
});

// UPDATE PROFILE UPDATE PROFILE PIC
exports.updateProfilePic = cA(async(req,res,next)=>{

  const del = await teacherModel.findOne({email:req.body.email});

  if(del.ppt != "default-profile.jpg"){
    fs.unlink(`./public/images/profile/${del.pic}`, function(err){
      if(err) return console.log(err);
      console.log('file deleted successfully');
    });  
}

  const teacher = await teacherModel.findOneAndUpdate({
    email:req.body.email
  }, 
  {pic:req.file.filename}
  )

  res.redirect(`/teacher/update-info/${req.body.email}`)

})