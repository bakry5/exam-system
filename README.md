# 📝 Exam System

A browser-based online examination platform built with vanilla JavaScript and Bootstrap 5.

## ✨ Features

- 🔐 **User Authentication** — Register & Sign In with localStorage + cookie-based session
- ⏱️ **Timed Exams** — Countdown timer with auto-submit on timeout
- 🔀 **Randomized Questions** — Questions appear in random order each session
- 🔖 **Mark for Review** — Bookmark questions and jump back to them anytime
- 📊 **Instant Results** — Score displayed immediately after finishing
- 🛡️ **Auth Guard** — Exam page is protected; redirects unauthenticated users

## 🗂️ Project Structure

```
exam-system/
├── home.html         # Landing page
├── register.html     # Registration page
├── signin.html       # Sign in page
├── exam.html         # Exam page
├── questions.json    # Questions data
├── css/
│   └── style.css     # Custom styles
└── js/
    ├── home.js       # Navbar auth state logic
    ├── register.js   # Registration form & validation
    ├── signin.js     # Sign in form & validation
    └── exam.js       # Core exam logic
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/bakry5/exam-system.git
   cd exam-system
   ```

2. Open `home.html` in your browser — or use a local server (recommended):
   ```bash
   npx serve .
   ```
   > ⚠️ A local server is required because `exam.js` fetches `questions.json` via `fetch()`, which won't work with `file://` protocol.

## 📋 How It Works

1. **Register** a new account via the Register page
2. **Sign In** with your credentials
3. **Start the Exam** — questions load randomly with a countdown timer
4. **Mark** any question for later review using the bookmark button
5. **Finish** — submit manually or wait for the timer to auto-submit
6. **View your score** instantly on the results screen

## 🛠️ Tech Stack

- HTML5, CSS3, JavaScript (ES6+)
- [Bootstrap 5.3](https://getbootstrap.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- localStorage & Cookies for session management

## ➕ Adding More Questions

Edit `questions.json` and follow this structure:

```json
{
  "id": 6,
  "text": "Your question here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswerIndex": 0
}
```

`correctAnswerIndex` is zero-based (0 = first option).
