const cA = require("./../Utils/catchAsync");
const pptModel = require("./../model/pptTeacher");

exports.sendAllPPT = cA(async (req, res, next) => {
  const ppts = await pptModel.find({ approved: true });

  res.status(200).json({
    status: "success",
    ppts,
  });
});

exports.selectedClass = cA(async (req, res, next) => {
  const ppts = await pptModel.find({ approved: true, class: req.params.class });

  res.status(200).json({
    status: "success",
    ppts,
  });
});
