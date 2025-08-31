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

   const prompt = `
You are **NexusAI**, an advanced interview preparation assistant. Your task is to provide highly accurate insights based ONLY on the interview posts provided.

CONTEXT (interview experiences for ${companyName}):
${JSON.stringify(context)}

USER QUESTION: ${question}

RULES:
1. **Use ONLY the context above** as the source of truth. If the context does not contain enough details, clearly say so and avoid guessing.
2. Give higher weight to the **most recent interview posts** (latest years).
3. If multiple posts contradict, mention the differences clearly instead of merging them.
4. Always keep your analysis **practical and detailed** — the user should be able to apply the advice directly.
5. Structure your response into **clear sections with bullet points** for readability.

OUTPUT FORMAT:
- **Overview of ${companyName}'s Interview Process** (based on context)
- **Stage-wise Preparation Guide**
   - Online Assessment (OA/Coding)
   - Technical Interviews (DSA, System Design, CS Fundamentals)
   - HR/Behavioral Rounds
- **Specific Examples from Context** (show real questions asked, CTC ranges, campus type, etc.)
- **Preparation Resources** (LeetCode, books, articles — but only if relevant to the questions in context)
- **Custom Study Plan for ${companyName}** (tailored timeline and strategy)

IMPORTANT:
- If the user's question is about a specific stage, focus more deeply on that stage.
- If the user asks about compensation or offers, summarize data-backed insights from the context (CTC, roles, campusType, year).
- Always make it clear what information came from the context and what is general advice.

Your goal is to give the **most accurate, context-driven preparation strategy** for ${companyName}, ensuring the user feels confident and well-prepared.
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
