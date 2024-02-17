// sketch.js - Season Changing
// Author: Stephanie Ramirez
// Date: February 17th, 2024

// Variables related to season change
var counter = 0;
var seasonColor;
var targetColor;

// Variables for smooth color transition
var transitionDuration = 10000; // 10 seconds
var transitionStartTime;

// Variables for fading text
var fadeDuration = 4000; // 2 seconds
var fadeStartTime = 0;
var fadeText = getSeasonText();

// Variables related to leaves
var leaves = [];
var wind;

var joints = [];
var diff;
var yoff = 0;
var seed = 5;

// Tree Creation
function Branch(x, y, rot, len, diff, xoff) {
    joint_id = joints.length;

    var sw = map(len, 0, 200, 1, 20);
    strokeWeight(sw);
    stroke(90, 49, 57);

    var nPoint = p5.Vector.fromAngle(rot).mult(len);
    var nx = x + nPoint.x;
    var ny = y + nPoint.y;

    rot = p5.Vector.fromAngle(rot).mult(2).heading();
    line(x, y, nx, ny);
    joints.push([nx, ny]);

    for (var j = 0; j < joints.length; j++) {
        angle = map(noise(xoff + j / 10, yoff), 0, 1, radians(0), radians(60));
    }

    len = len * 2 / 3 * map(noise(diff), 0, 1, 0.5, 1.5);

    if (len > 10) {
        Branch(nx, ny, rot + angle, len, diff + 0.3, xoff);
        Branch(nx, ny, rot - angle, len, diff + 1, xoff);
    } else {
        // Add first layer of clusters
        for (var i = 0; i < 5; i++) {
        var clusterX = nx + random(-10, 10);
        var clusterY = ny + random(-10, 10);
        leaves.push(new Leaf(clusterX, clusterY));
        }
        // Add second layer of clusters
        for (var i = 0; i < 5; i++) {
        var clusterX = nx + random(-20, 20);
        var clusterY = ny + random(-20, 20);
        leaves.push(new Leaf(clusterX, clusterY));
        }

        // Add third layer of clusters
        for (var i = 0; i < 5; i++) {
        var clusterX = nx + random(-30, 30);
        var clusterY = ny + random(-30, 30);
        leaves.push(new Leaf(clusterX, clusterY));
        }
    }
}

// Create Leaf
function Leaf(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-1, 1), random(-1, 0));
    this.acceleration = createVector(0, 0.05);
    // Get a random letter for the leaf
    this.leafLetter = getRandomLetter();
    // Get color based on the season
    this.leafColor = getLeafColor();

    this.update = function() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
    };

    this.display = function() {
        fill(this.leafColor);
        noStroke();
        textSize(10);
        textAlign(CENTER, CENTER);
        text(this.leafLetter, this.position.x, this.position.y);
    };

    // Helper function to get a random letter
    function getRandomLetter() {
        var possibleLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return possibleLetters.charAt(floor(random(possibleLetters.length)));
    }

    // Helper function to get color based on the season
    function getLeafColor() {
        if (counter % 5 == 0) {
        // Spring
        return color(254, 163, 226); // Pink color for spring leaves
        } else if (counter % 5 == 1) {
        // Summer
        return color(194, 255, 106); // Yellow color for summer leaves
        } else if (counter % 5 == 2) {
        // Autumn
        return color(255, 86, 67); // Red color for autumn leaves
         } else {
        // Winter
        return color(255, 255, 255); // Default color for winter and falling leaves
        }
    }
}

// Timer for season changing
function timeIt() {
    counter++;
    transitionStartTime = millis();
    fadeStartTime = millis(); // Reset fade start time on season change
    fadeText = getSeasonText(); // Set fade text for the new season
}

// Change the season background
function changeSeason() {
    if (counter % 5 == 0) {
        // Spring
        targetColor = color(115, 182, 5);
    } else if (counter % 5 == 1) {
        // Summer
        targetColor = color(223, 183, 0);
    } else if (counter % 5 == 2) {
        // Autumn
        targetColor = color(226, 127, 2);
    } else if (counter % 5 == 3 || counter % 5 == 4) {
        // Winter
        targetColor = color(163, 252, 254);
    }

    if (!seasonColor) {
        seasonColor = targetColor;
    }

    // Smoothly transition to the target color
    var elapsed = millis() - (transitionStartTime || 0);
    var progress = constrain(elapsed / transitionDuration, 0, 1);
    seasonColor = lerpColor(seasonColor, targetColor, progress);

    // Set background color
    background(seasonColor);

    // Display fading text
    displayFadingText();
}

// Display fading text indicating the current season
function displayFadingText() {
    var elapsed = millis() - fadeStartTime;
    var alpha = map(elapsed, 0, fadeDuration, 255, 0);
    fill(255, 255, 255, alpha);
    textSize(64);
    textAlign(CENTER, CENTER);
    text(fadeText, width / 2, height / 2);
}

// Get the text indicating the current season
function getSeasonText() {
    if (counter % 5 == 0) {
        return "Spring";
    } else if (counter % 5 == 1) {
        return "Summer";
    } else if (counter % 5 == 2) {
        return "Autumn";
    } else if (counter % 5 == 3 || counter % 5 == 4) {
        return "Winter";
    }
}

// Setup tree and background
function setup() {
    let canvasContainer = select("#canvas-container");
    let canvas = createCanvas(600, 600);
    canvas.parent(canvasContainer);
    diff = random(0, 5);
    transitionStartTime = millis();
    fadeStartTime = millis();
    setInterval(timeIt, 5500);
}

function draw() {
    joints = [];
    leaves = [];
    randomSeed(seed);
    yoff += 0.002;
    // Create background based on season
    changeSeason();
    Branch(width / 2, height, 3 * PI / 2, 160, diff, 0);

    // Update and display leaves
    for (var i = 0; i < leaves.length; i++) {
        leaves[i].update();
        leaves[i].display();
    }
}