# AI-Powered Hiring System

A comprehensive hiring platform that uses AI to match candidates with jobs, featuring intelligent resume parsing, job matching algorithms, and automated candidate recommendations.

## 🚀 Features

- **AI-Powered Resume Parsing**: Extract skills, experience, and qualifications from resumes
- **Intelligent Job Matching**: Advanced algorithms to match candidates with suitable positions
- **Multi-Role Support**: Job seekers, recruiters, and admin interfaces
- **Real-time Analytics**: Dashboard with hiring insights and metrics
- **Secure Authentication**: JWT-based authentication system

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, TypeScript, Styled Components
- **AI Service**: Python, Flask, scikit-learn, spaCy, NLTK
- **Authentication**: JWT (JSON Web Tokens)
- **File Processing**: PyMuPDF, python-docx for resume parsing

## 📁 Project Structure

```
ai-powered-hiring-system/
├── backend/                 # Node.js/Express API server
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── tests/             # Backend tests
├── frontend/              # React.js frontend
│   └── src/
│       ├── assets/        # Static assets
│       ├── components/    # React components
│       │   ├── auth/     # Authentication components
│       │   ├── common/   # Shared components
│       │   ├── jobs/     # Job-related components
│       │   └── layout/   # Layout components
│       ├── context/      # React context providers
│       ├── hooks/        # Custom React hooks
│       ├── pages/        # Page components
│       ├── services/     # API services
│       └── utils/        # Frontend utilities
├── ai_service/           # Python AI service
│   ├── src/
│   │   ├── matcher/     # Job matching algorithms
│   │   ├── parser/      # Resume parsing logic
│   │   └── utils/       # AI utilities
│   ├── models/          # AI/ML models
│   ├── notebooks/       # Jupyter notebooks for analysis
│   └── tests/           # AI service tests
└── docs/                # Documentation
    └── images/          # Documentation images
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-powered-hiring-system.git
   cd ai-powered-hiring-system
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # AI Service
   cp ai_service/.env.example ai_service/.env
   ```

4. **Start development servers**
   ```bash
   # Terminal 1: Backend
   npm run dev:backend
   
   # Terminal 2: Frontend
   npm run dev:frontend
   
   # Terminal 3: AI Service
   npm run dev:ai
   ```

### Environment Setup

Create `.env` files in both `backend/` and `ai_service/` directories:

**Backend (.env):**
```
MONGODB_URI=mongodb://localhost:27017/hiring-system
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

**AI Service (.env):**
```
FLASK_ENV=development
FLASK_DEBUG=True
PORT=8000
```

## 🧪 Testing

Run all tests:
```bash
npm run test:all
```

Run individual service tests:
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# AI service tests
cd ai_service && python -m pytest
```

## 📚 API Documentation

- **Backend API**: `http://localhost:5000/api`
- **AI Service API**: `http://localhost:8000/api`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/yourusername/ai-powered-hiring-system/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🗺 Roadmap

- [ ] Phase 1: Project Setup & Workspace Creation ✅
- [ ] Phase 2: Backend Authentication & User Models
- [ ] Phase 3: Frontend Basic Structure
- [ ] Phase 4: AI Service Core
- [ ] Phase 5: Job Management
- [ ] Phase 6: AI Matching Integration
- [ ] Phase 7: Dashboard & Analytics
