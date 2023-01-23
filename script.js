// GAME MECHANICS
// Get coordinates of the game window
var offsets = document.getElementById('game-window').getBoundingClientRect();
var windowRight = offsets.right;  // x coordinate of RIGHT side of the game window
var windowBottom = offsets.bottom;    // y coordinate of BOTTOM of the game window
var windowHeight = offsets.height;
var windowWidth = offsets.width;

// Create canvas of the game window
var canvas = document.getElementById('game-window');
var gameCanvas = canvas.getContext('2d');

function clearCanvas() {
    // Fill game canvas with white color to avoid stacking green bg color and making it opaque
    gameCanvas.fillStyle = "white";
    gameCanvas.fillRect(0, 0, windowRight, windowBottom);

    // Fill game canvas with nearly transparent grass green color
    gameCanvas.fillStyle = "rgba(0, 154, 23, 0.15)";
    gameCanvas.fillRect(0, 0, windowRight, windowBottom);
}

// Create a snake using an array of 15px X 15px rectangles
let xMidOfScreen = windowWidth / 2;
let yMidOfScreen = (windowHeight - 15) / 2;
let snake = [{x: xMidOfScreen + 30, y: yMidOfScreen}, 
    {x: xMidOfScreen + 15, y: yMidOfScreen}, 
    {x: xMidOfScreen, y: yMidOfScreen}, 
    {x: xMidOfScreen - 15, y: yMidOfScreen}, 
    {x: xMidOfScreen - 30, y: yMidOfScreen}];


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

// Horizontal velocity of the snake - equals the width of 1 snake part
let dx = 15;
// Vertical velocity of the snake
let dy = 0;

function changeDirection(event) {
    // Key codes for the arrows
    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;

    // Key codes for WASD
    const KEY_W = 87;
    const KEY_A = 65;
    const KEY_S= 83;
    const KEY_D = 68;

    // Determines the type of key that was pressed
    const keyPressed = event.keyCode;

    const goingUp = dy === -15;
    const goingDown = dy === 15;
    const goingLeft = dx === -15;
    const goingRight = dx === 15;

    // Change direction of the snake
    if((keyPressed === LEFT_KEY || keyPressed === KEY_A) && !goingRight) {
        dx = -15;
        dy = 0;
    }

    if((keyPressed === UP_KEY || keyPressed === KEY_W) && !goingDown) {
        dx = 0;
        dy = -15;
    }

    if((keyPressed === RIGHT_KEY || keyPressed === KEY_D) && !goingLeft) {
        dx = 15;
        dy = 0;
    }

    if((keyPressed === DOWN_KEY || keyPressed === KEY_S) && !goingUp) {
        dx = 0;
        dy = 15;
    }
}

// Generate a random set of coordinates for the food to appear.
function randomCoord(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 15) * 15;
}

let foodX;
let foodY;
let score = 0;

function createFood() {
    foodX = randomCoord(0, windowWidth - 15);
    foodY = randomCoord(0, windowHeight - 15);

    snake.forEach(function foodTouchesSnake(snakePart) {
        const foodTouchesSnake = (snakePart.x === foodX) && (snakePart.y === foodY);
        // If generated coordinates are the same as any part of a snake, generate them again
        if(foodTouchesSnake) {
            createFood();
        }
    });
}

const appleImage = new Image();
appleImage.src = 'images/apple.png';
appleImage.width = 15;
appleImage.height = 15;

function drawApple() {
    gameCanvas.drawImage(appleImage, foodX, foodY, 15, 15);
}

let hasFullHeart;
let hasEmptyHeart;
let emptyHeartsHTML = '<img class="heart" src="images/heart-empty.png" />';
const heartsDiv = document.getElementById('hearts-div');
let heartBreakingSound = new Audio('sounds/breaking-glass.wav');
let hurtSound = new Audio('sounds/hurt.wav');

// Helper function that helps decide whether player has a life left
function manageHearts() {
    // If the player has an empty heart (meaning s/he used up a heart), end the game
    if(hasFullHeart == false && hasEmptyHeart == true) {
        hasEmptyHeart = false;
        return;
    }

    hasFullHeart = false;
    hasEmptyHeart = true;
    // Change full heart image to empty heart image 
    heartsDiv.innerHTML = emptyHeartsHTML;
    wasRevived = true;
}

// Determines whether snake collided with itself or the walls
function didCollide() {
    const snakeHead = snake[0];

    // Check if the snake touched any of its parts
    for(let i = 4; i < snake.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            hurtSound.play();
            manageHearts();
        }
    }
    
    // Check if the snake collided with walls
    if(snakeHead.x === windowWidth - 15 || snakeHead.x === -15 || snakeHead.y === windowHeight || snakeHead.y === -15) {
        heartBreakingSound.play();
        manageHearts();
    }
}

let chewingSound = new Audio('sounds/chewing.wav');

// Updating the snake's position
function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // Check if snake ate apple
    const didEatFood = head.x === foodX && head.y === foodY;

    // Make place for the new head by shifting it to the beginning of array
    snake.unshift(head);

    // If the snake ate apple, create a new one
    if(didEatFood) {
        chewingSound.play();
        score += 10;
        document.getElementById('score').innerHTML = score;
        createFood();
    }
    else {
        // Remove the last element of the array so it seems like the snake is moving
        snake.pop();
    }
}

let wasRevived;

// Revives the snake once and shortens its length
function revive() {
    clearCanvas();
    
    // Generate coordinates for the new head of the snake (not too close to the walls)
    newHeadX = randomCoord(150, windowWidth - 150);
    newHeadY = randomCoord(150, windowHeight - 150);

    oldSnakeLength = snake.length;  // Save the original length of the snake
    // Delete all previous snake parts (except head) to generate new ones
    snake.length = 1;   

    // Set the head's coordinates to new randomly generated coordinates
    snake[0] = {x: newHeadX, y: newHeadY};
    
    // The length of the previous snake part
    previousX = newHeadX;

    // Punish the player by taking off some of the snake's length
    if(oldSnakeLength >= 16) {
        penalty = Math.floor(oldSnakeLength / 2);
    }

    else if(oldSnakeLength < 16 && oldSnakeLength > 5) {
        penalty = 5;
    }

    else if(oldSnakeLength <= 5) {
        penalty = 2;
    }

    // Generate a new snake with new coordinates
    for(let i = 1; i <= penalty; i++) {
        currentX = previousX - 15;

        snake.push({x:currentX, y: newHeadY});
        previousX = currentX;
    }
}

// START PLAYING THE GAME
playGame();
hasFullHeart = true;
hasEmptyHeart = true;
wasRevived = false
createFood();

function playGame() {
    setTimeout(function update() {
        clearCanvas();
        drawApple();
        didCollide();
        moveSnake();
        drawSnake();

        // Revive and continue the game
        if(wasRevived == true) {
            revive();
            wasRevived = false;
        }

        // If the player was revived once and died again, it's game over
        if(hasEmptyHeart == false) {
            gameOver();
            return;
        }

        // Play game again
        playGame();
    }, 100);
    
}

let gameOverSound = new Audio('sounds/game-over.wav');

function gameOver() {
    gameOverSound.play();
}


// Listen for keys pressed and change position of the snake accordingly
document.addEventListener('keydown', changeDirection);


// MISCELLANEOUS
// Clicking on the hearts will produce the heartbeat sound
let hearts = document.getElementsByClassName('heart');
let heartbeatSound = new Audio('sounds/heartbeat.wav');

for(var i = 0; i < hearts.length; i++) {
    hearts[i].addEventListener('click', function() {
        heartbeatSound.play();
    });
};



// NOT IMPLEMENTED YET
// !!!!!! OPEN AN ALERT WINDOW WHEN CREDITS ARE CLICKED

// !!!!!! OPEN AN ALERT WINDOW WHEN INFO ICON IS CLICKED