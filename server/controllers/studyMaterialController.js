const mongoose = require("mongoose");
const Subject = require("../models/subjectModel");
const Resource = require("../models/resourcesModel");

// GET list of subjects with filtering and pagination
const getSubjects = async (req, res) => {
  try {
    const { category, department, page = 1, limit = 10, search = "" } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const filter = { category: { $regex: new RegExp(category, "i") } };

    // Department filtering logic
    if (category.toLowerCase() === "semester exams") {
      if (!department) {
        return res.status(400).json({ message: "Department is required for Semester Exams" });
      }
      filter.department = department.trim();
    } else if (category.toLowerCase() === "placements/internships") {
      filter.department = "Common";
    }

    // Optional search by subject name
    if (search.trim() !== "") {
      filter.subjectName = { $regex: search.trim(), $options: "i" };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const subjects = await Subject.find(filter)
      .select("_id subjectName department category")
      .sort({ createdAt: -1 }) // ensure consistent order
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Subject.countDocuments(filter);

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: subjects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching subjects" });
  }
};

// GET paginated and filtered resources for a subject
const getResourcesBySubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subCategory, page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid subject ID" });
    }

    const filter = { subject: id };

    const validSubCategories = Resource.schema.path("subCategory").enumValues;
    if (subCategory && validSubCategories.includes(subCategory)) {
      filter.subCategory = subCategory;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const resources = await Resource.find(filter)
      .select("title link subCategory resourceType")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Resource.countDocuments(filter);

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: resources,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching resources" });
  }
};

module.exports = {
  getSubjects,
  getResourcesBySubject,
};
