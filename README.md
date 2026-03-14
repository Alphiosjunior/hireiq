# HireIQ

An AI-powered career coach built for junior developers navigating the job market.

I built this because I was struggling with the same problems it solves — applying to jobs without knowing how well my CV matched, failing interviews without structured preparation, and losing track of where I had applied.

## Demo

[![HireIQ Demo](https://img.youtube.com/vi/hbGbsIawUyk/0.jpg)](https://youtu.be/hbGbsIawUyk)

## How it works

The app has three services running together. React handles everything you see in the browser. Java Spring Boot handles storing and retrieving your data. Python FastAPI handles all communication with the AI.

**Dashboard — CV Analyzer**

You paste your CV and a job description. The frontend sends both to the Python service which builds a specific instruction for the AI — telling it to act as a technical recruiter and ATS specialist, compare the two documents, and return a structured result. The AI reads both, reasons about them like a recruiter would, and returns a match score out of 100, the ATS keywords it found in your CV, the ATS keywords that are missing from your CV, three strengths, three gaps, and a two sentence summary. ATS stands for Applicant Tracking System — it is the software most companies use to automatically filter CVs before a human sees them. If your CV does not contain the right keywords from the job description, it gets rejected automatically even if you are qualified. This feature tells you exactly which keywords you need to add.

**Applications Page — Job Tracker**

When you fill in the form and click Save, the frontend sends the data to the Java backend which saves it to the database on your computer. The database remembers your applications even when you close the app. Each application card has an Analyze button — when you click it, the app takes the job description you saved for that application, combines it with your CV, sends both to the Python AI service, gets a match score back and saves it permanently against that application. This way you can see at a glance how strong each application is.

**Interview Prep Page**

You paste your CV and a job description and the frontend sends both to the Python service. This time the instruction to the AI is different — it is told to act as a senior technical interviewer and generate questions that would genuinely be asked in an interview for that specific role, based on that specific CV. It returns three technical questions, three behavioural questions and three smart questions you should ask the interviewer, each with a model answer. Because the AI reads the actual job description, the questions change depending on the role. A Java job gives you Java questions. A data engineering job gives you different questions entirely. Each question is a collapsible card so you can test yourself by reading the question first and then clicking to reveal the model answer.

**CV and job description persist across pages** so you only paste once per session. Whatever you paste on the Dashboard is already there when you go to Interview Prep.

## Architecture

```
Frontend (React + TypeScript) — port 5173
        ↓
Java Spring Boot API — port 8081
        ↓
Python FastAPI AI Service — port 8000
        ↓
Groq API (Llama 3.3 70b)
```

## Tech Stack

**Frontend**

- React with TypeScript
- Vite
- React Router

**Backend**

- Java Spring Boot 3.5
- Spring Data JPA
- H2 file-based database (dev)

**AI Service**

- Python FastAPI
- Groq API — Llama 3.3 70b

## Running locally

You need Java 17+, Python 3.11+, and Node.js installed.

Start all three services in separate terminal tabs.

**AI Service**

```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

**Backend**

```bash
cd backend
./mvnw spring-boot:run
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173

## Environment variables

Create `ai-service/.env` with your Groq API key:

```
GROQ_API_KEY=your_groq_api_key_here
```

Get a free key at console.groq.com

## Screenshots

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Applications

![Applications](screenshots/applications.png)

### Interview Prep

![Interview Prep](screenshots/interview-prep.png)

## Author

Alphiosjunior Ngqele

- GitHub: [@Alphiosjunior](https://github.com/Alphiosjunior)
- LinkedIn: [Alphiosjunior Ngqele](https://www.linkedin.com/in/alphiosjunior-iviwe-ngqele-8b510127a/)
- Email: ngqeleiviwe@gmail.com
