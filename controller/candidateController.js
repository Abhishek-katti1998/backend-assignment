const Candidate = require("../Models/candidateModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     res.status(404).json({
//       status: "failuire",
//       reason: "price or name missing",
//     });
//   }
//   next();
// };
exports.getAllCandidateDetails = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.find();

  //send response
  res.status(200).json({
    status: "success",
    results: candidate.length,
    data: { candidate },
  });
});
exports.createCandidateDetails = catchAsync(async (req, res, next) => {
  //   console.log(req.body);
  const newCandidate = await Candidate.create(req.body);
  res.status(201).json({
    status: "succes",
    data: {
      candidate: newCandidate,
    },
  });
});
exports.updateCandidateDetails = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!candidate) {
    return next(new AppError("candidate not found for the requested ID", 404));
  }
  res.status(200).json({
    status: "succes",
    data: {
      candidate,
    },
  });
});
exports.deleteCandidateDetails = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findByIdAndDelete(req.params.id);
  if (!candidate) {
    return next(new AppError("candidate not found for the requested ID", 404));
  }
  res.status(204).json({
    status: "succes",
    data: null,
  });
});
