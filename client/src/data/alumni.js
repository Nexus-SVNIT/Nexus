function extractCompany(role) {
  const match = role.match(/@(.+)$/);
  return match ? match[1].trim() : "Unknown";
}

export async function getAlumniData() {
    try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/alumni/`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Alumni Details");
        }
        const data = await response.json();

        return data.map((alumni) => ({
        id: alumni._id,
        name: alumni["Name"],
        email: alumni["E-Mail"],
        expertise: alumni["Expertise"]
            ? alumni["Expertise"].split(",").map((e) => e.trim())
            : [],
        admissionNo: alumni["Admission No"],
        position: alumni["Current Role"],
        currentCompany: extractCompany(alumni["Current Role"]),
        mobile: alumni["Mobile Number"],
        graduationYear: parseInt(alumni["Passing Year"]),
        linkedIn: alumni["LinkedIn"],
        image: alumni["ImageLink"],
        createdAt: alumni["createdAt"],
        updatedAt: alumni["updatedAt"],
        industry: "Unknown" // Placeholder: can be enhanced if industry info is added to the API
        }));
      } catch (error) {
        throw new Error("Failed to fetch Alumni Details");
      }
}

export const alumniData = [
  {
    id: '1',
    name: 'Devesh Mehta',
    graduationYear: 2026,
    currentCompany: 'Google',
    position: 'Software Engineer',
    expertise: ['Machine Learning', 'Python', 'TensorFlow', 'Cloud Computing'],
    industry: 'Technology',
    linkedinUrl: 'https://linkedin.com/in/sarahchen',
    email: 'sarah.chen@example.com',
    location: 'Bangalore, India',
    bio: 'Passionate about AI/ML and building scalable systems. Leading ML infrastructure at Google.'
  },
  {
    id: '2',
    name: 'Ashish Jha',
    graduationYear: 2026,
    currentCompany: 'Microsoft',
    position: 'Product Manager',
    expertise: ['Product Strategy', 'Data Analysis', 'Agile', 'Leadership'],
    industry: 'Technology',
    linkedinUrl: 'https://linkedin.com/in/marcusrodriguez',
    email: 'marcus.rodriguez@example.com',
    location: 'Hyderabad, India',
    bio: 'Product leader focused on developer tools and enterprise solutions.'
  },
  {
    id: '3',
    name: 'Vatsal Bateriwala',
    graduationYear: 2027,
    currentCompany: 'Amazon',
    position: 'Software Engineer',
    expertise: ['Financial Modeling', 'Python', 'Statistics', 'Risk Management'],
    industry: 'Technology',
    linkedinUrl: 'https://linkedin.com/in/priyapatel',
    email: 'priya.patel@example.com',
    location: 'Bangalore, India',
    bio: 'Developing quantitative models for risk assessment and algorithmic trading.'
  },
  {
    id: '4',
    name: 'Siddhartha Chatterjee',
    graduationYear: 2027,
    currentCompany: 'Facebook',
    position: 'Solutions Architect',
    expertise: ['AWS', 'DevOps', 'Kubernetes', 'System Design'],
    industry: 'Technology',
    linkedinUrl: 'https://linkedin.com/in/davidkim',
    email: 'david.kim@example.com',
    location: 'Bangalore, India',
    bio: 'Helping enterprise customers architect and implement cloud solutions on AWS.'
  },
  {
    id: '5',
    name: 'Mehul Jain',
    graduationYear: 2027,
    currentCompany: 'Meta',
    position: 'Data Scientist',
    expertise: ['Data Science', 'R', 'SQL', 'A/B Testing', 'Statistics'],
    industry: 'Technology',
    linkedinUrl: 'https://linkedin.com/in/emilyzhang',
    email: 'emily.zhang@example.com',
    location: 'Bangalore, India',
    bio: 'Leveraging data to drive product decisions and improve user experience.'
  },
  {
    id: '6',
    name: 'Jeet Gupta',
    graduationYear: 2027,
    currentCompany: 'Tesla',
    position: 'Software Engineer',
    expertise: ['Embedded Systems', 'C++', 'Hardware Design', 'Automotive'],
    industry: 'Automotive',
    linkedinUrl: 'https://linkedin.com/in/alexthompson',
    email: 'alex.thompson@example.com',
    location: 'Bangalore, India',
    bio: 'Designing next-generation automotive systems and autonomous vehicle technology.'
  },
  // {
  //   id: '7',
  //   name: 'Lisa Wang',
  //   graduationYear: 2022,
  //   currentCompany: 'Stripe',
  //   position: 'Frontend Engineer',
  //   expertise: ['React', 'TypeScript', 'JavaScript', 'UI/UX Design'],
  //   industry: 'Fintech',
  //   linkedinUrl: 'https://linkedin.com/in/lisawang',
  //   email: 'lisa.wang@example.com',
  //   location: 'San Francisco, CA',
  //   bio: 'Building intuitive financial products and payment experiences for millions of users.'
  // },
  // {
  //   id: '8',
  //   name: 'James Miller',
  //   graduationYear: 2019,
  //   currentCompany: 'McKinsey & Company',
  //   position: 'Management Consultant',
  //   expertise: ['Strategy', 'Analytics', 'Digital Transformation', 'Leadership'],
  //   industry: 'Consulting',
  //   linkedinUrl: 'https://linkedin.com/in/jamesmiller',
  //   email: 'james.miller@example.com',
  //   location: 'Chicago, IL',
  //   bio: 'Helping Fortune 500 companies navigate digital transformation and growth strategies.'
  // }
];