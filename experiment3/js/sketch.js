// sketch.js - Putting the Puzzle back together
// Author: Stephanie Ramirez
// Date: January 26, 2024

let img;
let particles = [];

function preload() {
  img = loadImage('../img/waterlilly.jpeg');
}

function setup() {
    // Set up canvas with html settings
    let canvasContainer = select("#canvas-container");
    let canvas = createCanvas(470, 600);
    canvas.parent(canvasContainer);
    background(0, 0, 0);
  
    // Instantiate circular particles for each 5x5 pixel in the image
    for (let y = 0; y < img.height; y += 5) {
      for (let x = 0; x < img.width; x += 5) {
        let col = img.get(x, y);
        particles.push(new Particle(x, y, col));
      }
    }
  }
  
  function draw() {
    // Update and display particles
    for (let particle of particles) {
      particle.update();
      particle.display();
    }
  
    // Draw transparent circle around the cursor
    let targetX = mouseX;
    let targetY = mouseY;
    let easing = 0.1;
    mouseX += (targetX - mouseX) * easing;
    mouseY += (targetY - mouseY) * easing;
    // Set radius of circle
    let radius = 50;
    let transparency = 100;
    fill(255, transparency);
    noStroke();
    ellipse(mouseX, mouseY, radius * 2, radius * 2);
  
    // Check for a left mouse click
    if (mouseIsPressed && mouseButton === LEFT) {
      // Iterate over particles and move those within the transparent circle back to their original positions
      for (let particle of particles) {
        let distanceToCursor = dist(particle.x, particle.y, mouseX, mouseY);
        if (distanceToCursor < radius && !particle.isMovingBack) {
          particle.startMovingBack();
        }
      }
    }
  }
  // Create Particles from image and set move origin flag to false
  class Particle {
    constructor(x, y, col) {
      this.x = x;
      this.y = y;
      this.col = col;
      this.radius = 5;
      this.velocity = createVector(random(-1, 1), random(-1, 1));
      this.isMovingBack = false;
      this.originalX = x;
      this.originalY = y;
    }
  
    update() {
      if (this.isMovingBack) {
        // Move the particle back to its original position
        this.x = this.originalX;
        this.y = this.originalY;
      } else {
        // Move the particle
        this.x += this.velocity.x;
        this.y += this.velocity.y;
  
        // Bounce off the edges
        if (this.x < 0 || this.x > width) {
          this.velocity.x *= -1;
        }
        if (this.y < 0 || this.y > height) {
          this.velocity.y *= -1;
        }
      }
    }
  
    display() {
      // Draw the particle with a white canvas background
      fill(255);
      noStroke();
      ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
      fill(this.col);
      ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    }
  // Flag check to stop movement of particles 
    startMovingBack() {
      this.isMovingBack = true;
    }
  }
// Reset Canvas
function keyPressed() {
    if (keyCode == DELETE || keyCode == BACKSPACE) {
      // Reset particles and clear the canvas
      particles = [];
      for (let y = 0; y < img.height; y += 5) {
        for (let x = 0; x < img.width; x += 5) {
          let col = img.get(x, y);
          particles.push(new Particle(x, y, col));
        }
      }
      clear();
    }
  }