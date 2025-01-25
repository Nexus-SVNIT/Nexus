const Post = require('../models/postModel');
const Company = require('../models/CompanyModel');
const User = require('../models/userModel');

const createPost = async (req, res) => {
  try {
    // Log incoming data
    console.log("Request Body:", req.body);

    const { 
      title, content, company, tags, 
      campusType, jobType, selectionProcess,
      rounds, compensation, difficultyLevel,
      hiringPeriod, cgpaCriteria, shortlistCriteria,
      shortlistedCount, selectedCount,
      workMode, location 
    } = req.body;

    // Basic validation
    if (!title || !content || !company || !campusType || !jobType || !workMode || !location) {
      return res.status(400).json({ 
        error: "Missing required fields",
        required: ["title", "content", "company", "campusType", "jobType", "workMode", "location"]
      });
    }

    // Find or create company
    let companyRecord = await Company.findOne({ name: company });
    if (!companyRecord) {
      companyRecord = new Company({ name: company });
      await companyRecord.save();
    }

    // Create new post with all fields
    const post = new Post({
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
      company: companyRecord.name,
      author: req.user.id,
      campusType,
      jobType,
      selectionProcess,
      rounds,
      compensation,
      difficultyLevel: Number(difficultyLevel),
      hiringPeriod: {
        month: Number(hiringPeriod.month),
        year: Number(hiringPeriod.year)
      },
      cgpaCriteria,
      shortlistCriteria,
      shortlistedCount,
      selectedCount,
      workMode,
      location
    });

    const savedPost = await post.save();

    // Link post to company
    companyRecord.posts.push(savedPost._id);
    await companyRecord.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(400).json({ error: error.message || "Failed to create the post. Please try again." });
  }
};

// Fetch all posts
const getAllPosts = async (req, res) => {
  try {
    const { 
      companyName, tag, admissionNumber, startDate, endDate,
      campusType, jobType, hasAptitude, hasCoding,
      minStipend, maxStipend, minCTC, maxCTC,
      difficultyLevel, hiringYear, hiringMonth,
      minCgpaBoys, maxCgpaBoys,
      minCgpaGirls, maxCgpaGirls,
      workMode, location
    } = req.query;
    
    const filter = {};
    
    if (companyName) {
      filter.company = new RegExp(companyName, 'i');
    }
    if (tag) {
      filter.tags = tag;
    }
    if (admissionNumber) {
      // First find users with matching admission numbers
      const users = await User.find({ 
        admissionNumber: new RegExp(admissionNumber, 'i') 
      });
      const userIds = users.map(user => user._id);
      filter.author = { $in: userIds };
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (campusType) filter.campusType = campusType;
    if (jobType) filter.jobType = jobType;
    if (hasAptitude) filter['selectionProcess.onlineAssessment.aptitude'] = true;
    if (hasCoding) filter['selectionProcess.onlineAssessment.codingRound'] = true;
    
    if (minStipend || maxStipend) {
      filter['compensation.stipend'] = {};
      if (minStipend) filter['compensation.stipend'].$gte = Number(minStipend);
      if (maxStipend) filter['compensation.stipend'].$lte = Number(maxStipend);
    }

    if (minCTC || maxCTC) {
      filter['compensation.ctc'] = {};
      if (minCTC) filter['compensation.ctc'].$gte = Number(minCTC);
      if (maxCTC) filter['compensation.ctc'].$lte = Number(maxCTC);
    }

    if (difficultyLevel) filter.difficultyLevel = Number(difficultyLevel);
    if (hiringYear) filter['hiringPeriod.year'] = Number(hiringYear);
    if (hiringMonth) filter['hiringPeriod.month'] = Number(hiringMonth);

    if (minCgpaBoys) filter['cgpaCriteria.boys'] = { $gte: Number(minCgpaBoys) };
    if (maxCgpaBoys) filter['cgpaCriteria.boys'] = { ...filter['cgpaCriteria.boys'], $lte: Number(maxCgpaBoys) };
    
    if (minCgpaGirls) filter['cgpaCriteria.girls'] = { $gte: Number(minCgpaGirls) };
    if (maxCgpaGirls) filter['cgpaCriteria.girls'] = { ...filter['cgpaCriteria.girls'], $lte: Number(maxCgpaGirls) };
    
    if (workMode) filter.workMode = workMode;
    if (location) filter.location = new RegExp(location, 'i');

    const posts = await Post.find(filter)
      .populate('author', 'fullName linkedInProfile admissionNumber')
      .populate('comments')
      .populate('questions')
      .sort({ createdAt: -1 });
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPost, getAllPosts };