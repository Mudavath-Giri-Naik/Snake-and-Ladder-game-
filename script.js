// Constants
const boardSize = 100;
const snakes = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78
};
const ladders = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100
};

const codingQuestions = [
  {
    question: "What is the output of `console.log(typeof null)`?",
    choices: ["object", "null", "undefined", "number"],
    correctAnswer: "object"
  },
  // Add more questions as needed
];

let playerPosition = 1;
let isQuestionActive = false; // To check if a question is being answered
let gameOver = false; // To track if the game is over

// Initialize board
const board = document.getElementById('board');
for (let i = boardSize; i > 0; i--) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.id = `cell-${i}`;
  cell.innerText = i;

  if (snakes[i]) cell.classList.add('snake');
  else if (ladders[i]) cell.classList.add('ladder');
  if (i === 100) cell.classList.add('unique'); // Add unique class to cell 100

  board.appendChild(cell);
}

// Audio elements
const diceSound = document.getElementById('diceSound');
const ladderSound = document.getElementById('ladderSound');
const snakeSound = document.getElementById('snakeSound');
const winSound = document.getElementById('winSound');

// Roll Dice
document.getElementById('rollDiceBtn').addEventListener('click', rollDice);

function rollDice() {
  if (isQuestionActive || gameOver) return; // Stop the dice roll if a question is being answered or the game is over

  diceSound.play();
  const diceResult = Math.floor(Math.random() * 6) + 1;
  document.getElementById('diceResult').innerText = diceResult;
  movePlayer(diceResult);
}

function movePlayer(diceResult) {
  let newPosition = playerPosition + diceResult;
  if (newPosition > boardSize) {
    return; // Don't move if the roll goes beyond 100
  }

  if (snakes[newPosition]) {
    showQuestionPopup(newPosition);
  } else if (ladders[newPosition]) {
    ladderSound.play();
    updatePlayerPosition(ladders[newPosition]);
  } else if (newPosition === boardSize) {
    winSound.play();
    showGameOverPopup(); // Show Game Over popup
    resetGame();
  } else {
    updatePlayerPosition(newPosition);
  }
}

function updatePlayerPosition(newPosition) {
  document.getElementById(`cell-${playerPosition}`).classList.remove('player');
  document.getElementById(`cell-${newPosition}`).classList.add('player');
  playerPosition = newPosition;
  document.getElementById('playerPosition').innerText = playerPosition;
}

// Show Question Popup
function showQuestionPopup(snakePosition) {
  isQuestionActive = true; // Disable dice roll while the question is active

  const questionPopup = document.getElementById('questionPopup');
  const questionText = document.getElementById('questionText');
  const choicesContainer = document.getElementById('choicesContainer');
  const submitAnswerBtn = document.getElementById('submitAnswerBtn');

  // Randomly select a question
  const question = codingQuestions[Math.floor(Math.random() * codingQuestions.length)];
  questionText.innerText = question.question;

  // Clear previous choices
  choicesContainer.innerHTML = '';
  
  // Display choices
  question.choices.forEach(choice => {
    const choiceButton = document.createElement('button');
    choiceButton.classList.add('choice-button');
    choiceButton.innerText = choice;
    choiceButton.onclick = () => {
      checkAnswer(choice, question.correctAnswer, snakePosition);
    };
    choicesContainer.appendChild(choiceButton);
  });

  questionPopup.classList.remove('hidden');
}

function checkAnswer(userAnswer, correctAnswer, snakePosition) {
  const questionPopup = document.getElementById('questionPopup');
  
  if (userAnswer === correctAnswer) {
    questionPopup.classList.add('correct');
    setTimeout(() => {
      questionPopup.classList.add('hidden');
      updatePlayerPosition(snakes[snakePosition]); // Move the player to the snake's position
      isQuestionActive = false; // Re-enable dice rolling
    }, 0); // Wait for 3 seconds before moving the player
  } else {
    questionPopup.classList.add('wrong');
    setTimeout(() => {
      questionPopup.classList.add('hidden');
      resetGame(); // Reset the game if the answer is wrong
    }, 0); // Wait for 3 seconds before resetting the game
  }
}

// Show Game Over Popup
function showGameOverPopup() {
  const gameOverPopup = document.getElementById('gameOverPopup');
  gameOverPopup.classList.remove('hidden');
  gameOver = true;
  setTimeout(() => {
    gameOverPopup.classList.add('hidden');
  }, 0); // Close the Game Over popup after 3 seconds
}

// Reset Game
function resetGame() {
  playerPosition = 1;
  document.getElementById('playerPosition').innerText = playerPosition;
  document.getElementById(`cell-${playerPosition}`).classList.add('player');
  gameOver = false;
  isQuestionActive = false;
  document.getElementById('diceResult').innerText = '';
}
