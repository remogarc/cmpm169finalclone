// sketch.js - Explore Space
// Author: Stephanie Ramirez
// Date: February 10, 2024


let earthsize = 75;
let moonsize = 50;
let sunsize = 200;
let numStars = 500;
let stars = [];
let twinkleSpeed = 0.02; // Adjust the speed of the twinkling effect
let shootingStars = [];
let shootingStarSpeed = 20;

function setup() {
    let canvasContainer = select("#canvas-container");
    let canvas = createCanvas(600, 600, WEBGL);
    canvas.parent(canvasContainer);
    angleMode(DEGREES);

    // Generate random positions for stars in the background
    for (let i = 0; i < numStars; i++) {
        let x = random(-width * 2, width * 2);
        let y = random(-height * 2, height * 2);
        let z = random(-2000, 2000);
        stars.push(createVector(x, y, z));
    }
    // Generate random positions for shooting stars
    for (let i = 0; i < numStars; i++) {
        let x = random(-width * 2, width * 2);
        let y = random(-height * 2, height * 2);
        let z = random(-2000, 2000);
        stars.push(createVector(x, y, z));
    }
}

function draw() {
    background(0);
    lights();
    orbitControl();

    // Draw shooting stars
    for (let i = 0; i < shootingStars.length; i++) {
        let star = shootingStars[i];
        let twinkle = noise(frameCount * twinkleSpeed + i) * 255;
        pointLight(255, 255, 255, star.x, star.y, star.z);
        fill(255, twinkle);
        push();
        translate(star.x, star.y, star.z);
        sphere(5); // Adjust the size of shooting stars as needed
        pop();

        // Update shooting star position
        star.x += shootingStarSpeed;

        // Remove shooting star if it goes beyond the view
        if (star.x > width * 2) {
        shootingStars.splice(i, 1);
        i--; // Decrement i to avoid skipping the next element after removal
        }
    }

    // Generate new shooting stars more frequently
    if (random() > 0.99) {
        let x = random(-width * 2, -width);
        let y = random(-height * 2, height * 2);
        let z = random(-2000, 2000);
        shootingStars.push(createVector(x, y, z));
    }

    // Draw twinkling stars in the background
    noStroke();
    for (let i = 0; i < stars.length; i++) {
        let starPos = stars[i];
        let starSize = 5; // Adjust the size of stars as needed
        let twinkle = noise(frameCount * twinkleSpeed + i) * 255;

        // Introduce a condition to decide whether a star should have color
        if (random() > 0.8) {
        // Color variation for some stars
        let starColor = color(random(255), random(255), random(255));
        pointLight(starColor, starPos.x, starPos.y, starPos.z);
        fill(starColor.levels[0], starColor.levels[1], starColor.levels[2]);
        } else {
        // Twinkling stars (white)
        pointLight(255, 255, 255, starPos.x, starPos.y, starPos.z);
        fill(255, twinkle);
        }

        push();
        translate(starPos.x, starPos.y, starPos.z);
        sphere(starSize);
        pop();
    }
    // draw sun
    push();
    noStroke();
    rotateY(frameCount * -0.05);
    rotateY(frameCount / 2);
    translate(0, 0, 0);
    fill(255, 165, 0);
    sphere(sunsize);

    // draw earth
    translate(500, 0, 0);
    push();
    fill(25, 140, 255);
    rotateY(frameCount * -0.1);
    sphere(earthsize);
    pop();
    // draw moon
    push();
    translate(150, 0, 0);
    rotateY(frameCount * -0.03);
    fill(100);
    sphere(moonsize);
    pop();

    pop();
}
