function displayText() {
  document.getElementById("actionStart").addEventListener(
    "click",
    function () {
      // Fetch the JSON file
      fetch("content.json")
        .then((response) => response.json())
        .then((data) => {
          // Extract data from JSON
          const text = data.text;

          // Display the text to the user
          const textContainer = document.getElementById("testText");
          textContainer.innerHTML = `
                  <h2>${text}</h2>
               
              `;
        })
        .catch((error) => console.error("Error fetching JSON:", error));
    },
    console.log("you clicked me emna!")
  );
}

function startCountdown(duration) {
  const timerDisplay = document.getElementById("timer");
  let timer = duration;

  const countdownInterval = setInterval(function () {
    timerDisplay.textContent = timer;

    if (--timer < 0) {
      clearInterval(countdownInterval);
      timerDisplay.textContent = "Time's up!";
    }
  }, 1000);
}

function displayTime() {
  document.getElementById("actionStart").addEventListener("click", function () {
    startCountdown(60);
  });
}

function userInput() {
  const userInputText = document.getElementById("testInput");
  const timerDisplay = document.getElementById("timer");

  // Check if the timer is still running and the user input matches the extracted text
  if (timerDisplay === "0") {
    userInputText.disabled = true;
  } else {
    userInputText.disabled = false;
  }
}

// Add event listener to the "input" event of the userInputText
document.getElementById("testInput").addEventListener("input", userInput);

displayText();
displayTime();
userInput();
