const router = require("express").Router();
const apiController = require("./../controller/apiController");

router.get("/ppt", apiController.sendAllPPT);
router.get("/sel-class/:class", apiController.selectedClass);
module.exports = router;
