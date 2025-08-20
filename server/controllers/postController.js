const Post = require('../models/postModel');
const Company = require('../models/CompanyModel');
const User = require('../models/userModel');
const { sendEmail } = require('../utils/emailUtils');
const { postCreationTemplate, postEditTemplate } = require('../utils/emailTemplates');

const createPost = async (req, res) => {
  try {
    // Log incoming data

    const {
      title, content, company, tags,
      campusType, jobType, selectionProcess,
      rounds, compensation, difficultyLevel,
      hiringPeriod, cgpaCriteria, shortlistCriteria,
      shortlistedCount, selectedCount,
      workMode, location, offerDetails,
      role // Ensure role is included in destructuring
    } = req.body;

    // Basic validation
    if (!title || !content || !company || !campusType || !jobType || !workMode || !location || !role) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["title", "content", "company", "campusType", "jobType", "workMode", "location", "role"]
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
      location,
      offerDetails: {  // Add offerDetails explicitly
        receivedOffer: offerDetails?.receivedOffer,
        acceptedOffer: offerDetails?.acceptedOffer
      },
      role // Ensure role is included in the post creation
    });

    const savedPost = await post.save();

    // Link post to company
    companyRecord.posts.push(savedPost._id);
    await companyRecord.save();

    // Send email notification to author
    const author = await User.findById(req.user.id);
    if (author.personalEmail) {
      const emailContent = postCreationTemplate(author, title, savedPost._id);
      await sendEmail({
        to: author.personalEmail,
        ...emailContent
      });
    }

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(400).json({ error: error.message || "Failed to create the post. Please try again." });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const {
      companyName, tag, admissionNumber, startDate, endDate,
      campusType, jobType, hasAptitude, hasCoding,
      minStipend, maxStipend, minCTC, maxCTC,
      difficultyLevel, hiringYear, hiringMonth,
      minCgpaBoys, maxCgpaBoys,
      minCgpaGirls, maxCgpaGirls,
      workMode, location,
      page = 1, limit = 5
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
    if (location) {
      // Update to search in array of locations
      filter.location = { $in: [new RegExp(location, 'i')] };
    }

    // Check if request has core-auth-token
    const isCoreAdmin = req.headers['core-auth-token'];
    if (!isCoreAdmin) {
      filter.isVerified = true; // Only show verified posts to regular users
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const skipCount = (pageNumber - 1) * pageSize;
    const totalCount = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / pageSize);

    const currentUser = req.user;


    const posts = await Post.find(filter)
      .populate('author', 'fullName linkedInProfile admissionNumber')
      .populate('comments')
      .populate('questions')
      .select('+views') // Ensure views are included
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(pageSize);

    res.status(200).json({
      posts,
      totalPages,
      currentPage: pageNumber,
      currentUser: currentUser ? currentUser.id : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'fullName linkedInProfile admissionNumber')
      .populate('questions.askedBy')
      .populate('questions')
      .select('+views'); // Ensure views are included

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.body._id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this post' });
    }

    // Set isVerified to false when post is updated
    const updatedData = {
      ...req.body,
      isVerified: false,
      verifiedAt: null
    };

    const updatedPost = await Post.findByIdAndUpdate(postId, updatedData, { new: true });

    // Send email notification about post update
    const author = await User.findById(req.user.id);
    if (author.personalEmail) {
      const emailContent = postEditTemplate(author, updatedPost.title, updatedPost._id);
      await sendEmail({
        to: author.personalEmail,
        ...emailContent
      });
    }

    res.status(200).json(updatedPost);
  }
  catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

const incrementPostView = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(200).json({ success: false, error: 'Post not found' });
    }

    post.views += 1;
    await post.save();

    res.status(200).json({ success: true, data: { views: post.views } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(200).json({ success: false, error: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(200).json({ success: false, error: 'You are not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(postId);

    const company = await Company.findOne({ name: post.company });
    if (company) {
      company.posts = company.posts.filter(p => p.toString() !== postId);
      await company.save();
    }

    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  incrementPostView,
  deletePost
};