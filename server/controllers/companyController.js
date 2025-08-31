const Company = require('../models/CompanyModel');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single company by name
const getCompanyByName = async (req, res) => {
  try {
    const company = await Company.findOne({ name: req.params.name }).populate('posts');
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new company
const createCompany = async (req, res) => {
  try {
    const { name } = req.body;
    const company = new Company({ name });
    const savedCompany = await company.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// AI bot for company interview posts
const companyAIBot = async (req, res) => {
  try {
    const { question, companyName } = req.body;

    // Find company and populate posts
    const company = await Company.findOne({ name: companyName }).populate('posts');
    if (!company || !company.posts || company.posts.length === 0) {
      return res.status(404).json({ error: 'No interview posts found for this company.' });
    }

    // Prepare context from posts
    const context = company.posts.map(post => ({
      role: post.role,
      ctc: post.ctc,
      campusType: post.campusType,
      questions: post.questions,
      tags: post.tags,
      year: new Date(post.createdAt).getFullYear(),
      summary: post.content
    }));

    // Compose prompt
    const prompt = `
You are NexusAI, an advanced interview preparation assistant specializing in tech company interviews.

CONTEXT:
Here are interview posts for ${companyName}: ${JSON.stringify(context)}

USER QUESTION: ${question}

INSTRUCTIONS:
1. Analyze the interview posts for ${companyName} carefully.
2. Identify patterns in their interview process (OA, technical rounds, HR rounds).
3. For each stage, provide ACTIONABLE preparation strategies:
   - OA/Coding challenges: Topic focus areas, difficulty level, time constraints, specific practice problems.
   - Technical interviews: Common DSA questions, system design expectations, typical CS fundamentals asked.
   - HR/Behavioral: Common questions, values the company looks for, red flags to avoid.
4. Include specific question examples from the context data where available.
5. Format your response with clear sections and bullet points for readability.
6. Suggest specific resources (LeetCode problems, books, articles) relevant to this company's interview style.
7. End with a custom study plan tailored to ${companyName}'s interview process.

If the question is about a specific interview stage, focus more deeply on that stage.
If the question is about compensation/offers, provide data-backed insights from the context.
Always prioritize information from the most recent interviews in your analysis.

Your goal is to provide a COMPREHENSIVE yet PRACTICAL preparation strategy that helps the user maximize their chances of success at ${companyName}.
`;

   
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const result = await model.generateContent([prompt]);
    const answer = result.response.candidates[0].content.parts[0].text;

    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllCompanies, getCompanyByName, createCompany, companyAIBot };
