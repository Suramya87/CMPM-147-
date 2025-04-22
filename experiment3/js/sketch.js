// sketch.js - Alternate Worlds
// Author: Suramya Shakya
// Date:4/21/2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
function generateGrid(cols, rows) {
  const grid = [];

  for (let row = 0; row < rows; row++) {
    const currentRow = [];

    for (let col = 0; col < cols; col++) {
      const terrain = noise(row / 60, col / 60);
      const detail = noise(row / 15, col / 15);

      const roomNoise = noise(row / 25 + 300, col / 25 + 300);

      // Dungeon room logic
      if (roomNoise > 0.65) {
        const inRoomX = col % 12;
        const inRoomY = row % 12;

        if (
          inRoomX === 0 || inRoomX === 11 ||
          inRoomY === 0 || inRoomY === 11
        ) {
          currentRow.push("x"); 
        } else {
          const chestNoise = noise(row / 5 + 999, col / 5 + 999);
          if (chestNoise > 0.85) {
            currentRow.push("o"); // open chest
          } else if (chestNoise > 0.75) {
            currentRow.push("c"); // closed chest
          } else {
            currentRow.push(" "); // dungeon floor
          }
        }
      }

      else if (terrain < 0.35) {
        currentRow.push("w"); 
      } 
      else if (terrain < 0.4) {
        currentRow.push("t"); 
      }
      else if (terrain < 0.5) {
        currentRow.push("."); 
      } 
      else if (terrain < 0.7) {
        currentRow.push(detail > 0.5 ? ":" : ".");
      } 

    }

    grid.push(currentRow);
  }

  return grid;
}


function drawGrid(grid) {
  background(128);
  noStroke();

  const g = 10;
  const t = millis() / 1000.0;

  const lookup = [
    [1, 1], [1, 0], [0, 1], [0, 0],
    [2, 1], [2, 0], [1, 1], [1, 0],
    [1, 2], [1, 1], [0, 2], [0, 1],
    [2, 2], [2, 1], [1, 2], [1, 1]
  ];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];
      placeTile(row, col, 1, 12); 
      if (cell === ":") {
        placeTile(row, col, (4 * pow(random(), g)) | 0, 13);
      }
      else if (cell === "t") {
        placeTile(row, col, floor(random(19, 27)), 0);
      }
      else if (cell === "w") {
        const waterFrame = floor((millis() / 1500 + row + col) % 3);
        placeTile(row, col, 1 + waterFrame, 14);

        let code = (
          ((grid[row - 1]?.[col] === "w") << 0) |
          ((grid[row]?.[col - 1] === "w") << 1) |
          ((grid[row]?.[col + 1] === "w") << 2) |
          ((grid[row + 1]?.[col] === "w") << 3)
        );
        code = ~code & 0xf;
        const [ti, tj] = lookup[code];
        placeTile(row, col, 9 + ti, 3 + tj);
      }
      if (cell === ".") {
        placeTile(row, col, (4 * pow(random(), g)) | 0, 12);
      } 
      else if (cell !== "t" && cell !== ":" && cell !== "." && cell !== "w") {
        let code = (
          ((grid[row - 1]?.[col] === ".") << 0) |
          ((grid[row]?.[col - 1] === ".") << 1) |
          ((grid[row]?.[col + 1] === ".") << 2) |
          ((grid[row + 1]?.[col] === ".") << 3)
        );
        const [ti, tj] = lookup[code];
        placeTile(row, col, 4 + ti, 0 + tj);
      }
      if (cell === "x") {
        placeTile(row, col, 8, 24);
      }
      else if (cell === " ") {
        placeTile(row, col, floor(random(4, 3)), 24);
      }
      else if (cell === "c") {
        placeTile(row, col, 3, 30);
      }
      else if (cell === "o") {
        placeTile(row, col, 0, 30);
      }
    }
  }
}
