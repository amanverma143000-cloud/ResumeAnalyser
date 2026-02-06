const mongoose = require('mongoose');
const dotenv = require('dotenv');
const resumeParser = require('./utils/resumeParser');

// Load environment variables
dotenv.config();

// Sample resume text for testing
const sampleResumeText = `
John Smith
Software Engineer
john.smith@email.com
+1-555-123-4567

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years in full-stack development. 
Proficient in React, Node.js, Python, and cloud technologies. 
Strong problem-solving skills and team collaboration experience.

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley
Graduated: May 2018

EXPERIENCE
Senior Software Engineer - Tech Corp (2020-Present)
- Developed scalable web applications using React and Node.js
- Led team of 4 developers on major product features
- Improved application performance by 40%

Software Engineer - StartupXYZ (2018-2020)
- Built REST APIs using Python and Django
- Implemented automated testing procedures
- Collaborated with cross-functional teams
`;

// Test case with missing education section
const problematicResumeText = `
Jane Doe
jane.doe@example.com
555-987-6543

Objective: Seeking a challenging position as a software developer

Skills:
- JavaScript, Python, Java
- React, Node.js, Django
- MySQL, MongoDB

Experience:
Junior Developer at ABC Company (2021-2023)
- Developed web applications
- Worked with databases
`;

async function testResumeParser() {
  console.log('🧪 Testing Resume Parser with Robust 3-Layer Validation\n');
  
  try {
    console.log('=== TEST 1: Complete Resume ===');
    const parser = resumeParser;
    const result1 = await parser.aiExtractData(sampleResumeText);
    
    console.log('AI extracted fields:', {
      name: result1.name || 'null',
      email: result1.email || 'null',
      education: result1.education || 'null'
    });
    
    // Test robust validation
    const validation1 = parser.validateRequiredFieldsRobust(result1, sampleResumeText);
    console.log('Robust validation result:', {
      isValid: validation1.isValid,
      missingFields: validation1.missingFields
    });
    
    console.log('\n=== TEST 2: Problematic Resume (Missing Education Section) ===');
    const result2 = await parser.aiExtractData(problematicResumeText);
    
    console.log('AI extracted fields:', {
      name: result2.name || 'null',
      email: result2.email || 'null', 
      education: result2.education || 'null'
    });
    
    // Test robust validation with fallback
    const validation2 = parser.validateRequiredFieldsRobust(result2, problematicResumeText);
    console.log('Robust validation result:', {
      isValid: validation2.isValid,
      missingFields: validation2.missingFields
    });
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testResumeParser();