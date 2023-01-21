// GAME MECHANICS
// Get coordinates of the game window
var offsets = document.getElementById('game-window').getBoundingClientRect();
var windowTop = offsets.top;   // y coordinate of TOP of the game window
var windowLeft = offsets.left;    // x coordinate of LEFT side of the game window
var windowRight = offsets.right;  // x coordinate of RIGHT side of the game window
var windowBottom = offsets.bottom;    // y coordinate of BOTTOM of the game window
var windowHeight = offsets.height;
var windowWidth = offsets.width;

// Create canvas of the game window
var canvas = document.getElementById('game-window');
var gameCanvas = canvas.getContext('2d');

// Create a snake using an array of 15px X 15px rectangles
let xMidOfScreen = windowWidth / 2;
let yMidOfScreen = (windowHeight-15) / 2;
let snake = [{x: xMidOfScreen + 30, y: yMidOfScreen}, {x: xMidOfScreen + 15, y: yMidOfScreen}, {x: xMidOfScreen, y: yMidOfScreen}, {x: xMidOfScreen - 15, y: yMidOfScreen}, {x: xMidOfScreen - 30, y: yMidOfScreen}];

// Draw a single snake part (square)
function drawSnakePart(snakePart) {
    gameCanvas.fillStyle = 'darkgreen';
    gameCanvas.strokestyle = 'black';
    gameCanvas.fillRect(snakePart.x, snakePart.y, 15, 15);
    gameCanvas.strokeRect(snakePart.x, snakePart.y, 15, 15);
}

// Draw snake based on an array of coordinates 
function drawSnake() {
    snake.forEach(drawSnakePart);
}

// Updating the snake's position
function moveSnake() {
    // Horizontal velocity of the snake - equals the width of 1 snake part
    let dx = 15;
    // Vertical velocity of the snake - equals the height of 1 snake part
    let dy = 15;

    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);    // Make place for the new head by shifting it to the beginning of array
    snake.pop();    // Remove the last element of the array so it seems like the snake is moving
}


// START PLAYING THE GAME
function playGame() {
    // Fill game canvas with nearly transparent grass green color
    gameCanvas.fillStyle = "rgba(0, 154, 23, 0.15)";
    gameCanvas.fillRect(0, 0, windowRight, windowBottom);

    drawSnake();
    

}

function gameOver() {
    return;
}


playGame();


// MISCELLANEOUS
// Clicking on the hearts will produce the heartbeat sound
let heartsLeft = document.getElementsByClassName('heart');
let heartbeatSound = new Audio('sounds/heartbeat.wav');

for(var i = 0; i < heartsLeft.length; i++) {
    heartsLeft[i].addEventListener('click', function() {
        heartbeatSound.play();
    });
};



// NOT IMPLEMENTED YET
// !!!!!! OPEN AN ALERT WINDOW WHEN CREDITS ARE CLICKED

// !!!!!! OPEN AN ALERT WINDOW WHEN INFO ICON IS CLICKED