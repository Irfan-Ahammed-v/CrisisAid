const express = require("express");
const { volunteerRegister,home,completeProfile,toggleAvailability,getAssignedTasks,acceptTask,completeTask,addTaskRemark
    
 } = require("../controllers/volunteer.controller");
const { volunteerAuth } = require("../middlewares/volunteerAuth");
const uploadVolunteerDocs = require("../middlewares/volunteerUpload");
const upload = require("../middlewares/taskProofUpload");
const router = express.Router();
router.post("/register", volunteerRegister);
router.get("/home", volunteerAuth,home);
router.put(
  "/complete-profile",
  volunteerAuth,
  uploadVolunteerDocs.fields([
    { name: "volunteer_photo", maxCount: 1 },
    { name: "volunteer_proof", maxCount: 1 },
  ]),
  completeProfile
);
router.patch(
  "/toggle-availability",
  volunteerAuth,
  toggleAvailability
);
router.get("/tasks", volunteerAuth, getAssignedTasks);
router.patch(
  "/tasks/:id/accept",
  volunteerAuth,
  acceptTask
);

router.patch(
  "/tasks/:id/complete",
  volunteerAuth,
  upload.single("proof"),
  completeTask
);

router.patch(
  "/tasks/:id/remark",
  volunteerAuth,
  addTaskRemark
);

module.exports = router;