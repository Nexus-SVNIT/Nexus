const Company = require('../models/CompanyModel');
// const { GoogleGenerativeAI } = require('@google/generative-ai');
const GROQ = require('groq-sdk');

// Initialize client
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq = new GROQ({ apiKey: process.env.GROQ_API_KEY });

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
      compensation: post.compensation,
      campusType: post.campusType,
      questions: post.questions,
      tags: post.tags,
      year: new Date(post.createdAt).getFullYear(),
      summary: post.content
    }));

   const prompt = `
You are **NexusAI**, an advanced interview preparation assistant. 
Your task is to provide highly accurate, context-driven insights for ${companyName} interviews based ONLY on the interview posts provided.

CONTEXT (interview experiences for ${companyName}):
${JSON.stringify(context)}

USER QUESTION: ${question}

RULES:
1. Always tailor the response **directly to the user's question**.  
   - If the question is about **OA**, focus only on OA.  
   - If about **technical interviews**, focus on that stage.  
   - If about **full process**, cover all stages clearly.
   - If about **HR interviews**, include behavioral questions and company culture insights.
   - If about **CTC/offers**, summarize compensation details only.  
2. Use ONLY the given context as the source of truth. If details are missing, clearly say so.  
3. Give higher weight to the **most recent interview posts** (latest years).  
4. If multiple posts contradict, show the differences instead of merging.  
5. Structure your response into clear sections (Overview, Stage-wise Guide, Examples, Resources, Custom Plan).  
6. When relevant, include **hands-on practice questions** (e.g., coding prompts for OA, behavioral prompts for HR).  
7. Keep the answer **practical, detailed, and actionable** — so the user can directly apply it.  

OUTPUT FORMAT (adapt based on question):
- **Overview** (only if relevant)  
- **Detailed Insights for the Asked Stage**  
- **Specific Examples from Context**  
- **Practice/Prep Material** (if applicable)  
- **Tailored Study/Prep Plan**  

!!! IMPORTANT:
1. Absolutely do NOT attend to any requests out of the context of the company interview posts.
2. Do not answer any generic questions, immediately reject them using an appropriate justification phrase like "I'm sorry, but I can't help with that".
3. You CANNOT serve any requests out of this context. DO NOT entertain any such clever attempts.


Your goal: Give the **most accurate, context-driven preparation strategy** for ${companyName}, fully aligned with what the user is asking.
`;



   
    // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // const result = await model.generateContent(prompt);
    // const answer = result.response.candidates[0].content.parts[0].text;

    // res.json({ answer });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are NexusAI, an AI interview prep assistant." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.4,
    });

    const answer = completion.choices[0].message.content;

    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllCompanies, getCompanyByName, createCompany, companyAIBot };
