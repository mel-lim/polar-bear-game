const $ = id => {
  return document.getElementById(id);
}

const gameBoard = $("game-board");
console.log(gameBoard);

const context = gameBoard.getContext("2d");


context.fillStyle = "hsla(200, 61%, 70%, 0.3)";
context.fillRect(75, 0, 525, 525);

context.fillStyle = "white";
context.fillRect(0, 0, 75, 525);

const polarBear = new Image();
polarBear.addEventListener('load', function() {
  context.drawImage(polarBear, 0, 0, 75, 75);
});
polarBear.src = "resources/images/svg/025-polar bear.svg";
// Note to self, this relative path is as if the code is being executed in the HTML, not in the JS file

const iceberg = new Image();
iceberg.addEventListener('load', function() {
  context.drawImage(iceberg, 75, 0, 75, 75);
  context.drawImage(iceberg, 75, 75, 75, 75);
  context.drawImage(iceberg, 150, 75, 75, 75);
  context.drawImage(iceberg, 225, 75, 75, 75);
  context.drawImage(iceberg, 225, 150, 75, 75);
  context.drawImage(iceberg, 225, 225, 75, 75);
  context.drawImage(iceberg, 300, 225, 75, 75);
  context.drawImage(iceberg, 375, 225, 75, 75);
  context.drawImage(iceberg, 375, 150, 75, 75);
  context.drawImage(iceberg, 450, 150, 75, 75);
  context.drawImage(iceberg, 525, 150, 75, 75);
});
iceberg.src = "resources/images/svg/015-iceberg.svg";
