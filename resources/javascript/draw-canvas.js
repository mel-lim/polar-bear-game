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

  // Draw the icebergs and label each coordinate as 'iceberg' as they are drawn
  for (const col in gameConfig.icebergs) {
    const x = gameConfig.icebergs[col]['x'];
    const yArray = gameConfig.icebergs[col]['yArray'];
    yArray.forEach(y => {
      drawIceberg(x, y);
      coordinateIds[x/u][y/u] = 'iceberg';
    });
  }

  // Draw the arrows: facing the 'down' direction for odd columns and facing the 'up' direction for even columns
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