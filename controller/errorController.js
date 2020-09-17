module.exports = (err, req, res, next) => {
  if ((process.env.NODE_ENV = "development")) console.log(err);

  err.statusCode = err.statusCode || 500;

  if (err.message.includes("jwt malformed")) {
    err.message = "Login Again";
  } else if (
    err.message.includes("Cannot read property 'emailVerifed' of null")
  ) {
    err.message = "User does not exist login again";
  }

  res.status(200).render("__error", {
    err
  })

  // res.status(err.statusCode).json({
  //   status: err.status,
  //   message: err.message,
  //   stack: err.stack,
  // });

  //   if (process.env.NODE_ENV == "production") {
  //     err.message == "Something went wrong";
  //   }
  //   res.status(err.statusCode).render("error", {
  //     title: "Oops",
  //     message: err.message,
  //     statusCode: err.statusCode,
  //   });
};
