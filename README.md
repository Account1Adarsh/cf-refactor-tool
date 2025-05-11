# CF Refactor Tool

A web app that scrapes top Codeforces submissions, uses AI to refactor and explain them,  
and serves them via a Django + React stack.

# CF Refactor Tool

*A Django + React application that fetches top Codeforces submissions, refactors them via Gemini API, and provides line-by-line explanations.*

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Setup & Installation](#setup--installation)
4. [Architecture](#architecture)

   * Diagram
5. [Screenshots](#screenshots)
6. [API Reference](#api-reference)
7. [User Guide](#user-guide)
8. [Contributing](#contributing)
9. [License](#license)

---

## Features

* **Fetch Submissions**: Pulls the top N accepted submissions for a given problem ID.
* **Code Refactoring**: Sends code to Google’s Gemini API for structure cleanup and comments.
* **Line-by-Line Explanations**: Generates human-readable explanations alongside the code.
* **User Profiles**: (future) Save favorite explanations and view history.

---

## Tech Stack

* **Backend**: Django, Django REST Framework
* **Frontend**: React, Axios
* **Scraping**: BeautifulSoup / Codeforces API
* **AI Integration**: Google Gemini API
* **Deployment**: Docker, GitHub Actions for CI

---

## Setup & Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Account1Adarsh/cf-refactor-tool.git
   cd cf-refactor-tool
   ```

2. **Backend Setup**

   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Environment Variables**
   Create a `.env` file in `backend/` with:

   ```bash
   DJANGO_SECRET_KEY=your_secret_key
   CODEFORCES_API_KEY=optional_if_using
   GEMINI_API_KEY=your_gemini_key
   ```

4. **Database Migration & Superuser**

   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. **Run Backend Server**

   ```bash
   python manage.py runserver
   ```

6. **Frontend Setup & Run**

   ```bash
   cd ../frontend
   npm install
   npm start
   ```

Your application should now be running at `http://localhost:3000` (frontend) and `http://localhost:8000` (API).

---

## Architecture

![Architecture Diagram](docs/architecture.png)

**Description:**

1. **React Frontend** sends REST requests to Django API.
2. **Django Backend** handles user input, invokes scraping or Codeforces API.
3. **Scraper Module** fetches problem statement and accepted submissions.
4. **LLM Module** calls Gemini API to refactor and explain code.
5. **Response** returns JSON containing cleaned code and explanations.

---

## API Reference

### 1. `POST /api/fetch/`

Fetches top accepted submissions and problem statement.

**Request Body:**

```json
{
  "problem_id": "123A",
  "top_n": 3
}
```

**Response:**

```json
{
  "problem": {
    "id": "123A",
    "title": "Example Problem",
    "statement": "..."
  },
  "submissions": [
    {"submission_id": 100001, "code": "..."},
    {"submission_id": 100002, "code": "..."},
    {"submission_id": 100003, "code": "..."}
  ]
}
```

### 2. `POST /api/refactor/`

Sends selected submission code to Gemini API for refactoring and explanation.

**Request Body:**

```json
{
  "submission_id": 100001,
  "code": "...",
  "options": {
    "add_comments": true,
    "optimize_complexity": false
  }
}
```

**Response:**

```json
{
  "refactored_code": "def solve(): ...",
  "explanations": [
    {"line": 1, "comment": "Reads inputs."},
    {"line": 2, "comment": "Initializes variables."},
    ...
  ]
}
```

> **Tip:** You can explore these endpoints in the Django REST Framework browsable API at `http://localhost:8000/api/`.

---

## User Guide

1. **Enter a Problem ID** on the home page (e.g., `1562B`).
2. **Choose Top N** submissions to analyze (default is 3).
3. **Click "Fetch"** to retrieve the problem statement and code.
4. **Review & Select** which submission to refactor.
5. **Set Options**: toggle comment insertion or complexity optimization.
6. **Click "Refactor"** to see the cleaned-up code and line-by-line explanations.

> **Pro Tip:** Use it after a contest to understand faster or more elegant solutions by top performers.

---

## Contributing

1. Fork the repo
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## License

MIT © Account1Adarsh
Learning purpose project