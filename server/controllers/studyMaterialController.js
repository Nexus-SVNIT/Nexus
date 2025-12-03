const mongoose = require("mongoose");
const Subject = require("../models/subjectModel");
const Resource = require("../models/resourcesModel");

// ✅ Get subjects with filtering + department-specific search
const getSubjects = async (req, res) => {
  try {
    const { category, department, search = "" } = req.query;

    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }

    const filter = { category: { $regex: new RegExp(`^${category}$`, "i") } };

    if (category.toLowerCase() === "semester exams") {
      if (!department) {
        return res.status(400).json({
          success: false,
          message: "Department is required for Semester Exams",
        });
      }
      filter.department = department.trim();
    } else if (category.toLowerCase() === "placements/internships") {
      filter.department = "Common";
    }

    if (search.trim() !== "") {
      filter.subjectName = { $regex: search.trim(), $options: "i" };
    }

    const subjects = await Subject.find(filter)
      .select("_id subjectName department category")
      .sort({ subjectName: 1 })
      .lean();

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.status(200).json({
      success: true,
      total: subjects.length,
      data: subjects,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ success: false, message: "Error fetching subjects" });
  }
};

// ✅ Get all resources for a subject (grouped + filtered)
const getResourcesBySubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subCategory, type, search = "" } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid subject ID" });
    }
};

    const filter = { subject: id };
    if (subCategory && subCategory !== "All") filter.subCategory = subCategory;
    if (type && type !== "All") filter.resourceType = type;
    if (search.trim() !== "") {
      filter.title = { $regex: search.trim(), $options: "i" };
    }

    const resources = await Resource.find(filter)
      .select("title link subCategory resourceType createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const groupedResources = resources.reduce((acc, res) => {
      const key = res.subCategory || "Other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(res);
      return acc;
    }, {});

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.status(200).json({
      success: true,
      total: resources.length,
      data: groupedResources,
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ success: false, message: "Error fetching resources" });
  }
};

module.exports = {
  getSubjects,
  getResourcesBySubject,
};
