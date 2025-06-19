// DOM Elements
const questionElement = document.getElementById("question");
const choicesElements = document.querySelectorAll(".choice-container");
const choiceTextElements = document.querySelectorAll(".choice-text");
const progressTextElement = document.getElementById("progressText");
const scoreElement = document.getElementById("score");
const progressBarElement = document.getElementById("progressBarFull");
const loaderElement = document.getElementById("loader");
const quizElement = document.getElementById("quiz");

// Quiz Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;
const API_URL =
  "https://opentdb.com/api.php?amount=10&category=22&difficulty=easy&type=multiple";

// Quiz State
const quizState = {
  currentQuestion: null,
  isAcceptingAnswers: false,
  score: 0,
  questionCounter: 0,
  availableQuestions: [],
  questions: [],
};

// Initialize the quiz
async function initializeQuiz() {
  try {
    // Show loader while fetching questions
    loaderElement.style.display = "block";
    quizElement.classList.add("hidden");

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    quizState.questions = formatQuestions(data.results);
    startQuiz();
  } catch (error) {
    console.error("Error fetching questions:", error);
    displayError("Failed to load questions. Please try again later.");
  }
}

// Format questions from API
function formatQuestions(apiQuestions) {
  return apiQuestions.map((question) => {
    const answerChoices = [...question.incorrect_answers];
    const correctAnswerIndex = Math.floor(Math.random() * 4);
    answerChoices.splice(correctAnswerIndex, 0, question.correct_answer);

    return {
      question: decodeHtmlEntities(question.question),
      answer: correctAnswerIndex + 1,
      choices: answerChoices.map((choice) => decodeHtmlEntities(choice)),
    };
  });
}

// Decode HTML entities in questions and answers
function decodeHtmlEntities(text) {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}

// Start the quiz
function startQuiz() {
  quizState.score = 0;
  quizState.questionCounter = 0;
  quizState.availableQuestions = [...quizState.questions];
  updateScore();

  // Hide loader and show quiz
  loaderElement.style.display = "none";
  quizElement.classList.remove("hidden");

  loadNextQuestion();
}

// Load the next question
function loadNextQuestion() {
  if (
    quizState.questionCounter >= MAX_QUESTIONS ||
    quizState.availableQuestions.length === 0
  ) {
    endQuiz();
    return;
  }

  quizState.questionCounter++;
  updateProgress();

  const questionIndex = Math.floor(
    Math.random() * quizState.availableQuestions.length
  );
  quizState.currentQuestion = quizState.availableQuestions[questionIndex];
  quizState.availableQuestions.splice(questionIndex, 1);

  displayQuestion();
  quizState.isAcceptingAnswers = true;
}

// Display the current question
function displayQuestion() {
  questionElement.textContent = quizState.currentQuestion.question;

  choiceTextElements.forEach((choiceElement, index) => {
    choiceElement.textContent = quizState.currentQuestion.choices[index];
  });
}

// Update progress display
function updateProgress() {
  const progressText = `Question ${quizState.questionCounter}/${MAX_QUESTIONS}`;
  progressTextElement.textContent = progressText;

  const progressPercentage = (quizState.questionCounter / MAX_QUESTIONS) * 100;
  progressBarElement.style.width = `${progressPercentage}%`;
}

// Update score display
function updateScore() {
  scoreElement.textContent = quizState.score;
}

// Handle answer selection
function handleAnswerSelection(selectedChoice) {
  if (!quizState.isAcceptingAnswers) return;

  quizState.isAcceptingAnswers = false;
  const selectedAnswer = parseInt(selectedChoice.dataset.choice);
  const isCorrect = selectedAnswer === quizState.currentQuestion.answer;

  if (isCorrect) {
    quizState.score += CORRECT_BONUS;
    updateScore();
    selectedChoice.classList.add("correct");
  } else {
    selectedChoice.classList.add("incorrect");
    // Highlight correct answer
    const correctChoice = document.querySelector(
      `[data-choice="${quizState.currentQuestion.answer}"]`
    );
    correctChoice.classList.add("correct");
  }

  setTimeout(() => {
    selectedChoice.classList.remove("correct", "incorrect");
    const correctChoice = document.querySelector(
      `[data-choice="${quizState.currentQuestion.answer}"]`
    );
    if (correctChoice) correctChoice.classList.remove("correct");

    loadNextQuestion();
  }, 1000);
}

// End the quiz
function endQuiz() {
  localStorage.setItem("mostRecentScore", quizState.score);
  window.location.assign("end.html");
}

// Display error message
function displayError(message) {
  loaderElement.style.display = "none";
  quizElement.innerHTML = `
          <div style="text-align: center; padding: 40px; color: #d32f2f; font-size: 1.8rem;">
            <h2>Error</h2>
            <p>${message}</p>
            <button onclick="location.reload()" style="
              margin-top: 20px;
              padding: 12px 30px;
              background-color: #2e7d32;
              color: white;
              border: none;
              border-radius: 5px;
              font-size: 1.2rem;
              cursor: pointer;
            ">Try Again</button>
          </div>
        `;
  quizElement.classList.remove("hidden");
}

// Event Listeners
choicesElements.forEach((choice) => {
  choice.addEventListener("click", () => {
    handleAnswerSelection(choice);
  });
});

// Initialize the quiz
initializeQuiz();
