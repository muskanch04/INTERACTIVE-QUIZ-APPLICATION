class QuizApp {
  constructor() {
    this.questions = [
      {
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlink and Text Markup Language",
        ],
        correct: 0,
      },
      {
        question: "Which CSS property is used to change the text color?",
        options: ["font-color", "text-color", "color", "foreground-color"],
        correct: 2,
      },
      {
        question: "What does JavaScript primarily add to web pages?",
        options: ["Styling", "Structure", "Interactivity", "Database connectivity"],
        correct: 2,
      },
      {
        question: "Which HTML tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correct: 1,
      },
      {
        question: "What is the correct way to declare a JavaScript variable?",
        options: ["variable myVar;", "var myVar;", "declare myVar;", "v myVar;"],
        correct: 1,
      },
      {
        question: "Which CSS property controls the spacing between elements?",
        options: ["spacing", "margin", "padding", "Both margin and padding"],
        correct: 3,
      },
      {
        question: "What does CSS stand for?",
        options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
        correct: 1,
      },
      {
        question: "Which JavaScript method is used to add an element to an array?",
        options: ["add()", "append()", "push()", "insert()"],
        correct: 2,
      },
      {
        question: "What is the correct HTML tag for the largest heading?",
        options: ["<h6>", "<heading>", "<h1>", "<header>"],
        correct: 2,
      },
      {
        question: "Which symbol is used for comments in JavaScript?",
        options: ["//", "/*", "#", "<!--"],
        correct: 0,
      },
    ]

    this.currentQuestion = 0
    this.score = 0
    this.timeLeft = 30
    this.timer = null
    this.userAnswers = []
    this.isAnswered = false

    this.initializeElements()
    this.bindEvents()
    this.showScreen("welcome")
  }

  initializeElements() {
    // Screens
    this.welcomeScreen = document.getElementById("welcome-screen")
    this.quizScreen = document.getElementById("quiz-screen")
    this.resultsScreen = document.getElementById("results-screen")
    this.reviewScreen = document.getElementById("review-screen")

    // Buttons
    this.startBtn = document.getElementById("start-btn")
    this.nextBtn = document.getElementById("next-btn")
    this.restartBtn = document.getElementById("restart-btn")
    this.reviewBtn = document.getElementById("review-btn")
    this.backToResultsBtn = document.getElementById("back-to-results")

    // Quiz elements
    this.questionText = document.getElementById("question-text")
    this.optionsContainer = document.getElementById("options-container")
    this.questionCounter = document.getElementById("question-counter")
    this.currentScoreEl = document.getElementById("current-score")
    this.progressFill = document.getElementById("progress-fill")
    this.timerText = document.getElementById("timer-text")
    this.timerCircle = document.getElementById("timer-circle")

    // Results elements
    this.finalScore = document.getElementById("final-score")
    this.correctAnswers = document.getElementById("correct-answers")
    this.wrongAnswers = document.getElementById("wrong-answers")
    this.accuracyPercentage = document.getElementById("accuracy-percentage")
    this.performanceMessage = document.getElementById("performance-message")
    this.resultsEmoji = document.getElementById("results-emoji")

    // Review elements
    this.reviewContent = document.getElementById("review-content")
  }

  bindEvents() {
    this.startBtn.addEventListener("click", () => this.startQuiz())
    this.nextBtn.addEventListener("click", () => this.nextQuestion())
    this.restartBtn.addEventListener("click", () => this.restartQuiz())
    this.reviewBtn.addEventListener("click", () => this.showReview())
    this.backToResultsBtn.addEventListener("click", () => this.showScreen("results"))
  }

  showScreen(screenName) {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active")
    })

    const targetScreen = document.getElementById(`${screenName}-screen`)
    if (targetScreen) {
      targetScreen.classList.add("active")
    }
  }

  startQuiz() {
    this.currentQuestion = 0
    this.score = 0
    this.userAnswers = []
    this.showScreen("quiz")
    this.loadQuestion()
    this.startTimer()
  }

  loadQuestion() {
    const question = this.questions[this.currentQuestion]
    this.questionText.textContent = question.question
    this.questionCounter.textContent = `${this.currentQuestion + 1} of ${this.questions.length}`
    this.updateProgress()
    this.isAnswered = false
    this.nextBtn.disabled = true

    // Clear previous options
    this.optionsContainer.innerHTML = ""

    // Create option buttons
    question.options.forEach((option, index) => {
      const optionEl = document.createElement("div")
      optionEl.className = "option"
      optionEl.textContent = option
      optionEl.addEventListener("click", () => this.selectOption(index))
      this.optionsContainer.appendChild(optionEl)
    })

    this.resetTimer()
  }

  selectOption(selectedIndex) {
    if (this.isAnswered) return

    this.isAnswered = true
    this.stopTimer()

    const question = this.questions[this.currentQuestion]
    const options = document.querySelectorAll(".option")

    // Store user answer
    this.userAnswers[this.currentQuestion] = selectedIndex

    // Show correct/incorrect feedback
    options.forEach((option, index) => {
      option.classList.add("disabled")
      if (index === question.correct) {
        option.classList.add("correct")
      } else if (index === selectedIndex && index !== question.correct) {
        option.classList.add("wrong")
      }
    })

    // Update score
    if (selectedIndex === question.correct) {
      this.score += 10
      this.updateScore()
      this.showFeedback(true)
    } else {
      this.showFeedback(false)
    }

    // Enable next button
    this.nextBtn.disabled = false

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (this.currentQuestion < this.questions.length - 1) {
        this.nextQuestion()
      } else {
        this.showResults()
      }
    }, 2000)
  }

  showFeedback(isCorrect) {
    const feedbackEl = document.createElement("div")
    feedbackEl.className = `feedback ${isCorrect ? "correct" : "wrong"}`
    feedbackEl.textContent = isCorrect ? "✓ Correct!" : "✗ Wrong!"
    feedbackEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${isCorrect ? "#28a745" : "#dc3545"};
            color: white;
            padding: 20px 40px;
            border-radius: 50px;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 1000;
            animation: feedbackPop 0.5s ease-out;
        `

    // Add animation keyframes
    if (!document.querySelector("#feedback-styles")) {
      const style = document.createElement("style")
      style.id = "feedback-styles"
      style.textContent = `
                @keyframes feedbackPop {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    50% { transform: translate(-50%, -50%) scale(1.1); }
                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            `
      document.head.appendChild(style)
    }

    document.body.appendChild(feedbackEl)

    setTimeout(() => {
      feedbackEl.remove()
    }, 1500)
  }

  nextQuestion() {
    this.currentQuestion++
    if (this.currentQuestion < this.questions.length) {
      this.loadQuestion()
      this.startTimer()
    } else {
      this.showResults()
    }
  }

  startTimer() {
    this.timeLeft = 30
    this.updateTimerDisplay()

    this.timer = setInterval(() => {
      this.timeLeft--
      this.updateTimerDisplay()

      if (this.timeLeft <= 0) {
        this.timeUp()
      }
    }, 1000)
  }

  updateTimerDisplay() {
    this.timerText.textContent = this.timeLeft
    const percentage = (this.timeLeft / 30) * 360
    this.timerCircle.style.background = `conic-gradient(#667eea ${percentage}deg, #e9ecef ${percentage}deg)`

    // Change color when time is running out
    if (this.timeLeft <= 10) {
      this.timerCircle.style.background = `conic-gradient(#dc3545 ${percentage}deg, #e9ecef ${percentage}deg)`
    }
  }

  resetTimer() {
    this.timeLeft = 30
    this.updateTimerDisplay()
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  timeUp() {
    if (!this.isAnswered) {
      this.isAnswered = true
      this.stopTimer()
      this.userAnswers[this.currentQuestion] = -1 // No answer selected

      // Show correct answer
      const question = this.questions[this.currentQuestion]
      const options = document.querySelectorAll(".option")
      options.forEach((option, index) => {
        option.classList.add("disabled")
        if (index === question.correct) {
          option.classList.add("correct")
        }
      })

      this.showFeedback(false)
      this.nextBtn.disabled = false

      // Auto-advance after 2 seconds
      setTimeout(() => {
        if (this.currentQuestion < this.questions.length - 1) {
          this.nextQuestion()
        } else {
          this.showResults()
        }
      }, 2000)
    }
  }

  updateProgress() {
    const progress = ((this.currentQuestion + 1) / this.questions.length) * 100
    this.progressFill.style.width = `${progress}%`
  }

  updateScore() {
    this.currentScoreEl.textContent = this.score
  }

  showResults() {
    this.stopTimer()
    this.showScreen("results")

    const correctCount = this.userAnswers.filter((answer, index) => answer === this.questions[index].correct).length

    const wrongCount = this.questions.length - correctCount
    const accuracy = Math.round((correctCount / this.questions.length) * 100)

    this.finalScore.textContent = this.score
    this.correctAnswers.textContent = correctCount
    this.wrongAnswers.textContent = wrongCount
    this.accuracyPercentage.textContent = `${accuracy}%`

    // Set performance message and emoji
    let message, emoji
    if (accuracy >= 90) {
      message = "Outstanding! You're a quiz master! 🏆"
      emoji = "🏆"
    } else if (accuracy >= 80) {
      message = "Excellent work! Keep it up! 🌟"
      emoji = "🌟"
    } else if (accuracy >= 70) {
      message = "Good job! Room for improvement! 👍"
      emoji = "👍"
    } else if (accuracy >= 60) {
      message = "Not bad! Keep practicing! 📚"
      emoji = "📚"
    } else {
      message = "Keep learning and try again! 💪"
      emoji = "💪"
    }

    this.performanceMessage.textContent = message
    this.resultsEmoji.textContent = emoji
  }

  showReview() {
    this.showScreen("review")
    this.reviewContent.innerHTML = ""

    this.questions.forEach((question, index) => {
      const reviewItem = document.createElement("div")
      const isCorrect = this.userAnswers[index] === question.correct
      const userAnswerText =
        this.userAnswers[index] === -1 ? "No answer selected" : question.options[this.userAnswers[index]]

      reviewItem.className = `review-item ${isCorrect ? "correct" : "wrong"}`
      reviewItem.innerHTML = `
                <div class="review-question">
                    ${index + 1}. ${question.question}
                </div>
                <div class="review-answer user-answer">
                    <strong>Your answer:</strong> ${userAnswerText}
                </div>
                <div class="review-answer correct-answer">
                    <strong>Correct answer:</strong> ${question.options[question.correct]}
                </div>
            `

      this.reviewContent.appendChild(reviewItem)
    })
  }

  restartQuiz() {
    this.startQuiz()
  }
}

// Initialize the quiz when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new QuizApp()
})
