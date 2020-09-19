const router = require("express").Router();
const viewsController = require("./../controller/viewsController");
const authController = require("./../controller/authController");
const adminController = require("./../controller/adminController");

router.get("/", viewsController.homePage);
router
  .route("/login")
  .get(viewsController.loginGET)
  .post(adminController.adminLogin, authController.loginPOST);

router
  .route("/forgot-password")
  .get(viewsController.forgotPasswordGET)
  .post(viewsController.forgotPasswordPOST);

router.get("/forgot-password/reset/:token", authController.resetPassword);
router.post("/update-password", authController.updatePassword);

router.get("/select-class/:class", viewsController.selectedClassRender);

router.get("/view-ppt-live/:ppt", viewsController.viewPPTlive);

router.get("/dislike/:ppt", viewsController.dislikePPT);

router.post('/issues', viewsController.issueSubmit);



module.exports = router;
