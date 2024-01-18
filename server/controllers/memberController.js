const member = require("../models/memberModel.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");


const getAllMember = wrapAsync(async (req, res, next) => {
  const getAllMemberDetails = await member.find().sort({ _id: 1 });
  res.status(200).json(getAllMemberDetails);
});

const getUniqueMember = wrapAsync(async (req, res, next) => {
  const id = req.params.id;
  const singleMember = await member.findById(id);
  if (!singleMember) {
    throw new ExpressError("Member not found", 404);
  }
  res.status(200).json(singleMember);
});


const addMember = wrapAsync(async (req, res, next) => {
  const { name, email, role, image, year, socialLinks } = req.body;
  if (!name || !email || !role || !socialLinks || !image || !year) {
    throw new ExpressError("Every field is mandatory", 400);
  }
  const newMember = await member.create({ name, email, role, socialLinks, image, year });
  res.status(200).json(newMember);
});

const deleteMember = wrapAsync(async (req, res, next) => {
  const id = req.params.id;
  const singleMemberToDelete = await member.findByIdAndDelete(id);
  if (!singleMemberToDelete) {
    throw new ExpressError("Member not found", 404);
  }
  res.status(200).json(singleMemberToDelete);
});

const updateMemberDetails = wrapAsync(async (req, res, next) => {
  const id = req.params.id;
  const updatedMember = await member.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedMember) {
    throw new ExpressError("Member not found", 404);
  }
  res.status(200).json(updatedMember);
});

module.exports = {


  getAllMember,
  getUniqueMember,
  updateMemberDetails,
  addMember,
  deleteMember,
};
