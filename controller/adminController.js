const fs = require("fs");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const cA = require("./../Utils/catchAsync");
const adminModel = require("./../model/adminModel");
const AppError = require("./../Utils/appError");
const teacherModel = require("./../model/teacherModel");
const pptModel = require("./../model/pptTeacher");
const Issues = require('../model/issueModal');

const createToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SCERET, {
    expiresIn: "90d",
  });
};
const cookieOptions = {
  expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

// exports.addAdminPOST = cA(async (req, res, next) => {
//   const admin = await adminModel.create(req.body);

//   res.status(201).json({
//     status: "success",
//     admin,
//   });
// });

exports.adminLogin = cA(async (req, res, next) => {
  let username = req.body.email;
  let password = req.body.password;

  const admin = await adminModel.findOne({
    username: username,
  });

  if (admin && (await admin.checkPassword(password, admin.password))) {
    const token = await createToken(admin._id);
    res.cookie("usrpptAdmin", token, cookieOptions);

    // res.status(200).redirect("/usrAdmin");

    res.status(200).json({
      status:"success",
      redirect:"/usrAdmin"
    })


  } else {
    next();
  }
});

exports.adminProtect = cA(async (req, res, next) => {
  const token = req.cookies.usrpptAdmin;
  if (!token) {
    next(new AppError("please login again", 401));
  }

  const jwtPromise = promisify(jwt.verify);
  let decoded = await jwtPromise(token, process.env.JWT_SCERET);

  const user = await adminModel.findById(decoded.id);

  if (!user) {
    next(new AppError("user dosenot exists anymore login again", 402));
  }
  req.usrAdmin = user;
  res.locals.usrAdmin = user;
  next();
});

exports.adminDashboardGET = cA(async (req, res, next) => {
  res.status(200).render("admin_home", {
    admin: req.usrAdmin,
  });
});

exports.teacherManagementGET = cA(async (req, res, next) => {
  const teachers = await teacherModel.find().sort("-createdOn");

  res.status(201).render("admin_teacher", {
    teachers,
  });
});

exports.blockTeacher = cA(async (req, res, next) => {
  const slug = req.params.slug;

  const teacher = await teacherModel.findOneAndUpdate(
    { slug: slug },
    { blocked: true }
  );

  res.status(200).redirect("/usrAdmin/teacher-management");
});

exports.unblockTeacher = cA(async (req, res, next) => {
  const slug = req.params.slug;

  const teacher = await teacherModel.findOneAndUpdate(
    { slug: slug },
    { blocked: false }
  );

  res.status(200).redirect("/usrAdmin/teacher-management");
});

exports.getParticularTeacherPPT = cA(async (req, res, next) => {
  const ppts = await pptModel.find({ email: req.params.slug }).sort("-uploadedOn");

  res.status(200).render("admin_indPPt", {
    ppts,
    name: req.params.slug,
  });
});

exports.pptPendingGET = cA(async (req, res, next) => {
  const ppts = await pptModel.find({ approved: false }).sort("-uploadedOn");

  res.status(200).render("admin_pendingPPT", {
    ppts,
  });
});

exports.reUploadGET = cA(async (req, res, next) => {
  const ppt = await pptModel.findOne({ ppt: req.params.ppt });
  res.status(200).render("admin_reupload", {
    ppt,
  });
});

exports.reUploadPOST = cA(async (req, res, next) => {
  const newPPT = req.file.filename;
  const slug = req.body.slug;
  //   const delFile = req.body.prev;

  //   fs.unlink(`./public/teacherUploads/${delFile}`, () => {
  //     console.log("file deleted");
  //   });

  const ppt = await pptModel.findOneAndUpdate({ slug: slug }, { ppt: newPPT });

  res.status(201).redirect("/usrAdmin/ppt-pending");
});

exports.approvePPT = cA(async (req, res, next) => {
  const ppt = await pptModel.findOneAndUpdate(
    { ppt: req.params.ppt },
    { approved: true }
  );

  res.status(201).redirect("/usrAdmin/ppt-pending");
});

exports.pptAprovedGET = cA(async (req, res, next) => {
  const ppts = await pptModel.find({ approved: true }).sort("-uploadedOn");

  res.status(200).render("admin_approvedPPT", {
    ppts,
  });
});

exports.unapprovePPT = cA(async (req, res, next) => {
  const ppt = await pptModel.findOneAndUpdate(
    { ppt: req.params.ppt },
    { approved: false }
  );

  res.status(200).redirect("/usrAdmin/ppt-approved");
});

exports.adminLogout = cA(async (req, res, next) => {
  res.cookie("usrpptAdmin", "axasxasx", cookieOptions);
  res.status(200).redirect("/login");
});

exports.adminUpdatePassword = cA(async (req, res, next) => {
  const admin = await adminModel.findOne({ username: req.body.username });
  admin.password = req.body.password;
  admin.save();

  res.status(201).redirect("/login");
});

exports.issuesRender = cA(async(req,res,next)=>{
  const issues = await Issues.find().sort("-createdOn")

  res.status(200).render('admin_issues',{
    issues,
  })
})