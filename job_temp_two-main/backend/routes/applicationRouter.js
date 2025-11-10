import express from "express";
import multer from "multer";
import {
  checkAts,
  deleteApplication,
  getJobApplications,
  getMyApplications,
  getSingleApplication,
  postApplication
} from "../controllers/applicationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
const storage = multer.memoryStorage();

// File filter to only accept PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

router.get("/getmyapplications", isAuthenticated, getMyApplications);
router.post("/post", isAuthenticated, upload.single("resume"), postApplication);
router.post("/check-ats", isAuthenticated, upload.single("resume"), checkAts);
router.get("/job/:jobId", isAuthenticated, getJobApplications);
router.delete("/delete/:id", isAuthenticated, deleteApplication);
router.get("/:id", isAuthenticated, getSingleApplication);

export default router; 