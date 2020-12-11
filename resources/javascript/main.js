// Function to 'stick' the polar bear to the iceberg once it is moved onto the iceberg

let isUserMove = false;

const stickBear = (colNum, yArray, i) => {

  // If it is an odd column, move the iceberg and polar bear down the screen
  if (colNum % 2 === 1) {

    if (yArray[i] === 6 * u) {
      gameConfig.polarBear.y = 0;
    } else {
      gameConfig.polarBear.y += 1 * u;
    }

    // If it is an even column, move the iceberg and polar bear up the screen
  } else {

    if (yArray[i] === 0) {
      gameConfig.polarBear.y = 6 * u;
    } else {
      gameConfig.polarBear.y -= 1 * u;
    }
  }
}



// Function to move the icebergs by incrementing the y values

let isIncrement = true;
let onIceberg = false;

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

        onIceberg = true;

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
  clearInterval(intervalMoveIcebergs);
  backgroundMusic.stop();
  isPlaying = false;
}

const gameOverPrompt = () => {
  let gameOverPrompt = prompt("Oops, you fell into the water! Would you like to play again? (y/n)");
  if (gameOverPrompt === 'y' || gameOverPrompt === 'Y' || gameOverPrompt === 'yes' || gameOverPrompt === 'Yes') {
    startGame();
  } else {
    return;
  }
}

// Function to check if the polar bear has fallen into the water
const checkWater = () => {
  if (coordinateIds[gameConfig.polarBear.x / u][gameConfig.polarBear.y / u] === 'water') {
    splash.play();
    stopGame();
    setTimeout(gameOverPrompt, 500);
  }
}

const moveBear = (direction) => {
  switch (direction) {
    case 'up':
      gameConfig.polarBear.y -= 1 * u;
      break;
    case 'left':
      gameConfig.polarBear.x -= 1 * u;
      break;
    case 'right':
      gameConfig.polarBear.x += 1 * u;
      break;
    case 'down':
      gameConfig.polarBear.y += 1 * u;
      break;
    default:
      break;
    }
  growl.play();
  isUserMove = true;
  checkWater();
}

// Function to start the game
let isPlaying = false;
let intervalMoveIcebergs;

const startGame = () => {

  // Start the icebergs moving
  intervalMoveIcebergs = window.setInterval(function () {
    moveIcebergs();
    moveArrows();
  }, gameConfig.speed);

  // Play the background music
  backgroundMusic.play();

  // Allow user to use the arrow keys to move the polar bear 
  window.addEventListener('keyup', function keyPress(key) {
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