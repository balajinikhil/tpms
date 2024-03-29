const cA = require("./../Utils/catchAsync");
const teacherModel = require("./../model/teacherModel");
const AppError = require("../Utils/appError");
const mailer = require("./../Utils/sendMail");
const pptModel = require("./../model/pptTeacher");
const Issues = require('../model/issueModal');


exports.homePage = cA(async (req, res, next) => {
  const ppts = await pptModel.find();

  res.status(200).render("home", {
    ppts,
  });
});

exports.loginGET = cA(async (req, res, next) => {
  res.status(200).render("login");
});

exports.forgotPasswordGET = cA(async (req, res, next) => {
  res.status(200).render("forgotPassword");
});

exports.forgotPasswordPOST = cA(async (req, res, next) => {
  usrEmail = req.body.email;

  //update token after this only
  const teacher = await teacherModel.findOne({ email: usrEmail });

  if (!teacher) {
    next(new AppError("Email does not exists", 404));
  } else {
    const tokenGen = await teacher.forgotPassword();
    await teacher.save({
      validateBeforeSave: false,
    });

    await mailer.forgotPasswordMail(teacher, teacher.forgotPasswordToken);

    res.status(200).render("checkMail");
  }
});

exports.selectedClassRender = cA(async (req, res, next) => {
  const ppts = await pptModel.find({ approved: true, class: req.params.class });

  res.status(200).render("class_selected", {
    ppts,
    clasz: req.params.class,
  });
});

exports.viewPPTlive = cA(async (req, res, next) => {
  const ppt = req.params.ppt
  const pptz = await pptModel.findOne({ppt:req.params.ppt})
  const teacher = await teacherModel.findOne({email:pptz.email});

  res.status(200).render("viewPPTlive", {
    ppt,
    pptz,
    teacher 
  });
  
});

exports.dislikePPT = cA(async(req,res,next)=>{

  const ppt = await pptModel.findOne({ppt:req.params.ppt});
  

  if(req.cookies.dislikePPT === ppt.ppt){
    res.status(200).json({
      status:'error',
      dislike: ppt.dislike,
    })
  }
  
  else{
    const pptz = await pptModel.findOneAndUpdate({ppt:req.params.ppt}, {dislike:ppt.dislike + 1})
      res.cookie(`dislikePPT`, `${ppt.ppt}`, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      res.status(200).json({
        status:'updated',
        dislike: pptz.dislike + 1
      })
  }

})


exports.issueSubmit = cA(async(req,res,next)=>{

  const ppt = await pptModel.findOne({ppt:req.body.ppt});

  const obj = {...req.body, name:ppt.name}

  const issue = await Issues.create(obj);

  mailer.issueMessage({
    email:'balajinikhil96@gmail.com',
    message:`Issue with ${req.body.message} with ${req.body.ppt}`
  })

  res.status(201).json({
    status:"reported",
    issue
  })
})