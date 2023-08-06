let currentIndex = 0; // Variable to keep track of the current index in the text
let isTimerRunning = false;

function displayText() {
  let displayedText = document.getElementById("testText").textContent.trim(); // Get the text content and remove leading/trailing whitespaces
  let userInput = document.getElementById("testInput").value.trim(); // Get the user input and remove leading/trailing whitespaces

  if (displayedText === userInput) {
    retrieveNextTextSection();
  }
}

function retrieveNextTextSection() {
  // Fetch the JSON file
  fetch("content.json")
    .then((response) => response.json())
    .then((data) => {
      const text = data.text;
      const cleanText = text.join(" ");
      const remainingText = cleanText.substring(currentIndex);

      if (remainingText.length > 0) {
        const newPhrase = remainingText.substring(0, 100);
        currentIndex += 100; // Move the index to the next 100 characters

        const textContainer = document.getElementById("testText");
        textContainer.innerHTML = `<p>${newPhrase}</p>`;
      } else {
        
        console.log("No more text to display.");
      }
    })
    .catch((error) => console.error("Error fetching JSON Data:", error));
}

//this function will start the countdown of 60 seconds
function startCountdown(duration) {
  const timerDisplay = document.getElementById("timer");
  let timer = duration;

  const countdownInterval = setInterval(function () {
    if (--timer >= 0) {
      timerDisplay.textContent = timer.toString().padStart(2, "0");
    } else {
      clearInterval(countdownInterval);
      timerDisplay.textContent = "Time's up!";
      timerDisplay.parentElement.textContent = timerDisplay.textContent;
      disableUserInput();
    }
  }, 1000);
  isTimerRunning = true;
}
function disableUserInput() {
  const userInputField = document.getElementById("testInput");
  userInputField.disabled = true;
  isTimerRunning = false;
  startAgain();
  displayStats();
}

function userInput() {
  const userInputField = document.getElementById("testInput");
  if (isTimerRunning) {
    let userInput = userInputField.value.trim();
    console.log("User input:", userInput);
  }
}
function displayTime() {
  document.getElementById("actionStart").addEventListener("click", function () {
    startCountdown(60);
    displayText();
  });
  document.getElementById("testInput").addEventListener("input", function () {
    displayText();
    userInput(); 
  });
}
function startAgain() {
  if (!isTimerRunning) {
    function addNewButton() {
      // Create a new button element
      const newButton = document.createElement("button");
      newButton.textContent = "Try again";
      newButton.classList.add("time-remaining-box");
      newButton.addEventListener("click", () => {
        window.location.reload();
      });
      
      const buttonContainer =
        document.getElementsByClassName("buttonContainer")[0];
      buttonContainer.appendChild(newButton);
    }

    addNewButton();
  }
}

function displayStats() {
  if (!isTimerRunning) {
    function displaySpeedResults() {
      const newSection = document.createElement("div");
      newSection.textContent = "Your speed in WPM is: ";
      newSection.classList.add("square-style");
      const squareStyleElement = document.querySelector(".square-style");
      squareStyleElement.appendChild(newSection);
    }

    displaySpeedResults();
  }
}

displayTime();
