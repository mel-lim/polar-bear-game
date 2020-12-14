// Initialise image array
let images = [];

// Initialise the polar bear image
const polarBear = new Image();
polarBear.src = "resources/images/arctic/svg/025-polar bear.svg";
images.push(polarBear);

// Initialise the iceberg image
const iceberg = new Image();
iceberg.src = "resources/images/arctic/svg/015-iceberg.svg";
images.push(iceberg);

// Initialise the arrow images
const downArrow = new Image();
downArrow.src = "resources/images/arrows/down-arrow.svg";
images.push(downArrow);

const upArrow = new Image();
upArrow.src = "resources/images/arrows/up-arrow.svg";
images.push(upArrow);

// Initialise igloo
const igloo = new Image();
igloo.src = "resources/images/arctic/svg/017-igloo.svg";
images.push(igloo);

// Initialise the fish image
const fish = new Image();
fish.src = "resources/images/arctic/svg/009-fish.svg";
images.push(fish);

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
const snowFootstep = new sound("resources/sounds/snow-footstep.flac");
const splash = new sound("resources/sounds/lava.flac", false);
const backgroundMusic = new sound("resources/sounds/jewels-and-puzzles.mp3", true);
const chewing = new sound("resources/sounds/chewing.mp3", false);
const winSound = new sound("resources/sounds/win-sound.mp3", false);

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

  // Draw the igloo and the fish
  context.drawImage(igloo, 0, 0, 1 * u, 1 * u);
  context.drawImage(fish, 8 * u, 6 * u, 1 * u, 1 * u);
  coordinateIds[8][6] = 'fish';

  // Draw the icebergs and label each coordinate as 'iceberg' as they are drawn
  for (let i = 0; i < 7; i++) {
    const x = icebergLines[i]['x'];
    const yArray = icebergLines[i]['yArray'];
    yArray.forEach(y => {
      context.drawImage(iceberg, x, y, 1 * u, 1 * u);
      coordinateIds[x/u][y/u] = 'iceberg';
    });
  }

  // Draw the arrows: facing the 'down' direction for odd columns and facing the 'up' direction for even columns
  for (let i = 0; i < 7; i++) {
    const x = arrowLines[i]['x'];
    const yArray = arrowLines[i]['yArray'];
    const direction = arrowLines[i]['direction'];
    if (direction == "down") {
      yArray.forEach(y => context.drawImage(downArrow, x, y, 1 * u, 1 * u));
    } else if (direction == "up") {
      yArray.forEach(y => context.drawImage(upArrow, x, y, 1 * u, 1 * u));
    }
  }

  // Draw the polar bear
  context.drawImage(polarBear, polarBearCoords.x, polarBearCoords.y, 1 * u, 1 * u);
}

// Once all images are loaded, draw the initial canvas
let imagesLoaded = 0;
const numOfImages = images.length;

for (let i = 0; i < numOfImages; i++) {
  images[i].onload = function () {
    imagesLoaded++;
    if (imagesLoaded == numOfImages) {
      drawCanvas();
    }
  }
}