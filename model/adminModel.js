const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Admin must have name"],
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 12,
  },
});

adminSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.checkPassword = async function (pass, reqpass) {
  return await bcrypt.compare(pass, reqpass);
};

const adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;
