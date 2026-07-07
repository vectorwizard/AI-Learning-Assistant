# 📚 AI Learning Assistant

Upload your PDF study materials and let AI transform them into an
interactive learning experience. Chat with your documents, generate
summaries, understand difficult concepts, and automatically create
flashcards and quizzes---all from a single application.

**🌐 Live Demo:** https://ai-learning-assistant-ruby-chi.vercel.app

------------------------------------------------------------------------

## 📖 Overview

Studying from lengthy PDFs often involves repeatedly reading the same
content, manually creating notes, and designing your own practice
questions. **AI Learning Assistant** simplifies this process by
converting uploaded documents into an intelligent study companion.

Built using the **MERN Stack (MongoDB, Express.js, React, Node.js)**,
the application uses **Google Gemini API** to provide AI-powered
document chat, summaries, concept explanations, flashcard generation,
and quiz generation. All study resources and progress are managed from a
unified dashboard.

------------------------------------------------------------------------

## ✨ Features

-   **Dashboard**
    -   View document, flashcard, and quiz statistics
    -   Track recent learning activity
-   **Document Management**
    -   Upload and organize PDF study materials
    -   View document-specific flashcard and quiz counts
-   **Document Viewer**
    -   Read extracted document text in a paginated viewer
-   **AI Chat**
    -   Ask questions about a document
    -   Receive context-aware responses grounded in its content
-   **AI Actions**
    -   Generate concise document summaries
    -   Explain specific concepts from uploaded documents
-   **Flashcards**
    -   Generate flashcard sets automatically
    -   Review and favorite important cards
-   **Quizzes**
    -   Generate multiple-choice quizzes
    -   Submit answers and receive instant scores
    -   Review correct answers after every attempt
-   **Profile Management**
    -   Update account information
    -   Change password securely
-   **JWT Authentication**
    -   Secure authentication and authorization for all protected routes

------------------------------------------------------------------------

## 🏗️ Architecture

``` mermaid
flowchart LR
    subgraph Client["React Client (JSX)"]
        UI[Dashboard / Documents / Quizzes / Profile]
    end

    subgraph Server["Express API"]
        Auth[Authentication]
        Doc[Document Routes]
        AI[AI Routes]
        Flash[Flashcard Routes]
        Quiz[Quiz Routes]
        Progress[Progress Routes]
    end

    DB[(MongoDB)]
    Gemini[Google Gemini API]
    Storage[Multer Uploads]

    UI --> Auth
    UI --> Doc
    UI --> AI
    UI --> Flash
    UI --> Quiz
    UI --> Progress

    Auth --> DB
    Doc --> DB
    Doc --> Storage
    AI --> Gemini
    Flash --> DB
    Flash --> Gemini
    Quiz --> DB
    Quiz --> Gemini
    Progress --> DB
```

------------------------------------------------------------------------

## 🛠️ Tech Stack

  Layer            Technology
  ---------------- -------------------------------------
  Frontend         React (JavaScript), Vite
  Backend          Node.js, Express.js
  Database         MongoDB Atlas
  Authentication   JWT
  AI               Google Gemini API
  File Uploads     Multer
  Deployment       Vercel (Frontend), Render (Backend)

------------------------------------------------------------------------

## 🚀 Deployment

  Service    Platform
  ---------- ---------------
  Frontend   Vercel
  Backend    Render
  Database   MongoDB Atlas

------------------------------------------------------------------------

## 📁 Project Structure

``` text
ai-learning-assistant/
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── utils/
└── backend/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── uploads/
    │   └── documents/
    └── utils/
```

------------------------------------------------------------------------

## 📸 Screenshots

Add screenshots inside the `screenshots/` directory.

-   Dashboard
-   Documents
-   Document Viewer
-   AI Chat
-   AI Actions
-   Flashcards
-   Quizzes
-   Quiz Results

------------------------------------------------------------------------

## 🔄 How It Works

1.  Upload a PDF document.
2.  Read the extracted content.
3.  Chat with the document or use AI actions.
4.  Generate flashcards or quizzes.
5.  Review quiz results and improve through multiple attempts.
6.  Track overall learning progress from the dashboard.

------------------------------------------------------------------------

## 🔌 API Overview

The backend exposes the following REST endpoints.

### Authentication --- `/api/auth`

-   POST `/register`
-   POST `/login`
-   GET `/profile`
-   PUT `/profile`
-   POST `/change-password`

### Documents --- `/api/documents`

-   POST `/upload`
-   GET `/`
-   GET `/:id`
-   DELETE `/:id`

### AI --- `/api/ai`

-   POST `/generate-summary`
-   POST `/generate-flashcards`
-   POST `/generate-quiz`
-   POST `/chat`
-   POST `/explain-concept`
-   GET `/chat-history/:documentId`

### Flashcards --- `/api/flashcards`

-   GET `/`
-   GET `/:documentId`
-   POST `/:cardId/review`
-   PUT `/:cardId/star`
-   DELETE `/:id`

### Quizzes --- `/api/quizzes`

-   GET `/:documentId`
-   GET `/quiz/:id`
-   POST `/:id/submit`
-   GET `/:id/results`
-   DELETE `/:id`

### Progress --- `/api/progress`

-   GET `/dashboard`

All protected routes require a valid JWT Bearer token.

------------------------------------------------------------------------

## 🔐 Security

-   JWT-based authentication for protected routes.
-   Passwords are securely hashed before storage.
-   Gemini API key remains on the backend.
-   CORS is configured using the `CLIENT_URL` environment variable.
-   Uploaded documents are isolated per authenticated user.

------------------------------------------------------------------------

## 📂 Static File Serving

Uploaded files are stored inside the backend `uploads/` directory and
are served through Express using the `/uploads` route.

Example:

``` text
http://localhost:8000/uploads/documents/example.pdf
```

------------------------------------------------------------------------

## ⚙️ Getting Started

### Prerequisites

-   Node.js 18+
-   MongoDB Atlas
-   Google Gemini API Key

### Backend

``` bash
cd backend
npm install
```

Create `.env`

``` env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
```

Run:

``` bash
npm run server
```

Backend:

``` text
http://localhost:8000
```

### Frontend

``` bash
cd frontend
npm install
```

Create `.env`

``` env
VITE_API_URL=http://localhost:8000
```

Run:

``` bash
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

## 🗺️ Roadmap

-   Spaced repetition scheduling
-   DOCX and PPTX support
-   Learning analytics
-   Shareable flashcard sets
-   Adaptive quiz difficulty

------------------------------------------------------------------------

## 🙏 Acknowledgments

-   Google Gemini API
-   MongoDB Atlas
-   React
-   Express.js
-   Vercel
-   Render

------------------------------------------------------------------------

## 👨‍💻 Author

**Arijit Roy**

If you found this project useful, consider giving it a ⭐ on GitHub.
