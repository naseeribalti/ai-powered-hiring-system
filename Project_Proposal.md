## AI Hiring System — Project Proposal

- **Authors**: M. Usama, Syed Qamar Abbas
- **Date**: 2025-10-28
- **Version**: 1.0

### 1) Executive Summary
The AI Hiring System is a multi-service web platform that streamlines recruitment for companies and job seekers. It combines a modern React frontend, a secure Node.js/Express API backed by MongoDB, and an AI service (Flask/Python) that powers resume parsing, job–candidate matching, and intelligent recommendations. The system targets faster hiring cycles, better candidate-job fit, and actionable analytics for recruiters and administrators.

### 2) Goals and Objectives
- **Reduce time-to-hire**: Automate screening and shortlisting with AI-driven matching.
- **Improve candidate-job fit**: Use NLP and ML to score and recommend candidates.
- **Enhance recruiter productivity**: Provide dashboards, analytics, and communication tools.
- **Deliver a seamless experience**: Offer intuitive UI, responsive performance, and clear workflows.
- **Ensure security and compliance**: Protect PII, secure data flows, and follow best practices.

### 3) Scope
- **In Scope**:
  - Authentication with role-based access (Admin, Recruiter, Job Seeker)
  - Profile/Resume management and parsing
  - Job posting, search, and bookmarking
  - Application tracking (applied, screened, interview, offer, hired)
  - Recruiter–candidate communication logging
  - Analytics dashboards for hiring funnel metrics
  - AI services: resume parsing, candidate scoring, job matching, recommendations
  - RESTful APIs, environment-based configuration, and logging
- **Out of Scope (Initial Release)**:
  - Live video interviews
  - Payments/billing
  - Advanced multi-tenant org features (beyond basic company support)
  - Deep compliance certifications (SOC2/ISO) beyond baseline security best practices

### 4) Users and Roles
- **Job Seeker**: Creates profile, uploads resume, searches and applies to jobs, tracks status.
- **Recruiter**: Posts jobs, filters and shortlists candidates, manages pipeline, reviews analytics.
- **Admin**: Manages users, companies, system settings, and monitors platform health.

### 5) High-Level Architecture
- **Frontend (React + TypeScript)**: SPA using React Router, React Query for data fetching and caching, styled-components for styling, and robust error boundaries.
- **Backend API (Node.js + Express + MongoDB/Mongoose)**: Auth, business logic, validation (express-validator), JWT-based security, and RESTful endpoints.
- **AI Service (Python + Flask)**: NLP-based resume parsing (spaCy), job–candidate matching and scoring (scikit-learn + embeddings), recommendation endpoints.
- **Storage**: MongoDB for application data; object storage (e.g., S3-compatible) for resumes if needed.
- **Observability**: Centralized logging, health checks, and metrics dashboards.

Environment-based configuration aligns with existing `env.example` files in `frontend/`, `backend/`, and `ai_service/`.

### 6) Functional Requirements
- **Authentication & Authorization**
  - Register/Login with JWT
  - Role-based access control (RBAC)
- **Profile & Resume**
  - Profile editing (skills, experience, education)
  - Resume upload, parsing, and structured extraction
- **Jobs**
  - Recruiters: create/update/publish/close jobs
  - Job seekers: search/filter, view, save, and apply
- **Applications**
  - Track statuses and history
  - Notes and communication logs
- **AI Features**
  - Parse resumes and normalize candidate profiles
  - Match candidates to jobs (and jobs to candidates)
  - Generate recommendations and relevance scores
- **Analytics**
  - Funnel metrics (views → applies → interviews → offers → hires)
  - Time-to-hire, source effectiveness, job performance

### 7) Non-Functional Requirements
- **Performance**: P95 API latency < 300ms for standard endpoints; AI endpoints < 1.5s
- **Scalability**: Horizontal scaling for API and AI services; database indexing
- **Security**: JWT, password hashing (bcrypt), input sanitization, file scanning, least-privilege
- **Reliability**: Graceful error handling, retries where appropriate, health checks
- **Observability**: Structured logs, request tracing, metrics, and alerting
- **Compliance**: PII handling, data retention policies, privacy-by-design

### 8) API Design Principles
- **RESTful**: Nouns for resources, proper HTTP verbs and status codes
- **Validation**: `express-validator` for request bodies and params
- **Pagination & Filtering**: `?page`, `?limit`, and filter params; predictable sorting
- **Security**: JWT bearer tokens, CORS configured per environment, rate limiting
- **Errors**: Consistent error envelope with machine-readable codes

### 9) Data Model Overview (MongoDB/Mongoose)
- **User**: name, email, passwordHash, role, profile (skills, experience, education), resumeMeta
- **Company**: name, description, size, industry, owners, recruiters
- **Job**: title, description, companyId, location, type, skills, status, createdBy
- **Application**: userId, jobId, status, notes, history, scores
- **Communication**: applicationId, message, channel, timestamps
- **Analytics**: aggregates for funnel metrics and dashboards

Indexes will be added for frequent queries (e.g., `job.skills`, `job.companyId`, `application.userId/jobId`, `user.email`).

### 10) AI/ML Approach
- **Resume Parsing**
  - Use spaCy NER + denoising heuristics and regex for key fields
  - Extract and normalize skills (ontology + synonyms), experience, education
- **Matching & Scoring**
  - Vectorize text (TF–IDF and/or sentence embeddings) and compute similarity
  - Train lightweight models (e.g., logistic regression or ranking) on curated signals
  - Combine rule-based signals (must-have skills) with ML scores
- **Recommendations**
  - "You may also like" jobs and candidates based on similarity and behavior
- **Evaluation & Iteration**
  - Metrics: precision@k, recall@k, MRR, time-to-screen reduction
  - Human-in-the-loop feedback to refine models
- **Operationalization**
  - Versioned models, warm start on boot, guardrails and fallbacks if AI unavailable

### 11) Security & Privacy
- **Auth**: JWT with refresh strategy, password hashing (bcrypt), account lockout on brute force
- **Input Validation**: Server-side schema checks; sanitize and encode outputs
- **File Uploads**: MIME/type checks, size limits, virus scan hooks, store in private buckets
- **PII**: Data minimization, access controls, audit logs for admin actions
- **Transport**: Enforce HTTPS in production; HSTS; secure cookies for refresh flows

### 12) Frontend Application (React + TypeScript)
- **State & Data**: React Query for fetching, cache invalidation, optimistic updates where safe
- **Routing**: React Router v6 with protected routes
- **Styling**: styled-components with theme support (light/dark), responsive layout
- **UX**: Loading spinners, error boundaries, accessible components, keyboard navigation
- **Build**: Vite for fast dev and production builds

### 13) Backend API (Node.js + Express)
- **Structure**: Controllers, routes, middleware, models (Mongoose)
- **Middleware**: Auth, validation, rate limiting, logging, CORS, helmet
- **Patterns**: Async/await, centralized error handler, DTO validation
- **Docs**: OpenAPI/Swagger for discoverability (future enhancement)

### 14) AI Service (Flask + Python)
- **Endpoints**: `/parse-resume`, `/match`, `/recommend`
- **Libraries**: spaCy for NLP, scikit-learn for ML; optional sentence embeddings
- **Resilience**: Timeouts, circuit breakers at API gateway level, cached results
- **Observability**: Request logs, latency metrics, model version tags

### 15) DevOps, Environments, and Deployment
- **Environments**: Dev, Staging, Production with `.env` per service (see `env.example`)
- **Containerization**: Docker images per service; compose for local
- **CI/CD**: Lint, test, build, and deploy pipelines; image scanning
- **Monitoring**: Health endpoints, logs aggregation, metrics and alerts

### 16) Testing Strategy
- **Unit Tests**: Business logic and utilities in all services
- **Integration Tests**: API endpoints with in-memory or test DB
- **E2E Tests**: UI flows for auth, job search, apply, recruiter review
- **Performance Tests**: Load tests for search/list endpoints; AI endpoint latency budgets

### 17) Milestones & Timeline (Indicative)
- **Phase 1 (Week 1–2)**: Foundations — auth, basic CRUD for users/jobs
- **Phase 2 (Week 3–4)**: Applications, communications, analytics MVP
- **Phase 3 (Week 5–6)**: AI MVP — resume parsing and basic matching
- **Phase 4 (Week 7)**: Hardening — security, rate limits, observability, indexing
- **Phase 5 (Week 8)**: Beta — UX polish, feedback, bug fixes
- **Phase 6 (Week 9)**: Production readiness — CI/CD, backups, SLOs

### 18) Deliverables
- Frontend SPA with core user journeys
- Secure REST API with documented endpoints
- AI service with parsing/matching endpoints and baseline models
- Infrastructure as code or deployment configs, CI/CD pipelines
- Test suites and coverage reports
- Admin dashboards and analytics views

### 19) Acceptance Criteria (Examples)
- Users can register/login and manage profiles securely
- Recruiters can create jobs and view candidate shortlists with AI scores
- Job seekers can apply and track application statuses
- Resume parsing extracts skills, experience, and education with acceptable accuracy
- API and AI endpoints meet latency/availability targets under nominal load

### 20) Risks & Mitigations
- **Data quality for AI**: Start with heuristics + manual curation; iterate with feedback
- **Cold-start for embeddings**: Cache models and pre-warm containers; provide fallbacks
- **Security/PII**: Strict RBAC, encryption in transit, limited access logs
- **Scalability**: Use indexes, paginate, and horizontally scale stateless services

### 21) Success Metrics
- Time-to-hire reduction vs. baseline
- Shortlist precision@k and recruiter satisfaction scores
- Application completion rate and job seeker engagement
- System reliability: uptime, P95 latency

### 22) Budget & Resourcing (Optional)
- 2–3 full-stack engineers, 1 ML engineer, 1 QA, part-time DevOps
- Cloud resources for compute, DB, and storage; monitoring and CI/CD tooling

### 23) Appendix
- **Environment Variables**: Use `.env` per service (see `ai_service/env.example`, `backend/env.example`, `frontend/env.example`).
- **API Examples**: `POST /auth/login`, `POST /auth/register`, `GET /jobs`, `POST /jobs`, `POST /applications`, AI endpoints: `POST /ai/parse-resume`, `POST /ai/match`.
- **Coding Standards**: CamelCase for JS/TS, snake_case for Python; async/await; PEP 8.
- **Security Practices**: Input validation, rate limiting, helmet/CORS, JWT, bcrypt.
