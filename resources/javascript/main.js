// Function to 'stick' the polar bear to the iceberg once it is moved onto the iceberg

const stickBear = (x, direction) => {

  // If it is an odd column, move the iceberg and polar bear down the screen
  if (direction == "down") {
    polarBearCoords.y += 1 * u;
    
    // If it is an even column, move the iceberg and polar bear up the screen
  } else if (direction == "up") {
    polarBearCoords.y -= 1 * u;  
  }
  // If the polar bear gets moved off the canvas, the game is lost
  if (polarBearCoords.y < 0 || polarBearCoords.y > 6 * u) {
    splash.play();
    stopGame();
    gameOverPrompt(false);
    gameOver();
  }
}

// Function to move the icebergs by incrementing the y values

let isUserMove = false;
let userMovedTo;

const moveIcebergs = () => {

  // Increment every iceberg, column by column
  for (let i = 0; i < 7; i++) {

    const x = icebergLines[i]['x'];
    const yArray = icebergLines[i]['yArray'];
    const icebergPosArray = icebergLines[i]['icebergPosArray'];
    const direction = icebergLines[i]['direction'];

    for (let j = 0; j < yArray.length; j++) {

      // Check for collision
      if (x === polarBearCoords.x && yArray[j] === polarBearCoords.y) {
        // If the bear is on the iceberg, call the stickBear function to have the bear move along with the iceberg that it is on
        if (icebergPosArray[j] == "front") {
          if (isUserMove) {
            stickBear(x, direction);
            userMovedTo = "front";
            isUserMove = false; 
          } else if (!isUserMove && userMovedTo == "front") {
            stickBear(x, direction);
          }
        }
        else if (icebergPosArray[j] == "middle") {
          if (isUserMove) {
            stickBear(x, direction);
            userMovedTo = "middle";
            isUserMove = false; 
          } else if (!isUserMove && userMovedTo == "middle") {
            stickBear(x, direction);
          }          
        } else if (icebergPosArray[j] == "back") {
          stickBear(x, direction);
          userMovedTo = "back";
          isUserMove = false;
        }
      }

      // If it is an odd column, move the icebergs down the screen
      if (direction == "down") {

        if (yArray[j] == 6 * u) {
          yArray[j] = 0;
        } else {
          yArray[j] += 1 * u;
        }

        // If it is an even column, move the icebergs up the screen
      } else {
        if (yArray[j] == 0) {
          yArray[j] = 6 * u;
        } else {
          yArray[j] -= 1 * u;
        }
      }
    }
  }
}

// Function to move the arrows

const moveArrows = () => {

  // Increment every arrow, column by column
  for (let i = 0; i < arrowLines.length; i++) {

    const x = arrowLines[i]['x'];
    const yArray = arrowLines[i]['yArray'];
    const direction = arrowLines[i]['direction'];

    for (let j = 0; j < yArray.length; j++) {
      // If it is an odd column, move the arrows down the screen
      if (direction == "down") {
        if (yArray[j] === 6 * u) {
          yArray[j] = 0;
        } else {
          yArray[j] += 1 * u;
        }

        // If it is an even column, move the arrows up the screen
      } else {
        if (yArray[j] === 0) {
          yArray[j] = 6 * u;
        } else {
          yArray[j] -= 1 * u;
        }
      }
    }
  }
}

// Function to process the arrow keys pressed by the user
const arrowKeyPress = key => {
  switch (key.code) {
    case 'ArrowUp':
      key.preventDefault();
      moveBear('up');
      break;
    case 'ArrowLeft':
      moveBear('left');
      break;
    case 'ArrowRight':
      moveBear('right');
      break;
    case 'ArrowDown':
      key.preventDefault();
      moveBear('down');
      break;
    default:
      break;
  }
}

// Function to start the game
let isPlaying = false;
let intervalMoveIcebergs;
let intervalDrawCanvas
const upButtonTarget = $("up-button");
const leftButtonTarget = $("left-button");
const rightButtonTarget = $("right-button");
const downButtonTarget = $("down-button");
let arrowPressHander;
let moveUpHandler;
let moveLeftHandler;
let moveRightHandler;
let moveDownHandler;

const startGame = () => {

  // Every 10ms, clear and redraw the canvas with all the components on it at their updated locations
  intervalDrawCanvas = window.setInterval(drawCanvas, 10);

  // Start the icebergs moving
  intervalMoveIcebergs = window.setInterval(function () {
    moveIcebergs();
    moveArrows();
  }, speed);

  // Play the background music
  backgroundMusic.play();

  // Allow user to use the arrow keys to move the polar bear 
  window.addEventListener('keydown', arrowPressHander = function (key) {
    arrowKeyPress(key)
  });

  // Allow user to use the buttons to move the polar bear
  
  upButtonTarget.addEventListener("click", moveUpHandler = function () {
    moveBear('up');
  });

  leftButtonTarget.addEventListener("click", moveLeftHander = function () {
    moveBear('left');
  });

  rightButtonTarget.addEventListener("click", moveRightHandler = function () {
    moveBear('right');
  });

  downButtonTarget.addEventListener("click", moveDownHandler = function () {
    moveBear('down');
  });

  isPlaying = true;

}

// Function to stop game
const stopGame = () => {
  clearInterval(intervalDrawCanvas);
  clearInterval(intervalMoveIcebergs);
  backgroundMusic.stop();

  window.removeEventListener('keydown', arrowPressHander);

  upButtonTarget.removeEventListener("click", moveUpHandler);

  leftButtonTarget.removeEventListener("click", moveLeftHander);

  rightButtonTarget.removeEventListener("click", moveRightHandler);

  downButtonTarget.removeEventListener("click", moveDownHandler);

  isPlaying = false;
}

const hitSpaceBar = key => {
  if (key.code === 'Space') {
    // This prevents the window from moving up when the space bar is pressed
    key.preventDefault();
    if (!isPlaying) {
      startGame();
    } else {
      stopGame();
    }
  }
}

let spaceBarHandler;

// Hit the space bar to start/stop the game
window.addEventListener('keydown', spaceBarHandler = function(key) {
  hitSpaceBar(key);
});

// Click the button to start/stop the game
const startPauseButtonTarget = $("start-pause-button");
startPauseButtonTarget.addEventListener("click", function () {
  if (!isPlaying) {
    startGame();
  } else {
    stopGame();
  }
});

// Function to prompt user with a dialog box to play again when game is won or lost

const playAgainBoxTarget = $('play-again-box');
const playAgainBoxHeadingTarget = $('play-again-box-heading');
const playAgainButtonTarget = $('play-again-button');
const notPlayAgainButtonTarget = $('not-play-again-button');

const gameOverPrompt = (isWin) => {

  if (isWin) {
    playAgainBoxHeadingTarget.innerHTML = "Yum, that fish was delicious!"
  } else {
    playAgainBoxHeadingTarget.innerHTML = "Oops, you fell in the water."
  }

  playAgainBoxTarget.style.display = "block";

  // If the user clicks "yes" to play again, refresh the screen
  playAgainButtonTarget.addEventListener('click', function () {
  location.reload();
  })

  // If the user clicks "no" to not play again, refresh the screen
  notPlayAgainButtonTarget.addEventListener('click', function () {
  location.reload();
  })

  // If the user hits the "enter" key, refresh the screen
  window.addEventListener('keydown', function (key) {
    if (key.code === 'Enter') {
      location.reload();
    }
  });
}

const gameOver = () => {
  console.log("gameover function called");
  window.removeEventListener('keydown', spaceBarHandler);
}

// Function to check if the polar bear has fallen into the water
const checkWin = () => {
  if (coordinateIds[polarBearCoords.x / u][polarBearCoords.y / u] == 'water') {
    splash.play();
    drawCanvas();
    stopGame();
    gameOverPrompt(false);
    gameOver();
  } else if (coordinateIds[polarBearCoords.x / u][polarBearCoords.y / u] == 'fish') {
    winSound.play();
    chewing.play();
    drawCanvas();
    stopGame();
    gameOverPrompt(true);
    gameOver();
  }
}

// Function to move the bear
const moveBear = (direction) => {
  switch (direction) {
    case 'up':
      if (polarBearCoords.y !== 0) {
        polarBearCoords.y -= 1 * u;
      }
      break;
      
    case 'left':
      if (polarBearCoords.x !== 0) {
        polarBearCoords.x -= 1 * u;
      }
      break;
    case 'right':
      if (polarBearCoords.x !== 8 * u) {
        polarBearCoords.x += 1 * u;
      }
      break;
    case 'down':
      if (polarBearCoords.y !== 6 * u) {
        polarBearCoords.y += 1 * u;
      }
      break;
    default:
      break;
    }
  if (polarBearCoords.x == 0 || polarBearCoords.x == 8 * u) {
    snowFootstep.play();
  } else {
    growl.play();
  }
  isUserMove = true;
  checkWin();
}





