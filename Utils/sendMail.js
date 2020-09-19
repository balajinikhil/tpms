const nodemailer = require("nodemailer");
const catchAsyn = require("./catchAsync");

exports.emailAuthMail = catchAsyn(async (opt) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: opt.email,
    subject: `S Activation link`,
    text: `Hi ${opt.name}, click on https://amedemo.herokuapp.com/teacher/link/${opt.emailAuthToken} to activate your account, If you did not trigerr this action please ignore `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
});

exports.forgotPasswordMail = catchAsyn(async (opt, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: opt.email,
    subject: `Forgot Password link`,
    text: `Hi ${opt.name}, click on https://amedemo.herokuapp.com/forgot-password/reset/${token} to reset your password `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
});

exports.issueMessage = catchAsyn(async(opt)=>{

  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:process.env.EMAIL_ID,
      pass:process.env.EMAIL_PASSWORD,
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  const mailOptions = {
    from:process.env.EMAIL_ID,
    to:opt.email,
    subject:"Issue with PPT",
    text : opt.message
  };

  transporter.sendMail(mailOptions, (err,info)=>{
    if(err) console.log(err);
    else console.log(info);
  })

})
