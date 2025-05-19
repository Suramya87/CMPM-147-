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
new p5(function(p) {
  p.setup = function() {
    const canvas = p.createCanvas(400, 400);
    canvas.parent("canvas-container-2"); // Important!
  };
});

let worldSeed;
let splashes = []; 
let noiseScale = 0.2;
let waveInfluence = 5;

function p3_preload() {}

function p3_setup() {}

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

function p3_tileClicked(i, j) {
  splashes.push({
    i: i,
    j: j,
    radius: 0,
    maxRadius: random(2, 6),
    lifetime: 120, 
    strength: waveInfluence,
    startTime: millis()
  });
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();

  let t = millis() * 0.001;
  let baseWave = noise(i * noiseScale, j * noiseScale, t * 0.5);
  let waveHeight = map(baseWave, 0, 1, -5, 5);
  
  for (let splash of splashes) {
    let d = dist(i, j, splash.i, splash.j);
    if (splash.lifetime > 0 && d < splash.radius) {
      let strengthFactor = map(d, 0, splash.radius, 1, 0);
      waveHeight += map(strengthFactor, 0, 1, -waveInfluence, waveInfluence);
    } else if (splash.unsplashRadius !== undefined && d > splash.unsplashRadius && d < splash.radius) {
      let strengthFactor = map(d, splash.unsplashRadius, splash.radius, 1, 0);
      waveHeight += map(strengthFactor, 0, 1, -waveInfluence, waveInfluence);
    }
  }

  let lowColor = color(0, 100, 200);
  let highColor = color(180, 220, 255);
  let waveLerp = constrain(map(waveHeight, -5, 5, 0, 1), 0, 1);
  let tileColor = lerpColor(lowColor, highColor, waveLerp);

  push();
  fill(tileColor);
  beginShape();
  vertex(-tw, 0 + waveHeight);
  vertex(0, th + waveHeight);
  vertex(tw, 0 + waveHeight);
  vertex(0, -th + waveHeight);
  endShape(CLOSE);

  fill(0, 80, map(baseWave, 0, 1, 80, 150));
  beginShape();
  vertex(-tw, 0 + waveHeight);
  vertex(0, th + waveHeight);
  vertex(0, th + 10);
  vertex(-tw, 10);
  endShape(CLOSE);

  fill(0, 60, map(baseWave, 0, 1, 60, 120));
  beginShape();
  vertex(tw, 0 + waveHeight);
  vertex(0, th + waveHeight);
  vertex(0, th + 10);
  vertex(tw, 10);
  endShape(CLOSE);
  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);
  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  pop();
}

function p3_drawAfter() {
  for (let splash of splashes) {
    if (splash.lifetime > 0) {
      splash.radius += 0.1;
      splash.lifetime--;
    } else {
      if (splash.unsplashRadius === undefined) splash.unsplashRadius = 0;
      splash.unsplashRadius += 0.1;
    }
  }

  splashes.sort((a, b) => a.startTime - b.startTime);
  splashes = splashes.filter(s => s.unsplashRadius === undefined || s.unsplashRadius < s.radius);
}
