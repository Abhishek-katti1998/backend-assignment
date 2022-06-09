const express = require("express");
const {
  getAllCandidateDetails,
  createCandidateDetails,
  updateCandidateDetails,
  deleteCandidateDetails,
} = require("../controller/candidateController");

const { protect } = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(protect, getAllCandidateDetails)
  .post(createCandidateDetails);

router
  .route("/:id")
  .patch(protect, updateCandidateDetails)
  .delete(protect, deleteCandidateDetails);

module.exports = router;
