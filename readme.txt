Project description
You will design and implement a Typing Speed Test app that allows users to test their typing speed and accuracy. The app will retrieve text from a public API (such as PoetryDB API) or a collection of text/words in JSON format in the project folder. In either case, text should be retrieved using the fetch API. The app will provide an intuitive interface to display the user's progress over time.


Requirements
Using fetch to retrieve a random piece of text from a public API or a custom collection of various English words or text pieces in JSON format.
Display the text for the user to type.
When a user starts typing, start a timer and run it for 60 seconds.
Highlight each correctly typed character in a shade of green and every incorrectly typed character in a shade of red.
Either highlight the current word or display it in a separate area.
Allow the use of backspace to undo typed characters.
When the timer ends, calculate and display the user's typing speed (WPM) and word accuracy (%). You can also calculate these metrics in real-time. 
Do not count words that were not typed correctly.
Allow the user to reset and start again with a new piece of text.
Allow using the "enter" key for restarting and the "esc" key for resetting the test.
Store the user's metrics (speed and accuracy).
Display the user's metrics over time in a visually appealing way (a table or a chart).
After each attempt, indicate whether the user has improved over their previous attempts.
Use module imports (and exports) to organize your code.

Additional comments
Interact with DOM elements for displaying text, user input, and results. You can interact with existing elements in static HTML and/or create new HTML elements using JavaScript.
Use event listeners for user interactions (e.g., detecting input, and resetting the test).
Store and retrieve user progress data using local storage.
Display errors for failed API requests and other potential issues.
Structure your code in a manner that would allow you to easily change key features without the need to know the entire codebase.
You can use external CSS and JS libraries as long as they are not directly related to the typing test logic.
Your code should be understandable by your peers. Where needed, add comments to explain non-trivial parts of your code.
If you find some requirement particularly challenging, you can try to implement it in a simpler way. For example, highlight correctly typed words instead of characters.


Reviewer role
Present the app as if you were presenting it to a potential user. You will need to demonstrate how the application works. Explain the code as if you are explaining it to a technical team lead. Focus on explaining the most complicated parts of the code and how you implemented the requirements.


Project evaluation criteria
Typing test functionality: The application works according to the requirements.
User metrics functionality: The application stores, retrieves and displays previous user results.
User experience: The application is pleasant, intuitive, and easy to use - comparable to other typing speed test sites.
Ease of making changes: The application is modeled in a way that makes it easy to change or add features.
Code organization: Small functions with a single responsibility. Functions are organized into files. Use of classes, objects or function closures where encapsulation is needed.
During a task review, you may get asked questions that test your understanding of covered topics.


Sample questions for a reviewer to ask (a reviewer is encouraged and expected to think of more, however!)

What are event listeners and how do you use them in your app?
What are higher-order functions and how did you use them in your code?
How easy would it be to {add a new feature, change an existing feature, remove a feature}?