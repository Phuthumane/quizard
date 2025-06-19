# Quizard 🧠

**Quizard** is a fast-paced, browser-based trivia game built with HTML, CSS, and JavaScript. It challenges users with multiple-choice questions pulled from the [Open Trivia Database](https://opentdb.com/) API and tracks progress with a dynamic score system and progress bar.

---

## 🎯 Features

- 10 randomized multiple-choice trivia questions
- Live score tracking and animated progress bar
- Instant feedback with correct/incorrect highlight
- End screen with final score and storage via `localStorage`
- Clean, responsive UI with smooth transitions

---

## 🌐 Live Demo

Play it here 👉 [https://phuthumane.github.io/quizard](https://phuthumane.github.io/quizard)

---

## 📡 API Used

This project fetches trivia questions from the [Open Trivia DB API](https://opentdb.com/api_config.php). Questions are dynamically loaded and randomized each time the game is started.

---

## 📁 Project Structure

quizard/
├── index.html # Landing page
├── style.css # Global styles
├── quiz/ # Quiz feature
│ ├── quiz.html
│ ├── quiz.css
│ ├── quiz.js
│ ├── end.html
├── leaderboard/ # Leaderboard feature (Top Wizards)
│ ├── topWizards.html
│ ├── topWizards.css
│ ├── topWizards.js
├── README.md
