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
    const posts = await Post.find().populate('author').populate('comments').populate('questions');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPost, getAllPosts };