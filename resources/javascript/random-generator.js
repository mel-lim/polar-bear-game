/* Function to randomly generate y-coordinates for each column 
We always want two islands per column, but of three different types of configurations. 
We will refer to the number of icebergs in each island in the following notation: (first island, second island)
1. (2, 2)
2. (2, 1)
3. (3, 1) */
const randomIcebergs = (island1Size, island2Size) => {
  let yCoords = [];
  let randomSpacing;

  // Randomly generate y-coordinate of the first island
  yCoords[0] = Math.floor(Math.random() * 7);

  // Calculate the y-coordinate of the second iceberg of the two-iceberg island
  yCoords[1] = yCoords[0] + 1;
  // 'Wrap' the iceberg if it goes off the screen
  if (yCoords[1] == 7) {
    yCoords[1] = 0;
  }

  // If the first island is three icebergs long
  if (island1Size == 3) {
    yCoords[2] = yCoords[1] + 1;
    // 'Wrap' the iceberg if it goes off the screen
    if (yCoords[2] == 7) {
      yCoords[2] = 0;
    }
  }

  // Randomly generate the spacing between the first and second island
  // The spacing will be either 2 or 3 if we have 2,2 or 3,1
  if ((island1Size == 2 && island2Size == 2) || (island1Size == 3 && island2Size == 1)) {
    randomSpacing = Math.floor(Math.random() * 2) + 2;
    // The spacing will be either 2, 3, or 4 if we have 2,1
  } else if (island1Size == 2 && island2Size == 1) {
    randomSpacing = Math.floor(Math.random() * 3) + 2;
  }
  // Using the spacing, calculate the coordinate of the first iceberg of the second island
  if (island1Size == 2) {
    yCoords[2] = yCoords[1] + randomSpacing;
    // 'Wrap' the island if it goes off the screen
    if (yCoords[2] > 6) {
      yCoords[2] -= 7;
    }
  } else if (island1Size === 3) {
    yCoords[3] = yCoords[2] + randomSpacing;
    if (yCoords[3] > 6) {
      yCoords[3] -= 7;
    }
  }
  // If the size of the second island is 2, calculate the y-coordinate of the second iceberg
  if (island2Size == 2) {
    yCoords[3] = yCoords[2] + 1;
    // 'Wrap' the iceberg if it goes off the screen
    if (yCoords[3] == 7) {
      yCoords[3] = 0;
    }
  }

  return yCoords;
} 

// Function to randomly choose which island configurations we will display for any one particular column
const chooseIslandConfigs = () => {
  const random012 = Math.floor(Math.random() * 3);
  if (random012 == 0) {
    island1Size = 2;
    island2Size = 2;
  } else if (random012 == 1) {
    island1Size = 2;
    island2Size = 1;
  } else {
    island1Size = 3;
    island2Size = 1;
  }
  return [island1Size, island2Size];
}

// Function to generate the yArray for each column
const generateRandomIcebergs = (islandSizes) => {
  return randomIcebergs(islandSizes[0], islandSizes[1]).map(y => y * u);
}

// Function to calculate the isLeadingArray
const generateIcebergPosArray = (islandSizes, direction) => {
  let icebergPosArray = [];
  if (direction == "down") {
    if (islandSizes[0] == 2 && islandSizes[1] == 2) {
      icebergPosArray = ["back", "front", "back", "front"];
    } else if (islandSizes[0] == 2 && islandSizes[1] == 1) {
      icebergPosArray = ["back", "front", "front"];
    } else if (islandSizes[0] == 3 && islandSizes[1] == 1) {
      icebergPosArray = ["back", "middle", "front", "front"];
    }
  } else if (direction == "up") {
    if (islandSizes[0] == 2 && islandSizes[1] == 2) {
      icebergPosArray = ["front", "back", "front", "back"];
    } else if (islandSizes[0] == 2 && islandSizes[1] == 1) {
      icebergPosArray = ["front", "back", "front"];
    } else if (islandSizes[0] == 3 && islandSizes[1] == 1) {
      icebergPosArray = ["front", "middle", "back", "front"];
    }
  }
  return icebergPosArray;
}















