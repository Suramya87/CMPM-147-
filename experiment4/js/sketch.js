"use strict";

/* global XXH */
/* exported 
    p3_preload,
    p3_setup,
    p3_worldKeyChanged,
    p3_tileWidth,
    p3_tileHeight,
    p3_tileClicked,
    p3_drawBefore,
    p3_drawTile,
    p3_drawSelectedTile,
    p3_drawAfter
*/

// Only use p5 instance for `setup()` to set canvas parent
// new p5(function(p) {
//   p.setup = function() {
//     const canvas = p.createCanvas(400, 400);
//     canvas.parent("canvas-container-2"); // Important!
//   };
// });

function p3_preload() {}

let worldSeed;
function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};
let iceSheets = {};
let initialized = {}; // Track which tiles were evaluated for ice
let hasClicked = false; // Tracks if user has clicked any tile

function p3_setup() {
  // Initialize ice in the surrounding area
  for (let i = -10; i <= 10; i++) {
    for (let j = -10; j <= 10; j++) {
      let key = [i, j];
      if (!(key in initialized)) {
        initialized[key] = true;
        if (noise(i * 0.1, j * 0.1) > 0.55) {
          iceSheets[key] = {
            size: 1,
            life: 300 + random(100),
          };
        }
      }
    }
  }
}

function p3_tileClicked(i, j) {
  hasClicked = true; // Start melting once a tile is broken
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);

  if (iceSheets[key]) {
    let old = iceSheets[key];
    delete iceSheets[key];

    // Split into smaller pieces nearby
    let pieces = floor(random(2, 4));
    for (let k = 0; k < pieces; k++) {
      let ni = i + floor(random(-1, 2));
      let nj = j + floor(random(-1, 2));
      let nkey = [ni, nj];
      if (!initialized[nkey]) {
        initialized[nkey] = true;
        iceSheets[nkey] = {
          size: old.size * 0.5,
          life: old.life * 0.5,
        };
      }
    }
  }
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();
  push();

  // Draw base water tile
  fill(0, 70, 130);
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  let key = [i, j];
  let sheet = iceSheets[key];

  // Initialize ice sheet only once per tile
  if (!(key in initialized)) {
    initialized[key] = true;
    if (noise(i * 0.1, j * 0.1) > 0.55) {
      sheet = {
        size: 1,
        life: 300 + random(100),
      };
      iceSheets[key] = sheet;
    }
  }

  // Draw 3D ice tile if present
  if (sheet) {
    if (hasClicked) {
      sheet.life -= sheet.size;
    }

    if (sheet.life <= 0) {
      delete iceSheets[key];
    } else {
      // Top face (light blue)
      fill(200, 230, 255, 230);
      beginShape();
      vertex(-tw, -4);
      vertex(0, th - 4);
      vertex(tw, -4);
      vertex(0, -th - 4);
      endShape(CLOSE);

      // Front face (shadow)
      fill(180, 210, 230, 200);
      beginShape();
      vertex(-tw, -4);
      vertex(0, th - 4);
      vertex(0, th);
      vertex(-tw, 0);
      endShape(CLOSE);

      fill(160, 190, 220, 200);
      beginShape();
      vertex(tw, -4);
      vertex(0, th - 4);
      vertex(0, th);
      vertex(tw, 0);
      endShape(CLOSE);

      // Show cracks if clicked
      let n = clicks[key] | 0;
      if (n > 0) {
        stroke(30, 30, 30, 50);
        line(-tw / 2, -2, tw / 2, -2);
        line(0, -th / 2 - 2, 0, th / 2 - 2);
        noStroke();
      }
    }
  }

  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}