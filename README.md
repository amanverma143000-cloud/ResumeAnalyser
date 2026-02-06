# Resume Analyzer - MERN Stack Application

A complete MERN Stack application for analyzing and parsing resumes using AI/NLP technology.

## 🚀 Recent Updates & Fixes

### ✅ Fixed Issues
- **Enhanced AI Resume Parsing**: Improved name, role, and education extraction accuracy
- **Better Field Validation**: Proper validation of required fields (Name, Email, Education)
- **Clear Error Messages**: Specific error messages for file validation and missing fields
- **Improved Data Extraction**: Context-aware parsing to avoid field mismatches
- **Enhanced Upload Validation**: Only valid resumes are saved to database

### 🔧 Key Improvements
- **AI-Enhanced Parsing**: Better context understanding for accurate data extraction
- **Validation Messages**: Exact error messages as specified:
  - "Only PDF resume files are allowed"
  - "Resume file size exceeds 10MB limit"
  - "This resume is not uploadable. Missing: Name, Email, Education"
- **Required Field Checking**: Strict validation ensures Name, Email, and Education are present
- **Better Role Detection**: Enhanced job title and role extraction from resume content
- **Improved Summary Extraction**: Better identification of professional summaries

## Tech Stack
- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **AI/NLP**: Enhanced resume parsing with context-aware extraction
- **File Upload**: Multer
- **PDF Parsing**: pdf-parse

## Project Structure
```
ResumeAnalyser/
├── frontend/          # React.js frontend
├── backend/           # Node.js + Express backend
├── README.md
└── .gitignore
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/resume-analyzer
   NODE_ENV=development
   ```

4. Start backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start frontend development server:
   ```bash
   npm start
   ```

### Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Features
- ✅ PDF Resume Upload (max 10MB)
- ✅ AI-powered Resume Parsing
- ✅ Data Extraction (Name, Email, Phone, Role, Summary, Education)
- ✅ Validation & Error Handling
- ✅ Upload History
- ✅ Responsive UI with Tailwind CSS

## API Endpoints
- `POST /api/upload-resume` - Upload and analyze resume
- `GET /api/resume-history` - Get upload history

## Validation Rules
- Only PDF files allowed
- File size must be < 10MB
- Required fields: Name, Email, Education
- Invalid resumes are rejected and not saved

## Testing

### Test Resume Parser
To test the AI parsing logic:
```bash
cd backend
npm run test-parser
```

### Add Sample Data
To add sample resume data for testing:
```bash
cd backend
npm run seed
```