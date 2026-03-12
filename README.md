# ResumeMatcher - AI-Powered Resume Screening and Job Matching System

## Overview

ResumeMatcher is a full-stack web application that automates the resume screening process using an AI-powered matching algorithm. The system compares candidate resumes against job requirements and generates a match score, helping recruiters identify the most suitable candidates without manually reading every resume.

The application supports two types of users — Recruiters who post jobs and review candidates, and Candidates who apply for jobs and track their applications.

---

## Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Recruiter - My Jobs Dashboard
![My Jobs](screenshots/recruiter-myjobs.png)

### Recruiter - View Applicants with Match Scores
![Applicants](screenshots/recruiter-applicants.png)

### Candidate - Browse Jobs
![Browse Jobs](screenshots/candidate-browsejobs.png)

### Candidate - My Applications
![My Applications](screenshots/candidate-myapplications.png)

### Candidate - My Profile
![My Profile](screenshots/candidate-profile.png)

---

## Features

### Recruiter
- Register and login as a Recruiter
- Post new job openings with required skills and experience
- Edit and delete existing job postings
- View all applicants for each job ranked by match score
- Dashboard showing total jobs posted and total applicants

### Candidate
- Register and login as a Candidate
- Create a profile with education, experience and skills
- Upload resume as a PDF file
- Browse all available job postings
- Apply to jobs with a single click
- View AI-generated match score for every applied job
- Track all applications with applied date and match percentage

### AI Matching Algorithm
- Extracts text from the candidate's uploaded PDF resume
- Tokenizes resume text and compares it against job required skills
- Calculates a percentage match score based on matched skills
- Saves the match score with each application record
- Ranks candidates from highest to lowest match score

---

## Technology Stack

### Backend
- Java 21
- Spring Boot 3.2.5
- Spring Security 6
- Spring Data JPA
- Hibernate 6.4.4
- JWT Authentication (jjwt 0.11.5)
- Apache PDFBox (PDF text extraction)
- Lombok
- Maven

### Frontend
- React 18
- Vite
- JavaScript ES6
- CSS3

### Database
- MySQL 8
- HikariCP (connection pooling)

---

## Database Schema

**users** — stores all user accounts  
Columns: id, name, email, password, role (CANDIDATE or RECRUITER)

**candidate_profiles** — stores candidate details  
Columns: id, user_id, education, experience, resume_text

**jobs** — stores all job postings  
Columns: id, title, description, required_experience, recruiter_id, posted_at

**skills** — master list of all unique skills  
Columns: id, name

**candidate_skills** — links candidates to their skills  
Columns: candidate_id, skill_id

**job_skills** — links jobs to their required skills  
Columns: job_id, skill_id

**applications** — stores all job applications  
Columns: id, candidate_id, job_id, match_score, applied_at

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login and receive JWT token |

### Jobs
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /jobs | All users | Get all job postings |
| GET | /jobs/my | Recruiter | Get jobs posted by this recruiter |
| POST | /jobs/post | Recruiter | Create a new job |
| PUT | /jobs/update/{id} | Recruiter | Update an existing job |
| DELETE | /jobs/delete/{id} | Recruiter | Delete a job |

### Applications
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /applications/apply?jobId= | Candidate | Apply to a job |
| GET | /applications/my | Candidate | View my applications |
| GET | /applications/job/{jobId} | Recruiter | View applicants for a job |

### Candidate Profile
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /candidate/profile | Candidate | Save or update profile |
| GET | /candidate/profile | Candidate | Get profile details |
| POST | /candidate/upload-resume | Candidate | Upload PDF resume |

---

## Project Structure

```
ResumeMatcher/
│
├── src/main/java/com/hema/resumematcher/
│   │
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── JwtAuthFilter.java
│   │   ├── JwtUtil.java
│   │   ├── CorsConfig.java
│   │   └── UserDetailsServiceConfig.java
│   │
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── JobController.java
│   │   ├── ApplicationController.java
│   │   └── CandidateProfileController.java
│   │
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── JobService.java
│   │   ├── ApplicationService.java
│   │   ├── MatchingService.java
│   │   ├── CandidateProfileService.java
│   │   └── SkillService.java
│   │
│   ├── entity/
│   │   ├── User.java
│   │   ├── Job.java
│   │   ├── Application.java
│   │   ├── CandidateProfile.java
│   │   ├── Skill.java
│   │   └── Role.java
│   │
│   ├── dto/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── JobRequest.java
│   │   ├── AuthResponse.java
│   │   ├── MatchResult.java
│   │   └── CandidateProfileRequest.java
│   │
│   └── repository/
│       ├── UserRepository.java
│       ├── JobRepository.java
│       ├── ApplicationRepository.java
│       ├── CandidateProfileRepository.java
│       └── SkillRepository.java
│
├── src/main/resources/
│   └── application.properties
│
├── screenshots/
│   ├── login.png
│   ├── recruiter-myjobs.png
│   ├── recruiter-applicants.png
│   ├── candidate-browsejobs.png
│   ├── candidate-myapplications.png
│   └── candidate-profile.png
│
├── pom.xml
└── README.md
```

---

## How To Run Locally

### Requirements
- Java 21 must be installed
- MySQL 8 must be installed and running
- Node.js and npm must be installed
- Git must be installed

### Step 1 - Clone the Repository

```
git clone https://github.com/Hemapadmavathi-sanka/ResumeMatcher.git
```

### Step 2 - Create the Database

Open MySQL Workbench and run:

```sql
CREATE DATABASE resumematcher_db;
```

### Step 3 - Configure the Backend

Open the file src/main/resources/application.properties and update with your MySQL credentials:

```
spring.datasource.url=jdbc:mysql://localhost:3306/resumematcher_db?allowPublicKeyRetrieval=true&useSSL=false
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
```

### Step 4 - Run the Backend

Open the project in Spring Tools Suite (STS) and click Run as Spring Boot App.

The backend will start on: http://localhost:8080

### Step 5 - Run the Frontend

Open a terminal and run the following commands:

```
cd resumematcher-ui
npm install
npm run dev
```

The frontend will start on: http://localhost:5173

---

## Developer

Hema Padmavathi  
GitHub: https://github.com/Hemapadmavathi-sanka

---

## License

This project is built for educational and portfolio purposes.
