let currentIndex = 0;
let isTimerRunning = false;
let expectedText = "";
let timerInterval;
let attemptNumber = 1; // Initialize attemptNumber
let totalTypedCharacters = 0; // Global variable to store total characters typed by the user
let totalCorrectCharacters = 0; // Global variable to store total correct characters typed by the user
const attemptsData = JSON.parse(localStorage.getItem("attempts")) || []; //To retrieve data from local storage
const textContainer = document.getElementById("testText");
const testInput = document.getElementById("testInput");
const timerElement = document.getElementById("timer");
const squareStyleElement = document.querySelector(".square-style");
const resultsTable = document.getElementById("results-table");
const feedbackMessage = document.getElementById("feedback-message");
const buttonContainer = document.querySelector(".buttonContainer");

// To retrieve data from the JSON File
function fetchContent() {
  fetch("content.json")
    .then((response) => response.json())
    .then((data) => {
      expectedText = data.text.join(" ");
      updateDisplayedText();
    })
    .catch((error) => console.error("Error fetching JSON Data:", error));
}

function updateDisplayedText() {
  const newPhrase = expectedText.substring(currentIndex, currentIndex + 100);
  const formattedPhrase = newPhrase
    .split("")
    .map((char, index) => {
      return `<span id="char${index}" class="char">${char}</span>`;
    })
    .join("");
  textContainer.innerHTML = formattedPhrase;
}
//To update the background color of charachters on display
function colorUpdate(element, userChar, expectedChar) {
  if (userChar === expectedChar) {
    element.style.backgroundColor = "#1FAB89";
  } else if (userChar === "") {
    element.style.backgroundColor = "transparent";
  } else {
    element.style.backgroundColor = "#FF395E";
  }
}

//To rest the testing session
function resetTest() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  currentIndex = 0;
  testInput.value = "";
  fetchContent();
  testInput.disabled = false;

  // Clear the results display
  squareStyleElement.style.display = "none";
  resultsTable.style.display = "none";
  feedbackMessage.style.display = "none";
  totalTypedCharacters = 0;
  totalCorrectCharacters = 0;
  // Reset the timer display
  timerElement.textContent = "60";

  // Remove the "Try again" button if it exists
  const tryAgainButton = document.querySelector(".time-remaining-box");
  if (tryAgainButton) {
    buttonContainer.removeChild(tryAgainButton);
  }
}

//to handle the user interactions
function setUpTestInteractions() {
  document.getElementById("actionStart").addEventListener("click", startTest);
  testInput.addEventListener("input", userInput);
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      resetTest();
      startCountdown(60);
    }
  });
  testInput.disabled = true;
}

//To add a new buttom once a session is completed
function addNewButtonAndReload() {
  const newButton = document.createElement("button");
  newButton.textContent = "Try again";
  newButton.classList.add("time-remaining-box");
  newButton.addEventListener("click", function () {
    window.location.reload();
  });
  buttonContainer.appendChild(newButton);
}

//To start the test session and timer
function startTest() {
  if (!isTimerRunning) {
    isTimerRunning = true;
    currentIndex = 0; // Reset currentIndex here
    fetchContent();
    startCountdown(60);
    testInput.disabled = false;
    squareStyleElement.innerHTML = "";

    setTimeout(() => {
      addNewButtonAndReload();
    }, 60 * 1000);
  }
}

//To manipulate and keep track of the user Input
function userInput() {
  if (isTimerRunning) {
    const userInput = testInput.value;
    const displayedChars = document.querySelectorAll(".char");
    let correctCharactersThisSegment = 0;

    for (let i = 0; i < displayedChars.length; i++) {
      const char = displayedChars[i];
      const userChar = userInput[i] || "";
      const expectedChar = expectedText[currentIndex + i];
      colorUpdate(char, userChar, expectedChar);

      if (userChar === expectedChar) {
        correctCharactersThisSegment++;
      }
    }

    if (userInput.length >= 100) {
      totalTypedCharacters += 100;
      totalCorrectCharacters += correctCharactersThisSegment;
      currentIndex += 100;

      if (currentIndex < expectedText.length) {
        testInput.value = "";
        updateDisplayedText(); // Update the displayed text to the user
      } else {
        calculateTypingSpeed();
      }
    }
  }
}

//to Keep track of the session timing
function updateTimerMessage(message) {
  const timerblock = document.querySelector(".time-remaining-box");
  timerblock.textContent = message;
}

function startCountdown(seconds) {
  let remainingSeconds = seconds;
  timerElement.textContent = remainingSeconds;

  timerInterval = setInterval(() => {
    remainingSeconds--;
    timerElement.textContent = remainingSeconds;

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      calculateTypingSpeed();
      testInput.disabled = true;
      updateTimerMessage("Time's up!!!");

      resultsTable.style.display = "table";
      feedbackMessage.style.display = "block";
    }
  }, 1000);
}

//To display previous typing attempts
function displayPreviousAttempts() {
  attemptsData.forEach((attempt) => {
    displayResults(attempt.attemptNumber, attempt.speed, attempt.accuracy);
  });
}

//to calculate the typing speed and accuracy of the user
function calculateTypingSpeed() {
  const charactersInLastSegment = testInput.value.length;
  let correctCharactersInLastSegment = 0;

  for (let i = 0; i < charactersInLastSegment; i++) {
    const userChar = testInput.value[i];
    const expectedChar = expectedText[currentIndex + i];

    if (userChar === expectedChar) {
      correctCharactersInLastSegment++;
    }
  }

  totalTypedCharacters += charactersInLastSegment;
  totalCorrectCharacters += correctCharactersInLastSegment;
  const typingAccuracy = Math.round(
    (totalCorrectCharacters / totalTypedCharacters) * 100
  );
  const typingSpeedWPM = Math.round(totalTypedCharacters / 5);

  //to determine a message to be dispalyed based on speed
  const message =
    typingSpeedWPM <= 30
      ? "Based on your results you Type like a Turtle 🐢"
      : typingSpeedWPM <= 40
      ? "Based on your results you Type like Grandma 👵🏼"
      : typingSpeedWPM <= 55
      ? "Based on your results you Type like a Good Programmer 👩🏻‍💻"
      : "Wow!!! You Type like a superhero 🦸🏻‍♀️";

  const newAttempt = {
    attemptNumber: attemptsData.length + 1,
    speed: typingSpeedWPM,
    accuracy: typingAccuracy,
  };
  attemptsData.push(newAttempt);
  localStorage.setItem("attempts", JSON.stringify(attemptsData));

  displayResults(
    newAttempt.attemptNumber,
    typingSpeedWPM,
    typingAccuracy,
    message
  );
}

function displayResults(
  attemptNumber,
  typingSpeedWPM,
  typingAccuracy,
  message
) {
  const resultsTableBody = document.getElementById("results-body");

  // Append the new attempt result to the results table
  const newResultsRow = document.createElement("tr");
  const attemptNumberCell = document.createElement("td");
  const speedCell = document.createElement("td");
  const accuracyCell = document.createElement("td");

  attemptNumberCell.textContent = attemptNumber;
  speedCell.textContent = typingSpeedWPM;
  accuracyCell.textContent = typingAccuracy;

  newResultsRow.appendChild(attemptNumberCell);
  newResultsRow.appendChild(speedCell);
  newResultsRow.appendChild(accuracyCell);

  resultsTableBody.appendChild(newResultsRow);

  feedbackMessage.textContent = message;

  compareAttempts();
}

//to compare the user speed following each attempt
function compareAttempts() {
  if (attemptsData.length > 1) {
    const currentAttempt = attemptsData[attemptsData.length - 1];
    const previousAttempt = attemptsData[attemptsData.length - 2];

    let improvementMessage = "Your Speed have improved! 🎉";
    if (currentAttempt.speed < previousAttempt.speed) {
      improvementMessage = "You were faster before! 😟";
    } else if (currentAttempt.speed === previousAttempt.speed) {
      improvementMessage = "You are consistent! keep practicing 😃";
    }

    feedbackMessage.innerHTML += "<br><br>" + improvementMessage;
  }
}

setUpTestInteractions();
displayPreviousAttempts();
