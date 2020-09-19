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
  const newTeach = await teacherModel.create(req.body);

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

exports.updateTeacherDataGET = cA(async (req, res, next) => {
  const email = req.params.email;

  const teacher = await teacherModel.findOne({ email: email });

  res.status(200).render("updateTeacherInfo", {
    teacher,
  });
});

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
