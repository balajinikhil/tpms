const router = require("express").Router();
const adminController = require("./../controller/adminController");
const fileUpload = require("./../controller/fileUpload");

// router.post("/add-admin", adminController.addAdminPOST);
router.use(adminController.adminProtect);

router.get("/", adminController.adminDashboardGET);

router.route("/teacher-management").get(adminController.teacherManagementGET);

router.get("/teacher-management/block/:slug", adminController.blockTeacher);
router.get("/teacher-management/unblock/:slug", adminController.unblockTeacher);

router.get(
  "/teacher-management/ppt/:slug",
  adminController.getParticularTeacherPPT
);

router.get("/ppt-pending", adminController.pptPendingGET);
router.get("/admin-reupload/:ppt", adminController.reUploadGET);

router.post(
  "/ppt-reupload",
  fileUpload.teacherPPT,
  adminController.reUploadPOST
);

router.get("/approvePPT/:ppt", adminController.approvePPT);
router.get("/unapprovePPT/:ppt", adminController.unapprovePPT);

router.get("/ppt-approved", adminController.pptAprovedGET);
router.get("/admin-logout", adminController.adminLogout);
router.post("/admin-pas-update", adminController.adminUpdatePassword);

router.get('/issues', adminController.issuesRender);

module.exports = router;
