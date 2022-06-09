const express = require("express");
const {
  getAllCandidateDetails,
  createCandidateDetails,
  updateCandidateDetails,
  deleteCandidateDetails,
} = require("../controller/candidateController");

const router = express.Router();

router.route("/").get(getAllCandidateDetails).post(createCandidateDetails);

router
  .route("/:id")
  .patch(updateCandidateDetails)
  .delete(deleteCandidateDetails);

module.exports = router;
