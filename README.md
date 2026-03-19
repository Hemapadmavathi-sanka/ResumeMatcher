# Resume Matcher — AI-Powered Intelligent Recruitment Platform

> A full-stack recruitment platform that intelligently connects candidates with job opportunities using a hybrid scoring engine combining rule-based heuristics and Google Gemini AI.

---

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Core Features](#core-features)
- [Frontend Architecture](#frontend-architecture)
- [Database Schema](#database-schema)
- [Project Setup](#project-setup)
- [User Roles and Capabilities](#user-roles-and-capabilities)
- [Folder Structure](#folder-structure)
- [Key Design Decisions](#key-design-decisions)

---

## Overview

Resume Matcher is a decoupled full-stack application that automates the candidate-job matching process. At its core is a **Hybrid AI Matching Engine** that evaluates candidates against job requirements with professional recruiter-level precision — combining deterministic heuristics with Google Gemini 1.5 Flash AI analysis for a reliable and intelligent score.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3.2.5 (Java 17) |
| Frontend | React 19 with Vite |
| Database | MySQL |
| AI Engine | Google Gemini 1.5 Flash |
| Resume Parsing | Apache Tika 2.9.2 |
| Real-Time | WebSockets with STOMP and SockJS |
| Security | Spring Security with JWT |
| Build Tools | Maven (Backend), Vite (Frontend) |

---

## System Architecture

The project follows a **Decoupled Architecture** with a clear separation of concerns between the backend and frontend.

```
Client (React SPA)
      |
      |-- HTTP/REST JSON --> Spring Boot API
      |-- WebSocket/STOMP --> Spring Boot API
                                    |
                              MySQL Database
                                    |
                           Google Gemini AI (external)
```

---

## Core Features

### 1. Hybrid AI Matching Engine

The matching engine is the heart of the platform. It combines two scoring layers to produce a final, weighted match score.

#### Heuristic Score — 30% weight

| Component | Description |
|---|---|
| Skill Matching | Set-based comparison of candidate skills vs. job requirements |
| Experience Matching | Normalized and clamped years-of-experience evaluation |
| Keyword Analysis | Tokenized resume and job description keyword hit-ratio calculation |

#### AI Score — 70% weight

| Component | Description |
|---|---|
| Gemini AI Analysis | Full resume text and job description sent to Gemini 1.5 Flash |
| Prompt Engineering | AI performs a professional recruiter-level evaluation |
| Response Format | Structured JSON response containing a numeric score |

#### Final Score Formula

```
Final Score = ( AI Score × 0.70 ) + ( Heuristic Score × 0.30 )
```

---

### 2. Authentication and Security

Role-based access control is enforced across three user roles: **CANDIDATE**, **RECRUITER**, and **ADMIN**.

#### Registration Flow

1. User submits registration details
2. Account is created with `isVerified = false`
3. A 6-digit OTP is generated and sent via `EmailService`

#### OTP Verification Flow

1. User submits the received OTP
2. Account is marked as verified
3. A JWT token is issued for the session

#### Password Recovery

- Uses the same OTP-based email flow for secure password resets

---

### 3. Resume Parsing

**Apache Tika 2.9.2** automatically detects and extracts plain text from uploaded binary resume files. Supported formats include **PDF** and **DOCX**. The extracted text is fed directly into both the heuristic scoring engine and the Gemini AI for analysis.

---

### 4. Real-Time Notifications

| Property | Detail |
|---|---|
| Protocol | WebSockets with STOMP and SockJS fallback |
| Broker | In-memory message broker on `/topic` |
| Security | JWT-secured WebSocket connections |
| User Channel | `/user/{email}/topic/notifications` |

**Notification Triggers:**
- Recruiter receives a notification when a new application is submitted
- Candidate receives a notification when their application status changes (e.g., Shortlisted, Rejected)

---

### 5. File Management

Files are persisted on the local filesystem and served through configured web endpoints.

```
uploads/
  resumes/     <-- Candidate resume PDF files
  photos/      <-- Candidate profile pictures
```

Files are accessible publicly via the `/uploads/**` endpoint, configured through Spring Boot `WebConfig`.

---

## Frontend Architecture

The frontend is a **React 19 Single Page Application** built with Vite.

### Navigation

Instead of a routing library, the app uses a **centralized state in `App.jsx`** to manage the currently active view based on user role and interactions.

### Design System

A custom **Glassmorphism** design system is implemented in `App.css` using CSS Variables.

| Variable | Purpose |
|---|---|
| `--surface` | Background surface color |
| `--accent` | Primary accent color |
| `--glass` | Frosted glass transparency effect |

UI highlights include vibrant gradients, frosted-glass card effects, and a responsive grid layout.

### Components

| Type | Examples |
|---|---|
| Pages | Authentication, Job Browsing, Profile Management, Recruiter Dashboard |
| Components | Navbar, NotificationSystem, EditJobModal, CandidateProfileModal |

### Real-Time Notification Toast

The `NotificationSystem` component uses `@stomp/stompjs` to maintain a persistent WebSocket connection. When a message arrives on the user's private channel, a **disappearing toast notification** is displayed automatically.

---

## Database Schema

### User
| Field | Description |
|---|---|
| email | Unique user identifier |
| password | BCrypt-encoded password |
| role | CANDIDATE, RECRUITER, or ADMIN |
| isVerified | Account verification status |
| otp | Current one-time password |

### CandidateProfile
| Field | Description |
|---|---|
| user | Foreign key to User |
| education | Educational background |
| yearsOfExperience | Numeric experience value |
| resumeText | Parsed plain text from resume file |
| resumeFilePath | Path to the uploaded resume file |
| profilePictureUrl | URL to the uploaded profile photo |

### Skill
| Field | Description |
|---|---|
| name | Unique normalized skill name |

### Job
| Field | Description |
|---|---|
| title | Job title |
| description | Full job description |
| companyName | Posting company |
| requiredExperience | Minimum years required |
| requiredSkills | Set of required Skill entities |

### Application
| Field | Description |
|---|---|
| candidate | Foreign key to CandidateProfile |
| job | Foreign key to Job |
| matchScore | Calculated hybrid AI score |
| status | PENDING, SHORTLISTED, or REJECTED |

---

## Project Setup

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.x
- Maven 3.8 or higher
- Google Gemini API Key
- SMTP credentials for email delivery

---

### Backend Setup

**Step 1** — Clone the repository

```bash
git clone https://github.com/your-username/resume-matcher.git
cd resume-matcher/backend
```

**Step 2** — Configure `src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/resume_matcher
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password

gemini.api.key=your_google_gemini_api_key

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

**Step 3** — Run the backend

```bash
mvn spring-boot:run
```

The API will start on `http://localhost:8080`

---

### Frontend Setup

**Step 1** — Navigate to the frontend directory

```bash
cd resume-matcher/frontend
```

**Step 2** — Install dependencies

```bash
npm install
```

**Step 3** — Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## User Roles and Capabilities

### Candidate
- Register and verify account via OTP email
- Upload resume in PDF or DOCX format
- Build a profile with skills, education, and experience
- Browse and apply for available jobs
- View AI-generated match scores for each job
- Receive real-time notifications on application status updates

### Recruiter
- Post and manage job listings with required skills and experience
- View applicants ranked by their AI match score
- Review AI analysis summaries per candidate
- Shortlist or reject candidates
- Receive real-time notifications when new applications arrive

### Admin
- Manage users, jobs, and platform-wide settings

---

## Folder Structure

```
resume-matcher/
│
├── backend/
│   ├── src/main/java/
│   │   ├── security/          # JwtUtil, Spring Security configuration
│   │   ├── service/           # MatchingService, ResumeParsingService,
│   │   │                      # EmailService, NotificationService
│   │   ├── controller/        # REST controllers for all endpoints
│   │   ├── entity/            # JPA entities: User, Job, Application, Skill
│   │   └── repository/        # Spring Data JPA repositories
│   └── pom.xml                # Maven build configuration
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Central state and navigation controller
│   │   ├── App.css            # Glassmorphism design system and CSS variables
│   │   ├── pages/             # Authentication, Dashboard, Job, Profile pages
│   │   └── components/        # Navbar, NotificationSystem, Modals
│   └── package.json           # Vite and npm configuration
│
└── uploads/
    ├── resumes/               # Uploaded candidate resume files
    └── photos/                # Uploaded profile pictures
```

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **Hybrid Scoring** | Combining heuristics with AI avoids over-reliance on a black box while benefiting from natural language understanding |
| **State-Based Navigation** | Centralized React state reduces complexity and keeps navigation role-aware without an external routing library |
| **OTP Verification** | Ensures email ownership before account activation, preventing spam registrations |
| **Apache Tika** | Handles all binary file formats uniformly without format-specific parsers, making the system extensible |
| **In-Memory WebSocket Broker** | Sufficient for the current scale and avoids the overhead of an external message queue like RabbitMQ |

---

> Built with Spring Boot, React 19, and Google Gemini AI
