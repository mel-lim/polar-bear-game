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

// Create a 2d array 9x7 (size of canvas) of empty strings to store the 'id' of the image for that coordinate
const coordinateIds = [];
for (let i = 0; i < 9; i++) {
  coordinateIds[i] = [];
  for (let j = 0; j < 7; j++) {
    coordinateIds[i][j] = '';
  }
}

// Initialise the polar bear image
const polarBear = new Image();
polarBear.src = "resources/images/arctic/svg/025-polar bear.svg";

// Initialise the iceberg image
const iceberg = new Image();
iceberg.src = "resources/images/arctic/svg/015-iceberg.svg";

// Initialise the arrow images
const downArrow = new Image();
downArrow.src = "resources/images/arrows/down-arrow.svg";

const upArrow = new Image();
upArrow.src = "resources/images/arrows/up-arrow.svg";

// Initialise the fish image
const fish = new Image();
fish.src = "resources/images/arctic/svg/009-fish.svg";

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



// Object constructor to handle sound objects
function sound(src, isLoop) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.loop = isLoop;
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

// Initialise the sounds and music
const growl = new sound("resources/sounds/growl-2.wav", false);
const splash = new sound("resources/sounds/lava.flac", false);
const backgroundMusic = new sound("resources/sounds/jewels-and-puzzles.mp3", true);

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

  // Label each coordinate as either 'snow' or 'water', to start
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 7; j++) {
      if (i === 0 || i === 8) {
        coordinateIds[i][j] = 'snow';
      } else {
        coordinateIds[i][j] = 'water';
      }
    }
  }

  // Draw the icebergs and label the coordinate as 'iceberg'
  for (const col in gameConfig.icebergs) {
    const x = gameConfig.icebergs[col]['x'];
    const yArray = gameConfig.icebergs[col]['yArray'];
    yArray.forEach(y => {
      drawIceberg(x, y);
      coordinateIds[x/u][y/u] = 'iceberg';
    });
  }

  // Draw the arrows: in the 'down' direction for odd columns and 'up' direction for even columns
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
let onIceberg = false;

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
        onIceberg = true;
        // This if statement prevents the bear from being skipped ahead twice if its on a trailing iceberg
        if (yArray[i] !== yArray[i - 1]) {
          stickBear(colNum, yArray, i);
          isUserMove = false;
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
  intervalMoveIcebergs = window.setInterval(function () {
    moveIcebergs();
    moveArrows();
  }, gameConfig.speed);
  backgroundMusic.play();
  isPlaying = true;
}

// Function to stop the icebergs moving
const stopGame = () => {
  clearInterval(intervalMoveIcebergs);
  backgroundMusic.stop();
  isPlaying = false;
}

const gameOverPrompt = () => {
  let gameOverPrompt = prompt("Oops, you fell into the water! Would you like to play again? (y/n)");
}

// Function to check if the polar bear has fallen into the water
const checkWater = () => {
  if (coordinateIds[gameConfig.polarBear.x/u][gameConfig.polarBear.y/u] === 'water') {
    splash.play();
    stopGame();
    setTimeout(gameOverPrompt, 500);
  }    
}


// Use arrow keys to move the polar bear 
// Hit 'space' to start the game
window.addEventListener('keyup', function keyPress(key) {
  switch (key.code) {
    case 'ArrowUp':
      gameConfig.polarBear.y -= 1 * u;
      growl.play();
      isUserMove = true;
      checkWater();
      break;
    case 'ArrowLeft':
      gameConfig.polarBear.x -= 1 * u;
      growl.play();
      isUserMove = true;
      checkWater();
      break;
    case 'ArrowRight':
      gameConfig.polarBear.x += 1 * u;
      growl.play();
      isUserMove = true;
      checkWater();
      break;
    case 'ArrowDown':
      gameConfig.polarBear.y += 1 * u;
      growl.play();
      isUserMove = true;
      checkWater();
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