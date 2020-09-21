const router = require("express").Router();
const teacherController = require("./../controller/teacherController");
const authController = require("./../controller/authController");
const fileStorage = require("./../controller/fileUpload");

router.get("/", teacherController.teacherSignUpGET);
router.post("/sign-up", fileStorage.profilePic, teacherController.teacherSignUpPOST);
router.get("/link/:emailAuthToken", teacherController.confirmEmail);

router.use(authController.protect);

router.get("/teacher-ppt", teacherController.teacherAddPPTGET);
router.post(
  "/teacher-ppt-upload",
  fileStorage.teacherPPT,
  teacherController.teacherAddPPTPOST
);
router.get("/logout", authController.logout);

router.get("/update-info/:email", teacherController.updateTeacherDataGET);
router.post("/update-teacher-data", teacherController.updateTeacherDataPOST);

router.post("/update-profile-pic", fileStorage.updateProfile, teacherController.updateProfilePic)

module.exports = router;
