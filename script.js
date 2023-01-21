// GAME MECHANICS





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