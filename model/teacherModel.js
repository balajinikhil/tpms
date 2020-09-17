const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const slugify = require("slugify");

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "teacher must have name"],
  },
  email: {
    type: String,
    validate: validator.isEmail,
    required: [true, "teacher must have email"],
    unique: true,
  },
  phone: {
    type: Number,
    required: [true, "teacher must have number"],
  },
  designation: {
    type: String,
    required: [true, "teacher must have designation"],
  },
  school: {
    type: String,
    required: [true, "teacher must have school"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password is not matching",
    },
  },
  emailAuthToken: {
    type: String,
  },
  emailVerifed: {
    type: Boolean,
    default: false,
  },
  slug: {
    type: String,
  },
  forgotPasswordToken: {
    type: String,
  },
  forgotPasswordTokenExpire: {
    type: String,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  createdOn:{
    type:Date,
    default:Date.now()
  }
});

teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

teacherSchema.pre("save", async function (next) {
  const authToken = await crypto.randomBytes(32).toString("hex");
  this.emailAuthToken = authToken;
});

teacherSchema.methods.checkPassword = async function (pass, reqpass) {
  return await bcrypt.compare(pass, reqpass);
};

teacherSchema.pre("save", function (next) {
  this.slug = slugify(this.email, {
    lower: true,
  });
  next();
});

teacherSchema.methods.forgotPassword = async function () {
  const resetToken = await crypto.randomBytes(32).toString("hex");
  this.forgotPasswordToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //   //sets 10 min expire time                  m*sec*milisec
  //   this.forgotPasswordTokenExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const teacherModel = mongoose.model("teacher", teacherSchema);

module.exports = teacherModel;
