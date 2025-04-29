
"use strict";
let flowerPatches = {};
let grassPatches = {};
let treePatches = {}; // NEW: tree locations
let clicks = {};
let worldSeed;

/* global XXH */
/* exported -- 
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  
  // Clear all placed data
  clicks = {};
  flowerPatches = {};
  grassPatches = {};
  treePatches = {};
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

function generateGrassPatch(i, j) {
  let key = [i, j];
  let blades = [];
  for (let n = 0; n < 30; n++) {
    blades.push({
      x: random(-tw/2, tw/2),
      y: random(-th/2, th/2),
      height: random(4, 8),
      tilt: random(-1, 1),
      color: color(20, random(100, 180), 20)
    });
  }
  grassPatches[key] = blades;
}

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);

  let nx = i * 0.1;
  let ny = j * 0.1;
  let elevation = noise(nx, ny);

  // Only allow flowers/trees on green tiles with no grass
  if (elevation <= 0.4 && !(key in grassPatches)) {
    // Chance to place a tree
    if (random() < 0.2) { // 20% chance
    treePatches[key] = {
      x: random(-tw/4, tw/4),
      y: random(-th/4, th/4),
      size: random(40, 60), 
      color: color(255, random(150, 200), random(200, 255), 220) 
      };
    } else {
      if (!(key in flowerPatches)) {
        let flowers = [];
        for (let k = 0; k < 10; k++) {
          flowers.push({
            x: random(-tw/2, tw/2),
            y: random(-th/2, th/2),
            color: color(255, random(100, 200), random(180, 255), 220)
          });
        }
        flowerPatches[key] = flowers;
      }
    }
  }
}


function p3_drawBefore() {

}

function p3_drawTile(i, j) {
  push();

  let nx = i * 0.1;
  let ny = j * 0.1;
  let elevation = noise(nx, ny);

  let key = [i, j];
  let clicked = (clicks[key] | 0) > 0;

  if (clicked) {
    fill(60, 180, 75);
  } else if (elevation > 0.6) {
    fill(139, 69, 19);
  } else if (elevation > 0.4) {
    fill(34, 139, 34);
  } else {
    fill(50, 205, 50);
  }

  noStroke();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  // Draw grass if elevation mid
  if (clicked || (elevation > 0.4 && elevation <= 0.6)) {
    if (!(key in grassPatches)) {
      generateGrassPatch(i, j);
    }
    for (let blade of grassPatches[key]) {
      stroke(blade.color);
      strokeWeight(1);
      line(
        blade.x, blade.y,
        blade.x + blade.tilt, blade.y - blade.height
      );
    }
    noStroke();
  }

  // Draw flowers
  if (flowerPatches[key]) {
    for (let f of flowerPatches[key]) {
      fill(f.color);
      ellipse(f.x, f.y, 4, 4);
    }
  }

  // Draw trees  
  if (treePatches[key]) {
    let tree = treePatches[key];

    // Pink leafy top
    fill(tree.color);
    ellipse(tree.x, tree.y - tree.size * 0.5,tree.size * 0.8,tree.size * 1.5);
    // Tree trunk
    fill(139, 69, 19);
    rect(tree.x - 4,tree.y - tree.size * 0.2,8,tree.size * 0.9 );
  }

  pop();
}

function p3_drawAfter() {}
