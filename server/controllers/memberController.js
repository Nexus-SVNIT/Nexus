const member = require("../models/memberModel.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const newmember = require("../models/newmemberModel.js");

const addnewMember = wrapAsync(async (req, res, next) => {
  const { name, email, role, image, year, socialLinks } = req.body;

  if (!name || !email || !role || !socialLinks || !image || !year) {
    throw new ExpressError("Every field is mandatory", 400);
  }

  const existingMember = await newmember.findOne({ email });
  if (existingMember) {
    throw new ExpressError("Entry already exists", 400);
  }

  const newMember = await newmember.create({ name, email, role, socialLinks, image, year });
  res.status(200).json(newMember);
});


const getAllMember = wrapAsync(async (req, res, next) => {
  const year = req.params.year;
  let getAllMemberDetails;
  if(year == "2024"){
    getAllMemberDetails = await newmember.find().sort({ _id: 1 });
  }
  else if(year == "2023"){
    getAllMemberDetails = await member.find().sort({ _id: 1 });
  }
  // console.log(getAllMemberDetails)
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
  addnewMember,
  getAllMember,
  getUniqueMember,
  updateMemberDetails,
  addMember,
  deleteMember,
};
