let currentIndex = 0;
let isTimerRunning = false;
let expectedText = "";
let timerInterval;

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

//To update the text displayed to the user
function updateDisplayedText() {
  const textContainer = document.getElementById("testText");
  const newPhrase = expectedText.substring(currentIndex, currentIndex + 100);
  const formattedPhrase = newPhrase
    .split("")
    .map((char, index) => {
      return `<span id="char${index}" class="char">${char}</span>`;
    })
    .join("");
  textContainer.innerHTML = formattedPhrase;
}

//handle the event lsiteners
function setUpTestInteractions() {
  document.getElementById("actionStart").addEventListener("click", startTest);
  document.getElementById("testInput").addEventListener("input", userInput);
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      resetTest();
      startCountdown(60);
    }
  });
  document.getElementById("testInput").disabled = true;
  const storedTypingSpeed = localStorage.getItem("typingSpeed");
  const storedTypingAccuracy = localStorage.getItem("typingAccuracy");

  if (storedTypingSpeed && storedTypingAccuracy) {
    displayUserStats(storedTypingSpeed, storedTypingAccuracy);
  }
}

function startTest() {
  if (!isTimerRunning) {
    isTimerRunning = true;
    currentIndex = 0;
    fetchContent();
    startCountdown(60);
    document.getElementById("testInput").disabled = false; // Enable user to enter their input
    document.querySelector(".square-style").innerHTML = "";

    // After 60 seconds, show the "Try again" button
    setTimeout(() => {
      addNewButton();
    }, 60 * 1000);
  }
}
function userInput() {
  if (isTimerRunning) {
    const userInputField = document.getElementById("testInput");
    const userInput = userInputField.value;
    const displayedChars = document.querySelectorAll(".char");

    for (let i = 0; i < displayedChars.length; i++) {
      const char = displayedChars[i];
      if (i < userInput.length) {
        colorUpdate(char, userInput[i], expectedText[currentIndex + i]);
      } else {
        colorUpdate(char, "", expectedText[currentIndex + i]);
      }
    }
    //to update the displayed text every 100 charac
    if (userInput.length >= 100) {
      currentIndex += 100;

      if (currentIndex % 100 === 0) {
        updateDisplayedText();
      }
    }

    if (userInput.length >= expectedText.length && !isTimerRunning) {
      calculateTypingSpeed();
    }
  }
}

function colorUpdate(element, userChar, expectedChar) {
  if (userChar === expectedChar) {
    element.style.backgroundColor = "#1FAB89";
  } else if (userChar === "") {
    element.style.backgroundColor = "transparent";
  } else {
    element.style.backgroundColor = "#FF395E";
  }
}
// Create a new button element
function addNewButton() {
  const newButton = document.createElement("button");
  newButton.textContent = "Try again";
  newButton.classList.add("time-remaining-box");
  newButton.addEventListener("click", () => {
    window.location.reload();
  });

  const buttonContainer = document.getElementsByClassName("buttonContainer")[0];
  buttonContainer.appendChild(newButton);
}

// To reload the page and start over again
function resetTest() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  currentIndex = 0;
  document.getElementById("testInput").value = "";
  fetchContent();
  document.getElementById("testInput").disabled = false;

  // Clear the results display
  const squareStyleElement = document.querySelector(".square-style");
  squareStyleElement.style.display = "none";

  // Reset the timer display
  const timerElement = document.getElementById("timer");
  timerElement.textContent = "60"; // Set it back to the initial value

  // Remove the "Try again" button if it exists
  const buttonContainer = document.getElementsByClassName("buttonContainer")[0];
  const tryAgainButton = document.querySelector(".time-remaining-box");
  if (tryAgainButton) {
    buttonContainer.removeChild(tryAgainButton);
  }
}

function updateTimerMessage(message) {
  const timerblock = document.querySelector(".time-remaining-box");
  timerblock.textContent = message;
}

// To start counter of 60 seconds
function startCountdown(seconds) {
  let remainingSeconds = seconds;
  const timerElement = document.getElementById("timer");
  timerElement.textContent = remainingSeconds;

  timerInterval = setInterval(() => {
    remainingSeconds--;
    timerElement.textContent = remainingSeconds;

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      calculateTypingSpeed();
      document.getElementById("testInput").disabled = true; // Disable input
      updateTimerMessage("Time's up!!!"); //display a time's up message
    }
  }, 1000);
}

//To calculate user's typing speed and accuracy with comments
function calculateTypingSpeed() {
  const userInput = document.getElementById("testInput").value;
  let correctCharacters = 0;
  let totalTypedCharacters = 0;

  for (let i = 0; i < userInput.length; i++) {
    const userChar = userInput[i];
    const expectedChar = expectedText[currentIndex + i];

    totalTypedCharacters++;

    if (userChar === expectedChar) {
      correctCharacters++;
    }
  }
  console.log(totalTypedCharacters);
  const typingAccuracy = (correctCharacters / totalTypedCharacters) * 100;
  const typingSpeedWPM = totalTypedCharacters / 5;

  // Determine the message based on user's typing speed
  let message = "";
  if (typingSpeedWPM <= 30) {
    message = "You Type like a Turtle 🐢";
  } else if (typingSpeedWPM <= 40) {
    message = "You Type like Grandma 👵🏼";
  } else if (typingSpeedWPM <= 55) {
    message = "You Type like a Programmer 👩🏻‍💻";
  } else {
    message = "Wow!!! You Type like a superhero 🦸🏻‍♀️";
  }

  displayResults(typingSpeedWPM, typingAccuracy, message);
  localStorage.setItem("typingSpeed", typingSpeedWPM);
  localStorage.setItem("typingAccuracy", typingAccuracy.toFixed(0));
  displayUserStats(typingSpeedWPM, typingAccuracy.toFixed(0));
}

function displayResults(typingSpeedWPM, typingAccuracy, message) {
  const squareStyleElement = document.querySelector(".square-style");
  squareStyleElement.innerHTML = `
    <p> Your Typing Speed (WPM) is ${typingSpeedWPM}</p>
    <p> Your Typing Accuracy is ${typingAccuracy.toFixed(0)}%</p>
    <p>${message}</p>
  `;
  squareStyleElement.style.display = "block";
}

setUpTestInteractions();

