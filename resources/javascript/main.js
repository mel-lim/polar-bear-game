// Function to 'stick' the polar bear to the iceberg once it is moved onto the iceberg

let isUserMove = false;

const stickBear = (colNum, yArray, i) => {

  // If it is an odd column, move the iceberg and polar bear down the screen
  if (colNum % 2 === 1) {
    gameConfig.polarBear.y += 1 * u;
    
    // If the polar bear gets moved off the canvas, the game is lost
    if (gameConfig.polarBear.y > 6 * u) {
      splash.play();
      stopGame();
    }

    // If it is an even column, move the iceberg and polar bear up the screen
  } else {
    gameConfig.polarBear.y -= 1 * u;
    
    // If the polar bear gets moved off the canvas, the game is lost
    if (gameConfig.polarBear.y < 0) {
      splash.play();
      stopGame();
    }
  }
}

const checkOnScreen = () => {
  if (gameConfig.polarBear.y < 0) {
    stopGame();
    splash.play();
    setTimeout(function() {
      gameOverPrompt(false);
    }, 500);
  }
}

// Function to move the icebergs by incrementing the y values

let isIncrement = true;

const moveIcebergs = () => {
  let colNum = 1;

  // Increment every iceberg, column by column
  for (const col in gameConfig.icebergs) {

    const x = gameConfig.icebergs[col]['x'];
    const yArray = gameConfig.icebergs[col]['yArray'];
    const isIcebergBehind = gameConfig.icebergs[col]['isIcebergBehind'];

    for (let i = 0; i < yArray.length; i++) {

      // Check for collision
      if (x === gameConfig.polarBear.x && yArray[i] === gameConfig.polarBear.y) {

        // If the bear is on the iceberg, call the stickBear function to have the bear move along with the iceberg that it is on

        // The following if block prevents the bear from being skipped ahead twice if its on a trailing iceberg
        if (yArray[i] !== yArray[i - 1]) {
          stickBear(colNum, yArray, i);
          isUserMove = false;

          // If the user navigates the polar bear onto a leading iceberg, this will execute
        } else if (isUserMove && isIcebergBehind[i]) {
          stickBear(colNum, yArray, i);
        }
      }

      // If it is an odd column, move the icebergs down the screen
      if (colNum % 2 === 1) {

        if (yArray[i] === 6 * u) {
          yArray[i] = 0;
        } else {
          yArray[i] += 1 * u;
        }

        // If it is an even column, move the icebergs up the screen
      } else {
        if (yArray[i] === 0) {
          yArray[i] = 6 * u;
        } else {
          yArray[i] -= 1 * u;
        }
      }
    }

    // Increment the column number
    colNum++;
  }
}

// Function to move the arrows

const moveArrows = () => {
  let colNum = 1;

  // Increment every arrow, column by column
  for (const col in gameConfig.icebergs) {

    const x = gameConfig.arrows[col]['x'];
    const yArray = gameConfig.arrows[col]['yArray'];

    for (let i = 0; i < yArray.length; i++) {
      // If it is an odd column, move the arrows down the screen
      if (colNum % 2 === 1) {

        if (yArray[i] === 6 * u) {
          yArray[i] = 0;
        } else {
          yArray[i] += 1 * u;
        }

        // If it is an even column, move the arrows up the screen
      } else {
        if (yArray[i] === 0) {
          yArray[i] = 6 * u;
        } else {
          yArray[i] -= 1 * u;
        }
      }
    }

    // Increment the column number
    colNum++;
  }
}

// Function to stop game
const stopGame = () => {
  clearInterval(intervalDrawCanvas);
  clearInterval(intervalMoveIcebergs);
  backgroundMusic.stop();
  isPlaying = false;
}

const gameOverPrompt = (isWin) => {
  let gameOverPrompt;
  if (!isWin) {
    gameOverPrompt = prompt("Oops, you fell into the water! Would you like to play again? (y/n)");
  } else {
    gameOverPrompt = prompt("Yum, that fish was delicious! Would you like to play again? (y/n)");
  }  
    
  if (gameOverPrompt.toLowerCase() == 'y' || gameOverPrompt.toLowerCase() == 'yes') {
    location.reload();
  } else {
    return;
  }
}

// Function to check if the polar bear has fallen into the water
const checkWin = () => {
  if (coordinateIds[gameConfig.polarBear.x / u][gameConfig.polarBear.y / u] == 'water') {
    stopGame();
    splash.play();
    setTimeout(function() {
      gameOverPrompt(false);
    }, 500);
  } else if (coordinateIds[gameConfig.polarBear.x / u][gameConfig.polarBear.y / u] == 'fish') {
    stopGame();
    winSound.play();
    chewing.play();
    setTimeout(function() {
      gameOverPrompt(true);
    }, 500);
  }
}

const moveBear = (direction) => {
  switch (direction) {
    case 'up':
      if (gameConfig.polarBear.y !== 0) {
        gameConfig.polarBear.y -= 1 * u;
      }
      break;
      
    case 'left':
      if (gameConfig.polarBear.x !== 0) {
        gameConfig.polarBear.x -= 1 * u;
      }
      break;
    case 'right':
      if (gameConfig.polarBear.x !== 8 * u) {
        gameConfig.polarBear.x += 1 * u;
      }
      break;
    case 'down':
      if (gameConfig.polarBear.y !== 6 * u) {
        gameConfig.polarBear.y += 1 * u;
      }
      break;
    default:
      break;
    }
  if (gameConfig.polarBear.x == 0 || gameConfig.polarBear.x == 8 * u) {
    snowFootstep.play();
  } else {
    growl.play();
  }
  isUserMove = true;
  checkWin();
}

const arrowKeyPress = key => {
  switch (key.code) {
    case 'ArrowUp':
      moveBear('up');
      break;
    case 'ArrowLeft':
      moveBear('left');
      break;
    case 'ArrowRight':
      moveBear('right');
      break;
    case 'ArrowDown':
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

const startGame = () => {

  // Every 10ms, clear and redraw the canvas with all the components on it at their updated locations
  intervalDrawCanvas = window.setInterval(drawCanvas, 10);

  // Start the icebergs moving
  intervalMoveIcebergs = window.setInterval(function () {
    moveIcebergs();
    moveArrows();
  }, gameConfig.speed);

  // Play the background music
  backgroundMusic.play();

  // Allow user to use the arrow keys to move the polar bear 
  window.addEventListener('keyup', function (key) {
    arrowKeyPress(key)
  });

  // Allow user to use the buttons to move the polar bear
  const upButtonTarget = $("up-button");
  upButtonTarget.addEventListener("click", function () {
    moveBear('up');
  });

  const leftButtonTarget = $("left-button");
  leftButtonTarget.addEventListener("click", function () {
    moveBear('left');
  });

  const rightButtonTarget = $("right-button");
  rightButtonTarget.addEventListener("click", function () {
    moveBear('right');
  });

  const downButtonTarget = $("down-button");
  downButtonTarget.addEventListener("click", function () {
    moveBear('down');
  });

  isPlaying = true;

}

// Hit the space bar to start/stop the game
window.addEventListener('keyup', function hitSpaceBar(key) {
  if (key.code === 'Space') {
    if (!isPlaying) {
      startGame();
    } else {
      stopGame();
    }
  }
});

// Click the button to start/stop the game
const startStopButtonTarget = $("start-stop-button");
startStopButtonTarget.addEventListener("click", function () {
  if (!isPlaying) {
    startGame();
  } else {
    stopGame();
  }
});