# AI-Powered Hiring System 🚀

A comprehensive, full-stack hiring platform that uses AI to match candidates with jobs. Built with modern technologies including React, Node.js, Express, MongoDB, and Python AI services.

![AI Hiring System](https://img.shields.io/badge/Status-In%20Development-yellow)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🔐 Authentication & Authorization
- **Multi-role System**: Job Seekers, Recruiters, and Administrators
- **JWT-based Authentication**: Secure token-based login system
- **Role-based Access Control**: Protected routes and permissions
- **Form Validation**: Comprehensive client and server-side validation

### 👥 User Management
- **Job Seeker Profiles**: Resume upload, skills, experience tracking
- **Recruiter Profiles**: Company management, job posting capabilities
- **Admin Dashboard**: User management, analytics, and system oversight

### 🤖 AI-Powered Capabilities
- **Resume Parsing**: Intelligent extraction of skills and experience
- **Job Matching**: AI algorithms for candidate-job matching
- **Skill Analysis**: Automated skill detection and gap analysis
- **Recommendation Engine**: Personalized job and candidate suggestions

### 💼 Job Management
- **Smart Job Posting**: AI-optimized job descriptions
- **Advanced Search**: Filter jobs by skills, location, experience
- **Application Tracking**: Complete application workflow management

## 🏗️ Project Architecture

```
ai-powered-hiring-system/
├── backend/                 # Node.js + Express API
├── frontend/               # React + TypeScript + Vite
├── ai_service/             # Python Flask AI Microservice
└── docs/                   # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- MongoDB 5.0+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/naseeribalti/ai-powered-hiring-system.git
   cd ai-powered-hiring-system
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   # Backend environment
   cp backend/.env.example backend/.env
   # Frontend environment  
   cp frontend/.env.example frontend/.env
   # AI Service environment
   cp ai_service/.env.example ai_service/.env
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend (Port 5000)
   npm run dev:backend

   # Terminal 2 - Frontend (Port 3000)  
   npm run dev:frontend

   # Terminal 3 - AI Service (Port 8000)
   npm run dev:ai
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - AI Service: http://localhost:8000

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | User registration | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/me` | Get current user | Private |
| GET | `/api/auth/logout` | User logout | Private |
| PUT | `/api/auth/updatedetails` | Update user details | Private |
| PUT | `/api/auth/updatepassword` | Update password | Private |

### User Management Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Private |
| PUT | `/api/users/profile` | Update user profile | Private |
| DELETE | `/api/users/:id` | Delete user | Private/Admin |
| GET | `/api/users/stats` | User statistics | Admin |

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: React Context + useReducer
- **Forms**: React Hook Form + Yup Validation
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### AI Service
- **Framework**: Flask (Python)
- **ML Libraries**: scikit-learn, spaCy, pandas
- **File Processing**: PyMuPDF, python-docx
- **NLP**: NLTK, transformers

## 🔧 Development

### Available Scripts

```bash
# Root level scripts
npm run install:all      # Install all dependencies
npm run dev:backend      # Start backend development server
npm run dev:frontend     # Start frontend development server  
npm run dev:ai          # Start AI service development server
npm run test:all        # Run all test suites

# Backend specific
cd backend
npm run dev            # Start with nodemon
npm test              # Run backend tests
npm run lint          # Lint backend code

# Frontend specific  
cd frontend
npm run dev           # Start Vite dev server
npm run build         # Build for production
npm run preview       # Preview production build
```

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-hiring-system
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME="AI Hiring System"
```

**AI Service (.env)**
```env
FLASK_ENV=development
PORT=8000
MODEL_PATH=./models
UPLOAD_FOLDER=./uploads
```

## 🗂️ Project Structure

### Backend Structure
```
backend/
├── config/             # Database configuration
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── models/            # MongoDB models
├── routes/            # API routes
├── services/          # Business logic
├── utils/             # Helper functions
└── scripts/           # Database scripts
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/    # Reusable components
│   ├── context/       # React context
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Page components
│   ├── services/      # API services
│   └── utils/         # Utilities
├── public/            # Static assets
└── dist/              # Build output
```

### AI Service Structure
```
ai_service/
├── src/
│   ├── parser/        # Resume parsing logic
│   ├── matcher/       # Job matching algorithms
│   └── utils/         # Text processing utilities
├── models/            # Trained ML models
├── notebooks/         # Jupyter experiments
└── tests/             # AI service tests
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests  
cd frontend
npm test

# AI service tests
cd ai_service
python -m pytest
```

## 📈 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# The built files will be in frontend/dist/
```

### Docker Support (Coming Soon)
```bash
# Build and run with Docker
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Naseer Ibalti** - *Initial work* - [naseeribalti](https://github.com/naseeribalti)

## 🙏 Acknowledgments

- React and Node.js communities
- MongoDB for excellent documentation
- The open-source AI/ML community
- All contributors and testers

---

## 📞 Support

If you have any questions or need help, please:

1. Check the [documentation](docs/)
2. Search existing [issues](https://github.com/naseeribalti/ai-powered-hiring-system/issues)
3. Create a new issue with detailed information

## 🗺️ Roadmap

### ✅ Completed
- [x] Phase 1: Project Setup & Workspace Creation
- [x] Phase 2: Backend Authentication & User Models  
- [x] Phase 3: Frontend Authentication Integration

### 🔄 In Progress
- [ ] Phase 4: Dashboard & Profile Management
- [ ] Phase 5: Job Management System
- [ ] Phase 6: AI Integration & Matching

### 📋 Planned
- [ ] Phase 7: Advanced Analytics & Reporting
- [ ] Phase 8: Mobile Application
- [ ] Phase 9: Enterprise Features

---

<div align="center">

**Built with ❤️ using modern web technologies**

[⬆ Back to Top](#ai-powered-hiring-system-)

</div>
