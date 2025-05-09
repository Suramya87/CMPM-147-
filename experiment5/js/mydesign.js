// project.js - Evolutionary Impressions

// Author: Suramya Shakya
// Date: 5/7/2025

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */


function getInspirations() {
  return [
    {
      name: "Disaster Girl", 
      assetUrl: "img/burn.jpg",
      credit: "Four-year-old Zoë Roth, 2005"
    },
    {
      name: "cricut cat", 
      assetUrl: "img/cat_1.jpg",
      credit: "Suramya Shakya,2025"
    },
    { name: "SQURREL",
     assetUrl:"img/squrriel_1.jpg",
     credit: "Suramya Shakya,2025"
    },
    { name: "yum",
     assetUrl:"img/icecream.jpg",
     credit: "Suramya Shakya,2025"
    },
    { name: "blackhole",
     assetUrl:"img/blackhole.jpg",
     credit:"https://www.goodfreephotos.com/astrophotography/artists-drawing-of-black-hole.jpg.php"
    }
    
    
    
  ];
}

function initDesign(inspiration) {
  let canvasContainer = $('.image-container'); // Correct jQuery selector
  let canvasWidth = canvasContainer.width();
  let aspectRatio = inspiration.image.height / inspiration.image.width;
  let canvasHeight = canvasWidth * aspectRatio;

  resizeCanvas(canvasWidth, canvasHeight);
  $(".caption").text(inspiration.credit);

  // Display the original image
  const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`
  $('#original').empty();
  $('#original').append(imgHTML);

  // Draw image to canvas and read pixels
  image(inspiration.image, 0, 0, canvasWidth, canvasHeight);
  loadPixels(); // Needed to use `pixels[]` correctly

  let design = {
    bg: 128,
    fg: []
  };

  let shapeCount = 8000;

  for (let i = 0; i < shapeCount; i++) {
    let x = floor(random(width));
    let y = floor(random(height));
    let idx = 4 * (y * width + x);
    let r = pixels[idx];
    let g = pixels[idx + 1];
    let b = pixels[idx + 2];
    let a = random(100, 200);

    design.fg.push({
      x,
      y,
      w: random(16, 32),
      h: random(16, 32),
      fill: { r, g, b, a }
    });
  }

  return design;
}

function renderDesign(design, inspiration) {
  background(255);
  noStroke();
  for (let shape of design.fg) {
    fill(shape.fill.r, shape.fill.g, shape.fill.b, shape.fill.a);
    ellipse(shape.x, shape.y, shape.w, shape.h);
  }
}

function mutateDesign(design, inspiration, rate) {
  for (let shape of design.fg) {
    shape.x = mut(shape.x, 0, width, rate);
    shape.y = mut(shape.y, 0, height, rate);
    shape.w = mut(shape.w, 2, 12, rate);
    shape.h = mut(shape.h, 2, 12, rate);

    shape.fill.r = mut(shape.fill.r, 0, 255, rate);
    shape.fill.g = mut(shape.fill.g, 0, 255, rate);
    shape.fill.b = mut(shape.fill.b, 0, 255, rate);
    shape.fill.a = mut(shape.fill.a, 80, 220, rate);
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}