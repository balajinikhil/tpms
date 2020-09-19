const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const cA = require("./../Utils/catchAsync");
const teacherModel = require("./../model/teacherModel");
const AppError = require("./../Utils/appError");

// jwt token
const createToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SCERET, {
    expiresIn: "90d",
  });
};
const cookieOptions = {
  expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

exports.loginPOST = cA(async (req, res, next) => {
    
  const emailIp = req.body.email;
  const passwordIp = req.body.password;

  const teacher = await teacherModel.findOne({
    email: emailIp,
  });

  if(!teacher){

    res.status(404).json({
      status:"fail",
      message:"check email and password"
    })

  }

  else if (await !teacher.emailVerifed) {
    
    res.status(401).json({
      status:"fail",
      message:"Please verify your email"
    })

  } else if (
    emailIp &&
    (await teacher.checkPassword(passwordIp, teacher.password))
  ) {

    //SEND COOKIES
    const token = await createToken(teacher._id);
    res.cookie("teach", token, cookieOptions);
    res.status(200).json({
      status:"success",
      redirect:"/teacher/teacher-ppt"
    })

  } else {

    res.status(401).json({
      status:"fail",
      message:"check email and password"
    })

  }
});

exports.protect = cA(async (req, res, next) => {
  const token = req.cookies.teach;
  if (!token) {
    next(new AppError("please login again", 401));
  }

  const jwtPromise = promisify(jwt.verify);
  let decoded = await jwtPromise(token, process.env.JWT_SCERET);

  const user = await teacherModel.findById(decoded.id);

  if (user.blocked) {
    next(
      new AppError("User is blocked you cannot use this service anyomore", 403)
    );
  }

  if (!user) {
    next(new AppError("user dosenot exists anymore login again", 402));
  }
  req.user = user;
  res.locals.user = user;
  next();
});

exports.resetPassword = cA(async (req, res, next) => {
  const token = req.params.token;

  const teacher = await teacherModel.findOne({ forgotPasswordToken: token });

  if (!teacher) {
    next(new AppError("url doesn't exists", 403));
  } else {
    res.status(200).render("passwordUpdate", {
      email: teacher.email,
    });
  }
});

exports.updatePassword = cA(async (req, res, next) => {
  const usrEmail = req.body.email;
  const newPass = req.body.password;
  const confirmNewPass = req.body.passwordConfirm;

  const teacher = await teacherModel.findOneAndUpdate({
    email: req.body.email,
  });

  if (newPass == confirmNewPass) {
    teacher.password = req.body.password;
    teacher.passwordConfirm = req.body.passwordConfirm;
    teacher.save();

    res.status(200).redirect("/login");
  } else {
    next(new AppError("password does not match", 401));
  }
});

exports.logout = cA(async (req, res, next) => {
  res.cookie("teach", "axasxasx", cookieOptions);
  res.status(200).redirect("/login");
});
