// Shortcut
const $ = id => {
  return document.getElementById(id);
}

// We want to set 1 unit = 75px
const u = 75;

// Create a canvas element to create a gaming area (9x7)
const gameCanvasTarget = $("game-canvas");
gameCanvasTarget.width = 9 * u;
gameCanvasTarget.height = 7 * u;

// Create drawing context on the canvas
const context = gameCanvasTarget.getContext("2d");

// Configure the starting coordinates for the game
const gameConfig = {
  polarBear: {
    x: 0,
    y: 3 * u
  },
  icebergs: {
    col1: {
      x: 1 * u,
      yArray: [0, 1 * u, 4 * u, 5 * u],
      isIcebergBehind: [false, true, false, true]
    },
    col2: {
      x: 2 * u,
      yArray: [1 * u, 4 * u, 5 * u],
      isIcebergBehind: [false, false, true]
    },
    col3: {
      x: 3 * u,
      yArray: [1 * u, 2 * u, 3 * u, 6 * u],
      isIcebergBehind: [false, true, true, false]
    },
    col4: {
      x: 4 * u,
      yArray: [3 * u, 4 * u, 5 * u],
      isIcebergBehind: [false, true, false]
    },
    col5: {
      x: 5 * u,
      yArray: [2 * u, 3 * u, 5 * u, 6 * u],
      isIcebergBehind: [false, true, false, true]
    },
    col6: {
      x: 6 * u,
      yArray: [1 * u, 4 * u, 5 * u],
      isIcebergBehind: [false, false, true]
    },
    col7: {
      x: 7 * u,
      yArray: [1 * u, 2 * u, 5 * u],
      isIcebergBehind: [false, true, false]
    }
  },
  arrows: {
    col1: {
      x: 1 * u,
      yArray: [2 * u, 6 * u],
    },
    col2: {
      x: 2 * u,
      yArray: [0, 3 * u],
      isIcebergBehind: [false, false, true]
    },
    col3: {
      x: 3 * u,
      yArray: [0, 4 * u],
      isIcebergBehind: [false, true, true, false]
    },
    col4: {
      x: 4 * u,
      yArray: [2 * u],
      isIcebergBehind: [false, true, false]
    },
    col5: {
      x: 5 * u,
      yArray: [0, 4 * u],
      isIcebergBehind: [false, true, false, true]
    },
    col6: {
      x: 6 * u,
      yArray: [0, 3 * u],
      isIcebergBehind: [false, false, true]
    },
    col7: {
      x: 7 * u,
      yArray: [3 * u, 6 * u],
      isIcebergBehind: [false, true, false]

    }
  },
  speed: 2000
}

// Create an empty array to store whether iceberg = true
const isIceberg = [['s', 's', 's', 's', 's', 's', 's'], ['i', 'i', 'w', 'w', 'i', 'i', 'w']];

// Initialise the polar bear image
const polarBear = new Image();
polarBear.src = "resources/images/svg/025-polar bear.svg";

// Initialise the iceberg image
const iceberg = new Image();
iceberg.src = "resources/images/svg/015-iceberg.svg";

// Initialise the arrow images
const downArrow = new Image();
downArrow.src = "resources/images/down-arrow.svg";

const upArrow = new Image();
upArrow.src = "resources/images/up-arrow.svg";

// Function to draw the polar bear
const drawPolarBear = (xPos, yPos) => {
  context.drawImage(polarBear, xPos, yPos, 1 * u, 1 * u);
}

// Function to draw each iceberg
const drawIceberg = (xPos, yPos) => {
  context.drawImage(iceberg, xPos, yPos, 1 * u, 1 * u);
}

// Function to draw the arrows
const drawUpArrow = (xPos, yPos) => {
  context.drawImage(upArrow, xPos, yPos, 1 * u, 1 * u);
}

const drawDownArrow = (xPos, yPos) => {
  context.drawImage(downArrow, xPos, yPos, 1 * u, 1 * u);
}

// Function to draw the canvas and all the components on it
const drawCanvas = () => {

  // Clear the canvas
  context.clearRect(0, 0, gameCanvasTarget.width, gameCanvasTarget.height);

  // Color the area for the 'water' blue
  context.fillStyle = "hsl(198, 68%, 82%)";
  context.fillRect(1 * u, 0, 7 * u, 7 * u);

  // Color the areas for the 'snow', the 'safe' area, white
  context.fillStyle = "white";
  context.fillRect(0, 0, 1 * u, 7 * u);
  context.fillRect(8 * u, 0, 1 * u, 7 * u);

  // Draw the icebergs
  for (const col in gameConfig.icebergs) {
    const x = gameConfig.icebergs[col]['x'];
    const yArray = gameConfig.icebergs[col]['yArray'];
    yArray.forEach(y => drawIceberg(x, y));
  }

  // Draw the arrows
  let colNum = 1;
  for (const col in gameConfig.arrows) {
    const x = gameConfig.arrows[col]['x'];
    const yArray = gameConfig.arrows[col]['yArray'];
    if (colNum % 2 === 1) {
      yArray.forEach(y => drawDownArrow(x, y));
    } else {
      yArray.forEach(y => drawUpArrow(x, y));
    }
    colNum++;
  }

  // Draw the polar bear
  drawPolarBear(gameConfig.polarBear.x, gameConfig.polarBear.y);
}

// Every 10ms, clear and redraw the canvas with all the components on it at their 
let intervalDrawCanvas = window.setInterval(drawCanvas, 10);

let isUserMove = false;

// Function to stick the polar bear to the iceberg
const stickBear = (colNum, yArray, i) => {
  if (colNum % 2 === 1) {

    if (yArray[i] === 6 * u) {
      gameConfig.polarBear.y = 0;
    } else {
      gameConfig.polarBear.y += 1 * u;
    }

    // If it is an even column, move the icebergs up the screen
  } else {
    if (yArray[i] === 0) {
      gameConfig.polarBear.y = 6 * u;
    } else {
      gameConfig.polarBear.y -= 1 * u;
    }
  }
}

let isIncrement = true;

// Function to move the icebergs by incrementing the y values
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
        // This if statement prevents the bear from being skipped ahead twice if its on a trailing iceberg
        if (yArray[i] !== yArray[i - 1]) {
          stickBear(colNum, yArray, i);
          isUserMove = false;
          console.log(x / u, yArray[i] / u);
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

    colNum++;
  }
}

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

    colNum++;
  }
}


  let isPlaying = false;
  let intervalMoveIcebergs;

  // Function to start the icebergs moving at specified interval
  const startGame = () => {
    intervalMoveIcebergs = window.setInterval(function() {
      moveIcebergs();
      moveArrows();
    }, gameConfig.speed);
    isPlaying = true;
  }

  // Function to stop the icebergs moving
  const stopGame = () => {
    clearInterval(intervalMoveIcebergs);
    isPlaying = false;
  }


  // Use arrow keys to move the polar bear 
  // Hit 'space' to start the game
  window.addEventListener('keyup', function keyPress(key) {
    switch (key.code) {
      case 'ArrowUp':
        gameConfig.polarBear.y -= 1 * u;
        isUserMove = true;
        break;
      case 'ArrowLeft':
        gameConfig.polarBear.x -= 1 * u;
        isUserMove = true;
        break;
      case 'ArrowRight':
        gameConfig.polarBear.x += 1 * u;
        isUserMove = true;
        break;
      case 'ArrowDown':
        gameConfig.polarBear.y += 1 * u;
        isUserMove = true;
        break;
      case 'Space':
        if (!isPlaying) {
          startGame();
        } else {
          stopGame();
        }
        break;
      default:
        break;
    }
  });

  // Use the buttons to move the polar bear
  const upButtonTarget = $("up-button");
  upButtonTarget.addEventListener("click", function () {
    gameConfig.polarBear.y -= 1 * u;
    isUserMove = true;
  });

  const leftButtonTarget = $("left-button");
  leftButtonTarget.addEventListener("click", function () {
    gameConfig.polarBear.x -= 1 * u;
    isUserMove = true;
  });

  const rightButtonTarget = $("right-button");
  rightButtonTarget.addEventListener("click", function () {
    gameConfig.polarBear.x += 1 * u;
    isUserMove = true;
  });

  const downButtonTarget = $("down-button");
  downButtonTarget.addEventListener("click", function () {
    gameConfig.polarBear.y += 1 * u;
    isUserMove = true;
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