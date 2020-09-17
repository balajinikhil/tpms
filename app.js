const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

// OWN MODULES
const AppError = require("./Utils/appError");
const globalErrorHandler = require("./controller/errorController");
const viewRoutes = require("./routes/viewRouter");
const teacherRoutes = require("./routes/teacherRoutes");
const adminRoutes = require("./routes/adminRoutes");
const apiRouter = require("./routes/apiRoutes");

const app = express();

// VIEW ENGINE PUG
app.set("view engine", "pug");
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views/admin"),
]);

// cors
app.use(cors());
app.options("*", cors());

//SERVING STATIC fILES
app.use(express.static(path.join(__dirname, "/public")));

// Set security HTTP headers
app.use(helmet());

// limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/", limiter);

//URL ENCODE DATA
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use(cookieParser());

// data-sanitization, code-injection
app.use(mongoSanitize());
app.use(xss());

// params pollution
app.use(
  hpp({
    whitelist: [
      //  array of vals
    ],
  })
);

if (process.env.NODE_ENV == "development") app.use(morgan("dev"));
//UI
app.use("/", viewRoutes);

//Teacher Section
app.use("/teacher", teacherRoutes);

// Admin Section
app.use("/usrAdmin", adminRoutes);

// API routes
app.use("/api-v1", apiRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
