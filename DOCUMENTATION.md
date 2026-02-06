# Resume Analyzer - Complete MERN Stack Application

## 🚀 Project Overview

A full-featured MERN Stack application that uses AI/NLP technology to analyze and parse PDF resumes. The application extracts key information including personal details, education, professional summary, and validates required fields before saving to the database.

## 🛠️ Technology Stack

### Frontend
- **React.js 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Multer** - File upload middleware
- **pdf-parse** - PDF text extraction
- **CORS** - Cross-origin resource sharing

### AI/NLP Features
- Advanced regex patterns for data extraction
- Intelligent name detection from document structure
- Email and phone number validation
- Education section parsing
- Professional summary extraction
- Role/job title identification

## 📁 Project Structure

```
ResumeAnalyser/
├── backend/
│   ├── controllers/
│   │   └── resumeController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── models/
│   │   └── Resume.js
│   ├── routes/
│   │   └── resumeRoutes.js
│   ├── utils/
│   │   ├── database.js
│   │   └── resumeParser.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   ├── seedData.js
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorMessage.js
│   │   │   ├── FileUpload.js
│   │   │   ├── Loading.js
│   │   │   ├── Navigation.js
│   │   │   └── ResumeCard.js
│   │   ├── context/
│   │   │   └── AppContext.js
│   │   ├── pages/
│   │   │   ├── HistoryPage.js
│   │   │   └── UploadPage.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
├── .gitignore
├── README.md
├── setup.bat
└── start.bat
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd ResumeAnalyser
   ```

2. **Run the setup script (Windows)**
   ```bash
   setup.bat
   ```

3. **Or install manually:**
   
   **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   
   **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```

4. **Configure Environment Variables**
   
   Update `backend/.env` with your MongoDB connection:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/resume-analyzer
   NODE_ENV=development
   ```

5. **Start the Application**
   
   **Option 1: Use start script (Windows)**
   ```bash
   start.bat
   ```
   
   **Option 2: Manual start**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📊 API Endpoints

### Resume Operations
- `POST /api/upload-resume` - Upload and analyze PDF resume
- `GET /api/resume-history` - Get paginated resume history
- `GET /api/resume/:id` - Get single resume details
- `GET /api/health` - Health check endpoint

### Request/Response Examples

**Upload Resume:**
```bash
POST /api/upload-resume
Content-Type: multipart/form-data

# Form data with 'resume' field containing PDF file
```

**Response:**
```json
{
  "success": true,
  "message": "Resume uploaded and analyzed successfully",
  "data": {
    "id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "name": "John Doe",
    "email": "john.doe@email.com",
    "phone": "+1-555-0123",
    "role": "Senior Software Engineer",
    "summary": "Experienced software engineer...",
    "education": "Bachelor of Science in Computer Science",
    "uploadDate": "2023-09-06T10:30:00.000Z"
  }
}
```

## 🧠 AI/NLP Features

### Resume Parsing Logic
The application uses advanced AI/NLP techniques to extract information:

1. **Text Extraction**: Uses pdf-parse to convert PDF to text
2. **Name Detection**: Analyzes document structure to find names
3. **Email Extraction**: Regex patterns for email validation
4. **Phone Number Parsing**: Multiple phone format recognition
5. **Education Parsing**: Identifies education sections and degrees
6. **Role Identification**: Matches job titles and positions
7. **Summary Extraction**: Finds professional summaries and objectives

### Validation Rules
- **Required Fields**: Name, Email, Education
- **File Validation**: Only PDF files, max 10MB
- **Data Validation**: Email format, phone format validation
- **Error Handling**: Comprehensive error messages

## 🎨 Frontend Features

### Pages
1. **Upload Page** (`/`)
   - Drag & drop file upload
   - File validation with error messages
   - Real-time analysis results
   - Loading states and progress indicators

2. **History Page** (`/history`)
   - Paginated resume list
   - Search functionality
   - Resume cards with key information
   - Responsive grid layout

### Components
- **FileUpload**: Drag & drop with validation
- **ResumeCard**: Display resume information
- **Navigation**: App navigation with active states
- **Loading**: Reusable loading spinner
- **ErrorMessage**: Error display with retry options

### State Management
- React Context API for global state
- Actions for loading, data, and error states
- Persistent state across page navigation

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-analyzer
NODE_ENV=development
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf
```

**Frontend:**
- Proxy configuration in package.json for development
- Production build configuration for deployment

### Database Schema

**Resume Model:**
```javascript
{
  name: String (required),
  email: String (required, validated),
  phone: String,
  role: String,
  summary: String,
  education: String (required),
  uploadDate: Date (default: now),
  fileName: String (required)
}
```

## 🧪 Testing

### Sample Data
Run the seeder to add sample resume data:
```bash
cd backend
npm run seed
```

### Manual Testing
1. Upload various PDF resume formats
2. Test file validation (wrong format, large files)
3. Verify required field validation
4. Check search and pagination functionality

## 🚀 Deployment

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm start
```

### Environment Setup
- Update MONGODB_URI for production database
- Configure CORS origins for production domains
- Set NODE_ENV=production
- Configure file upload limits for production

## 🔒 Security Features

- File type validation (PDF only)
- File size limits (10MB max)
- Input sanitization and validation
- Error handling without sensitive data exposure
- CORS configuration for secure cross-origin requests

## 📈 Performance Optimizations

- Memory-based file storage for processing
- Efficient MongoDB queries with indexing
- Pagination for large datasets
- Optimized React components with proper state management
- Lazy loading and code splitting ready

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file

2. **File Upload Issues**
   - Verify file is PDF format
   - Check file size is under 10MB
   - Ensure backend server is running

3. **Parsing Errors**
   - Some PDF formats may not parse correctly
   - Ensure PDF contains readable text (not scanned images)

4. **Port Conflicts**
   - Change PORT in backend .env if 5000 is occupied
   - Update proxy in frontend package.json accordingly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- MongoDB team for the database solution
- Tailwind CSS for the utility-first CSS framework
- pdf-parse library for PDF text extraction
- All open-source contributors who made this project possible