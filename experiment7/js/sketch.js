// sketch.js - Data Visulization
// Author: Stephanie Ramirez
// Date: Feb 26, 2024

let table;
let scores = [];
let images = {};
let backgroundImage;
const canvasWidth = 600;
const canvasHeight = 600;

function preload() {
    table = loadTable('assets/VideoGameScore.csv', 'csv', 'header');
  backgroundImage = loadImage('assets/bg.jpeg')
  
  images['Super Mario 64 DS'] = loadImage('assets/mario64.jpeg');
  images['Twisted Metal: Head-On'] = loadImage('assets/twistedmetal.jpeg');
  images['New Super Mario Bros.'] = loadImage('assets/superMario.png');
  images['Pokemon Diamond'] = loadImage('assets/diamond.png');
  images['Pokemon Pearl'] = loadImage('assets/pearl.png');
  images['Gears of War'] = loadImage('assets/gearsWar.png');
  images['The Legend of Zelda: Twilight Princess'] = loadImage('assets/link.png');
  images['Cooking Mama'] = loadImage('assets/mama.jpeg');
  images['Spyro: Shadow Legacy'] = loadImage('assets/spyro.png');
  images['Mario Kart DS'] = loadImage('assets/marioKart.png');
  images['Spider-Man 2'] = loadImage('assets/spiderman.jpeg');
  images['Nintendogs'] = loadImage('assets/dog.png');
  images['Animal Crossing: Wild World'] = loadImage('assets/ac.jpeg');
  
  
}
function setup() {
    let canvasContainer = select("#canvas-container");
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(canvasContainer);
    image(backgroundImage, 0, 0, width, height);
    noLoop();

    // Process the data
    processData();
}
function processData() {
    // Loop through the rows of the CSV file
    for (let i = 0; i < table.getRowCount(); i++) {
        let gameTitle = table.getString(i, 'Title');
        let reviewScore = table.getNum(i, 'Metrics.Review Score');

        // Create an object to store the data
        let gameData = {
            title: gameTitle,
            score: reviewScore,
        };

        // Add the object to the scores array
        scores.push(gameData);
    }

    // Sort the scores array based on review scores (high to low)
    scores.sort((a, b) => b.score - a.score);
}
function draw() {
    let radiusOffset = 15; 
    let textOffset = 20; 
    // Draw circles based on review scores
    for (let i = 0; i < scores.length; i++) {
        let diameter = map(scores[i].score, 0, 100, 20, 100);

        // Calculate non-overlapping positions
        let validPosition = false;
        let xPos, yPos;

        while (!validPosition) {
            xPos = random(diameter / 2, width - diameter / 2);
            yPos = random(diameter / 2, height - diameter / 2);

            // Check if the current position overlaps with any existing circles
            validPosition = true;
            for (let j = 0; j < i; j++) {
                let otherDiameter = map(scores[j].score, 0, 100, 20, 100);
                let minDist = diameter / 2 + otherDiameter / 2 + radiusOffset;

                let distance = dist(xPos, yPos, scores[j].x, scores[j].y);
                if (distance < minDist) {
                    validPosition = false;
                    break;
                }
            }

            // Check if the text is too close to the canvas edges
            let textW = textWidth(scores[i].title);
            if (
                xPos - textW / 2 < 0 || xPos + textW / 2 > width ||
                yPos - diameter / 2 < 0 || yPos + diameter / 2 > height
            ) {
                validPosition = false;
            }

            // Check if the text is too close to the previous text or image
            for (let j = 0; j < i; j++) {
                let otherDiameter = map(scores[j].score, 0, 100, 20, 100);
                let minDistText = textW / 2 + otherDiameter / 2 + textOffset;

                let distanceText = dist(xPos, yPos, scores[j].x, scores[j].y);
                if (distanceText < minDistText) {
                    validPosition = false;
                    break;
                }
            }
        }

        // Store the position for future checks
        scores[i].x = xPos;
        scores[i].y = yPos;

        fill(255, 255, 255);
        ellipse(scores[i].x, scores[i].y, diameter, diameter);

        // Get the preloaded image based on the game title
        let img = images[scores[i].title];
        if (img) {
            // Adjust the image size based on the circle's diameter
            let imgSize = map(diameter, 20, 100, 10, 50);
            image(img, scores[i].x - imgSize / 2, scores[i].y - imgSize / 2, imgSize, imgSize);
        }

        // Display game title in the center of the circle
        fill(50, 200, 180);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text(scores[i].title, xPos, yPos);
    }
}


