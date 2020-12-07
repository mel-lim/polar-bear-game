// Shortcut
const $ = id => {
  return document.getElementById(id);
}

// We want to set 1 unit = 75px
const u = 75;

// Create a canvas element to create a gaming area (9x7)
const gameCanvasTarget = $("game-canvas");
gameCanvasTarget.width = 9*u;
gameCanvasTarget.height = 7*u;

// Create drawing context on the canvas
const context = gameCanvasTarget.getContext("2d");

// Color the area for the 'water' blue
context.fillStyle = "hsl(198, 68%, 82%)";
context.fillRect(1*u, 0, 7*u, 7*u);

// Color the areas for the 'snow', the 'safe' area, white
context.fillStyle = "white";
context.fillRect(0, 0, 1*u, 7*u);
context.fillRect(8*u, 0, 1*u, 7*u);

// Configure the game
const gameConfig = {
  polarBear: {
    startX: 0,
    startY: 3*u
  },
  icebergs: {
    startingCoords: {
      col1: {
        startX: 1*u,
        startYs: [0, 1*u, 4*u, 5*u],
        trailings: [false, true, false, true]
      },
      col2: {
        startX: 2*u,
        startYs: [1*u, 4*u, 5*u]
      },
      col3: {
        startX: 3*u, 
        startYs: [1*u, 2*u, 3*u, 6*u]
      },
      col4: {
        startX: 4*u, 
        startYs: [3*u, 4*u, 5*u]
      },
      col5: {
        startX: 5*u,
        startYs: [2*u, 3*u, 5*u, 6*u]
      },
      col6: {
        startX: 6*u,
        startYs: [1*u, 4*u, 5*u]
      },
      col7: {
        startX: 7*u, 
        startYs: [1*u, 2*u, 5*u]
      }
    }
  }
}

// Function to draw the polar bear
const drawPolarBear = (xPos, yPos) => {
  context.drawImage(polarBear, xPos, yPos, 1*u, 1*u);
}

// Function to draw each iceberg
const drawIceberg = (xPos, yPos) => {
  context.drawImage(iceberg, xPos, yPos, 1*u, 1*u);
}

// Draw the polar bear in its starting position
const polarBear = new Image();
polarBear.src = "resources/images/svg/025-polar bear.svg";
polarBear.addEventListener('load', function() {
  drawPolarBear(gameConfig.polarBear.startX, gameConfig.polarBear.startY);
});

// Draw the icebergs in their starting positions
const iceberg = new Image();
iceberg.src = "resources/images/svg/015-iceberg.svg";
iceberg.addEventListener('load', function() {
  const startingCoords = gameConfig.icebergs.startingCoords;
  for (const col in startingCoords) {
    const startX = startingCoords[col]['startX'];
    const startYs = startingCoords[col]['startYs'];
    startYs.forEach(startY => drawIceberg(startX, startY));
  };
});

// Function to 'move' the bear
let oldXBear = gameConfig.polarBear.startX;
let oldYBear = gameConfig.polarBear.startY;
let newXBear;
let newYBear;
const newPosBear = (changeX, changeY) => {
  console.log(oldXBear, oldYBear);
  if (oldXBear === 0 || oldXBear === 8*u) {
    context.fillStyle = "white";
    context.fillRect(oldXBear, oldYBear, 1*u, 1*u);
  } else {
    context.fillStyle = "hsl(198, 68%, 82%)";
    context.fillRect(oldXBear, oldYBear, 1*u, 1*u);
    drawIceberg(oldXBear, oldYBear);
  }
  newXBear = oldXBear + changeX;
  newYBear = oldYBear + changeY;
  drawPolarBear(newXBear, newYBear);
  oldXBear += changeX;
  oldYBear += changeY;
}

// Function to 'move' the icebergs
const newPosIceberg = (startX, newY, oldY, trailing) => {
  console.log(trailing);
  if (trailing === false) {
    context.fillStyle = "hsl(198, 68%, 82%)";
    context.fillRect(startX, oldY, 1*u, 1*u);
  }
  drawIceberg(startX, newY);
}


// Function to start the game
let isPlaying = false;
let intervals = [];
const startGame = () => {
  const startingCoords = gameConfig.icebergs.startingCoords;
  //for (const col in startingCoords) {
    let oldY = [];
    let newY = [];
    const startX = startingCoords['col1']['startX'];
    const startYs = startingCoords['col1']['startYs'];
    const trailings = startingCoords['col1']['trailings'];
    for (let i = 0; i < startYs.length; i++) {
      oldY[i] = startYs[i];
      intervals[i] = window.setInterval(function() {
        if (oldY[i] === 6*u) {
          newY[i] = 0;
        } else {
          newY[i] = oldY[i] + 1*u;
        }
        newPosIceberg(startX, newY[i], oldY[i], trailings[i]);
        if (oldY[i] === 6*u) {
          oldY[i] = 0;
        } else {
          oldY[i] += 1*u;
        }
        newY[i] += 1*u;
       }, 1500);
    }
  isPlaying = true;
}

// Function to stop the game
const stopGame = () => {
  clearInterval(interval[i]);
  console.log("stopGame function executed")
  isPlaying = false;
}

// Click the button to start/stop the game
const startStopButtonTarget = $("start-stop-button");
startStopButtonTarget.addEventListener("click", function () {
  if (!isPlaying) {
    startGame();
  } else {
    stopGame();
  }
})

// Use the buttons to control the polar bear
const upButtonTarget = $("up-button");
upButtonTarget.addEventListener("click", function() {
  newPosBear(0, -1*u);
});

const leftButtonTarget = $("left-button");
leftButtonTarget.addEventListener("click", function() {
  newPosBear(-1*u, 0);
});

const rightButtonTarget = $("right-button");
rightButtonTarget.addEventListener("click", function() {
  newPosBear(1*u, 0);
});

const downButtonTarget = $("down-button");
downButtonTarget.addEventListener("click", function() {
  newPosBear(0, 1*u);
});

// Use arrow keys to control the polar bear and hit 'space' to start the game
window.addEventListener('keyup', function keyPress(key) {
  switch (key.code) {
    case 'ArrowUp':
      newPosBear(0, -1*u);
      break;
    case 'ArrowLeft':
      newPosBear(-1*u, 0);
      break;
    case 'ArrowRight':
      newPosBear(1*u, 0);
      break;
    case 'ArrowDown':
      newPosBear(0, 1*u);
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
