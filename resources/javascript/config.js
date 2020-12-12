// Shortcut
const $ = id => {
  return document.getElementById(id);
}

// We want to set 1 unit = 75px
const u = 75;

// Target the canvas element and set its dimensions (9x7)
const gameCanvasTarget = $("game-canvas");
gameCanvasTarget.width = 9 * u;
gameCanvasTarget.height = 7 * u;

// Create drawing context on the canvas
const context = gameCanvasTarget.getContext("2d");

// Configure the starting coordinates for the game
let gameConfig = {
  polarBear: {
    x: 0,
    y: 1 * u
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

// Create a 2d array 9x7 (size of canvas) of empty strings (for now), to later store the 'id' of the image for that coordinate
const coordinateIds = [];
for (let i = 0; i < 9; i++) {
  coordinateIds[i] = [];
  for (let j = 0; j < 7; j++) {
    coordinateIds[i][j] = '';
  }
}

// Make a deep copy of the initial game config to be used when we reset the canvas
const initialGameConfig = JSON.parse(JSON.stringify(gameConfig));