const mongoose = require("mongoose");
const slugify = require("slugify");

const pptTeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "ppt must have name"],
  },
  email: {
    type: String,
    required: [true, "ppt uploader must have an email"],
  },
  class: {
    type: Number,
    required: [true, "ppt must have class"],
  },
  language: {
    type: String,
    required: [true, "ppt must have a language"],
  },
  notes: {
    type: String,
    required: [true, "ppt must have few notes"],
  },
  ppt: {
    type: String,
  },
  slug: {
    type: String,
    unique: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  uploadedOn: {
    type: Date,
    default: Date.now(),
  },
  teacherPath: {
    type: String,
  },
  dislike:{
    type:Number,
    default:0
  },
  format:{
    type:String,
    
  }
});

pptTeacherSchema.pre("save", function (next) {
  this.slug = slugify(this.ppt, {
    lower: true,
  });

  next();
});

pptTeacherSchema.pre("save", function (next) {
  this.teacherPath = this.ppt;
  next();
});

const pptTeacherModel = mongoose.model("ppt", pptTeacherSchema);

module.exports = pptTeacherModel;
