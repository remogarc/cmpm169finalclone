// sketch.js - Mini rave show at home
// Author: Stephanie Ramirez
// Date: January 19, 2024

// Delete: Reset canvas

// Set up the canvas
function setup() {
    // Set up canvas with html settings
    let canvasContainer = select("#canvas-container");
    let canvas = createCanvas(800, 500);
    canvas.parent(canvasContainer);
    background(0, 0, 0);
}

// Counter for tracking the number of lines
let lineCounter = 0; 

function draw() {
    // Set the number of rows and arrowheads in each row
    let numRows = 5;
    let numArrowheads = 5;

    // Calculate the spacing between rows and arrowheads
    let rowSpacing = height / (numRows + 1);
    let arrowSpacing = width / (numArrowheads + 1);

    // Gradient (Blue to Red) arrowheads based on the mouse location
    let gradientColorBlue = color(0, 0, 255);
    let gradientColorRed = color(255, 0, 0);

    // Draw random lines
    if (lineCounter < 500) {
    for (let i = 0; i < 5; i++) {
        let x1 = random(width);
        let y1 = random(height);
        let x2 = random(width);
        let y2 = random(height);

        let lineColor = color(random(255), random(255), random(255));
        strokeWeight(1);
        stroke(lineColor);
        line(x1, y1, x2, y2);

        lineCounter++;
    }
    }

    // Loop through the number of rows
    for (let row = 1; row <= numRows; row++) {
    // Loop through the number of arrowheads in each row
    for (let i = 1; i <= numArrowheads; i++) {
        // Calculate the x and y coordinates for each arrowhead
        let x = i * arrowSpacing;
        let y = row * rowSpacing;

        // Calculate the distance between the arrowhead and the mouse
        let distance = dist(mouseX, mouseY, x, y);

        // Set detection radius
        let proximity = 200;

        // Map the distance to a color gradient
        let mappedColor = map(distance, 0, proximity, 1, 0);

        // Switch between blue and red
        let switchColor = lerpColor(gradientColorBlue, gradientColorRed, mappedColor);

        // Set the fill color
        fill(switchColor);

        // Draw an arrowhead pointing towards the mouse
        drawArrowhead(x, y, 30, atan2(mouseY - y, mouseX - x));
    }
    }
}

// Draw an arrowhead
function drawArrowhead(x, y, size, angle) {
    push();
    translate(x, y);
    rotate(angle);
    beginShape();
    vertex(0, -size / 2);
    vertex(size, 0);
    vertex(0, size / 2);
    endShape(CLOSE);
    pop();
}

// Reset Canvas
function keyReleased() {
    if (keyCode == DELETE || keyCode == BACKSPACE) {
    background(0);
    lineCounter = 0; // Reset the line counter
    }
}  