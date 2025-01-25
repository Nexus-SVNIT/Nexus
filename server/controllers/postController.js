const Post = require('../models/postModel');
const Company = require('../models/CompanyModel');

const createPost = async (req, res) => {
  try {
    // Log incoming data
    console.log("Request Body:", req.body);

    const { title, content, company, tags } = req.body;

    // Basic validation
    if (!title || !content || !company) {
      return res.status(400).json({ error: "Title, content, and company are required." });
    }

    // Find or create company
    let companyRecord = await Company.findOne({ name: company });
    if (!companyRecord) {
      companyRecord = new Company({ name: company });
      await companyRecord.save();
    }


    
    // Create new post
    const post = new Post({
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
      company: companyRecord.name, // Save company name
      author:req.user.id,
    });

    const savedPost = await post.save();

    // Link post to company
    companyRecord.posts.push(savedPost._id);
    await companyRecord.save();

    // Return success response
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(400).json({ error: "Failed to create the post. Please try again." });
  }
};


// Fetch all posts
const getAllPosts = async (req, res) => {
  try {
    const { companyName, tag, admissionNumber, startDate, endDate } = req.query;
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