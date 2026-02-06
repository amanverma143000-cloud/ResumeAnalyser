const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resume = require('./models/Resume');

// Load environment variables
dotenv.config();

// Sample resume data for testing
const sampleResumes = [
  {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0123',
    role: 'Senior Software Engineer',
    summary: 'Experienced software engineer with 5+ years in full-stack development. Proficient in React, Node.js, and cloud technologies.',
    education: 'Bachelor of Science in Computer Science, MIT (2018)',
    fileName: 'john_doe_resume.pdf'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1-555-0456',
    role: 'Data Scientist',
    summary: 'Data scientist with expertise in machine learning and statistical analysis. Skilled in Python, R, and big data technologies.',
    education: 'Master of Science in Data Science, Stanford University (2020)',
    fileName: 'jane_smith_resume.pdf'
  },
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    phone: '+1-555-0789',
    role: 'Product Manager',
    summary: 'Product manager with 7+ years experience leading cross-functional teams and delivering successful products.',
    education: 'MBA in Business Administration, Harvard Business School (2017)',
    fileName: 'mike_johnson_resume.pdf'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Resume.deleteMany({});
    console.log('Cleared existing resume data');

    // Insert sample data
    await Resume.insertMany(sampleResumes);
    console.log('Sample resume data inserted successfully');

    console.log(`${sampleResumes.length} sample resumes added to the database`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run seeder
seedDatabase();