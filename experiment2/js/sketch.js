// sketch.js - purpose and description here
// Author: Suramya Shakya
// Date:04/13/2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
let seed = 239;
let starLayers = [];
let hazeClusters = []; // Store haze data




const star_1 = "0a0a2a";
const star_2 = "#ffe0f0";
const star_3 = "#eaffc2";
const bg4 = "#0a0a2a";
const bg5 = "#2256af";

function setup() {
  // Setup canvas inside #canvas-container
  const canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");

  // Optional style/appearance stuff
  noStroke();

  // Reimagine button handler
  select("#reimagine").mousePressed(() => {
    seed++;
    generateStars();
    generateHaze(); 
  });

  // Handle window resizing
  $(window).resize(function () {
    resizeScreen();
  });

  resizeScreen();

  // Initial draw
  generateStars();
  generateHaze();
}

function resizeScreen() {
  const canvasContainer = $("#canvas-container");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  generateStars();
  generateHaze();
}

function draw() {
  drawGradientSky();
  drawHaze();

  let mouseOffsetX = map(mouseX, 0, width, -1, 1);
  let mouseOffsetY = map(mouseY, 0, height, -1, 1);
  let time = millis() / 1000;

  for (let layer of starLayers) {
    fill(layer.color);
    for (let star of layer.stars) {
      let offsetX_mouse = mouseOffsetX * layer.parallaxFactor * 30;
      let offsetY_mouse = mouseOffsetY * layer.parallaxFactor * 30;

      let offsetX_time = sin(time + star.phase) * layer.parallaxFactor * 15;
      let offsetY_time = cos(time + star.phase) * layer.parallaxFactor * 25;

      let x = (star.x + offsetX_mouse + offsetX_time + width) % width;
      let y = (star.y + offsetY_mouse + offsetY_time + height) % height;

      ellipse(x, y, layer.size, layer.size);
    }
  }
}
function generateHaze() {
  hazeClusters = [];

  let clusterCount = 15; 
  let hazePerCluster = 50;

  for (let i = 0; i < clusterCount; i++) {
    let clusterX = random(width);
    let clusterY = random(height); 
    let cluster = [];

    for (let j = 0; j < hazePerCluster; j++) {
      let angle = random(TWO_PI);
      let radius = random(0, 60);
      let x = clusterX + cos(angle) * radius;
      let y = clusterY + sin(angle) * radius;
      let size = random(20, 60);
      let alpha = random(10, 30);

      cluster.push({ x, y, size, alpha });
    }

    hazeClusters.push(cluster);
  }
}


function generateStars() {
  randomSeed(seed);
  starLayers = [];

  const layerConfigs = [{ count: 1000, size: 1, color: star_3 , parallaxFactor: 0.1 },
    { count: 600, size: 3, color:  star_2 , parallaxFactor: 0.3 },
    { count: 300, size: 5, color: star_1 , parallaxFactor: 0.5 }
  ];

  for (let config of layerConfigs) {
    let stars = [];
    for (let i = 0; i < config.count; i++) {
      stars.push({
        x: random(width),
        y: random(height),
        phase: random(TWO_PI)
      });
    }
    starLayers.push({ stars, ...config });
  }
}

function drawGradientSky() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c1 = color(bg4); 
    let c2 = color(bg5); 
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawHaze() {
  noStroke();

  let mouseOffsetX = map(mouseX, 0, width, -1, 1);
  let mouseOffsetY = map(mouseY, 0, height, -1, 1);
  let time = millis() / 1000;

  for (let cluster of hazeClusters) {
    for (let haze of cluster) {
      let offsetX_mouse = mouseOffsetX * 0.02 * 30;
      let offsetY_mouse = mouseOffsetY * 0.02 * 30;

      let offsetX_time = sin(time + haze.x * 0.001) * 0.02 * 15;
      let offsetY_time = cos(time + haze.y * 0.001) * 0.02 * 25;

      let x = (haze.x + offsetX_mouse + offsetX_time + width) % width;
      let y = (haze.y + offsetY_mouse + offsetY_time + height) % height;

      fill(202, 184, 185, haze.alpha);
      ellipse(x, y, haze.size, haze.size);
    }
  }
}


