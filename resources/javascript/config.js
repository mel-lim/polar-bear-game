// Shortcut
const $ = id => {
  return document.getElementById(id);
}

// We want to set 1 unit = 65px
const u = 65;

// Target the canvas element and set its dimensions (9x7)
const gameCanvasTarget = $("game-canvas");
gameCanvasTarget.width = 9 * u;
gameCanvasTarget.height = 7 * u;

// Create drawing context on the canvas
const context = gameCanvasTarget.getContext("2d");

// Set the speed
let speed = 1750;

// Configure the starting coordinates for the game
const polarBearCoords = {
  x: 0,
  y: 1 * u
}

// Function to randomly generate each line of icebergs
const icebergLineGenerator = x => {
  let icebergLine = {};
  icebergLine.x = x * u;
  icebergLine.icebergConfiguration = chooseIslandConfigs();
  icebergLine.yArray = generateRandomIcebergs(icebergLine.icebergConfiguration);
  if (x % 2 == 1) {
    icebergLine.direction = "down";
  } else {
    icebergLine.direction = "up";
  }
  icebergLine.icebergPosArray = generateIcebergPosArray(icebergLine.icebergConfiguration, icebergLine.direction);
  return icebergLine;
}

// Function to calculate the coordinates and direction for the arrows on the game canvas
const arrowLineGenerator = (x, icebergLine) => {
  let arrowLine = {};
  arrowLine.x = x * u;
  const icebergPosArray = icebergLine.icebergPosArray;
  const icebergYArray = icebergLine.yArray;
  let arrowY;
  arrowLine.yArray = [];
  arrowLine.direction = icebergLine.direction;
  for (let i = 0; i < icebergPosArray.length; i++) {
    if (icebergPosArray[i] == "front") {

      if (arrowLine.direction == "down") {
        arrowY = icebergYArray[i] + u;
        if (arrowY > 6 * u) {
          arrowY = 0;
        }
      } else if (arrowLine.direction == "up") {
        arrowY = icebergYArray[i] - u;
        if (arrowY < 0) {
          arrowY = 6 * u;
        }
      }
      arrowLine.yArray.push(arrowY);
    }
  }
  return arrowLine;
}

// Generate the 6 lines of icebergs and the arrows
let icebergLines = [];
let arrowLines = [];
for (let x = 1; x < 8; x++) {
  const icebergLineTemp = icebergLineGenerator(x);
  icebergLines.push(icebergLineTemp);
  arrowLines.push(arrowLineGenerator(x, icebergLineTemp));
}

// Create a 2d array 9x7 (size of canvas) of empty strings (for now), to later store the 'id' of the image for that coordinate
const coordinateIds = [];
for (let i = 0; i < 9; i++) {
  coordinateIds[i] = [];
  for (let j = 0; j < 7; j++) {
    coordinateIds[i][j] = '';
  }
}