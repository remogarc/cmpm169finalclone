// sketch.js - Space Cat
let catImages = {};
let ratInfo = {};
let canvasW = 1400;
let canvasH = 700;
let rat;
let cat;
let animalWidth = 300;
let animalHeight = 200;
let backgroundImage;
let ratDead = false;
let possibleSpeeds = [-5, 5];

function preload() {
  let regCatImg = loadImage("../img/cat.png");
  let jazzCatImg = loadImage("../img/jazzcat.png");
  let popCatImg = loadImage("../img/popcat.png");
  let nyanCatImg = loadImage("../img/nyancat.png");

  let regRatImg = loadImage("../img/rat.png");
  let jazzRatImg = loadImage("../img/jazzrat.png");
  let popRatImg = loadImage("../img/poprat.png");
  let nyanRatImg = loadImage("../img/nyanrat.png")

  let spaceMusic = loadSound("../music/space.mp3");
  let jazzMusic = loadSound("../music/jazz.mp3");
  let popMusic = loadSound("../music/disco.mp3");
  let nyanMusic = loadSound("../music/nyancat.mp3");

  catImages.regCat = regCatImg;
  catImages.jazzCat = jazzCatImg;
  catImages.popCat = popCatImg;
  catImages.nyanCat = nyanCatImg;
  // add more cats here
  
  ratInfo.regRat = {
    image: regRatImg,
    music: spaceMusic
  }
  ratInfo.jazzRat = {
    image: jazzRatImg,
    music: jazzMusic
  }
  ratInfo.popRat = {
    image: popRatImg,
    music: popMusic
  }
  ratInfo.nyanRat = {
    image: nyanRatImg,
    music: spaceMusic
  }
  //add more rats here

  backgroundImage = loadImage('../img/galaxybg.png');
}

// Set up the canvas
function setup() {
  createCanvas(canvasW, canvasH, WEBGL);
  rat = new Animal(-200, -200, ratInfo.regRat.image);
  cat = new Animal(0, 0, catImages.regCat);

  ratInfo.regRat.music.play();
  ratInfo.regRat.music.setLoop(true);
}

function draw() {
  //background(220);
  image(backgroundImage, 0, 0);
  imageMode(CENTER);

  //Update and display animals
  if (!ratDead) {
    rat.update();
    rat.display();
  }

  cat.update();
  cat.display();

  if (!ratDead && cat.intersects(rat)) {//Make both animals move in the opposite direction when they collide
    cat.speedX *= -1;
    cat.speedY *= -1;

    //rat.x = rat.x * -1;
    //rat.y = rat.y * -1;
    cat.display();
    ratDead = true;
  }
}

class Animal {//Animal class
  constructor(x, y, img) {
    this.x = x + canvasW / 2;
    this.y = y + canvasH / 2;
    this.img = img
    this.radius = animalWidth / 4;
    this.speedX = random(possibleSpeeds);
    this.speedY = random(possibleSpeeds);
  }

  // Update animal position
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    // Bounce off the edges
    if (this.x + animalWidth / 4 >= canvasW || this.x - animalWidth / 4 <= 0) {
      this.speedX *= -1;
    }
    if (this.y + animalHeight / 4 >= canvasH || this.y - animalHeight / 4 <= 0) {
      this.speedY *= -1;
    }
  }

  // Display animal
  display() {
    /*noFill();
    ellipse(this.x-700,this.y-350,this.radius);*/
    if (this.speedX < 0) {//Flip the image depending on speed
      image(this.img, this.x - canvasW / 2, this.y - canvasH / 2, animalWidth, animalHeight);
    }
    else {
      image(this.img, this.x - canvasW / 2, this.y - canvasH / 2, -animalWidth, animalHeight);
    }
  }

  // Check if this animal intersects with another animal
  intersects(other) {
    let distanceSq = (this.x - other.x) ** 2 + (this.y - other.y) ** 2;
    let minDistSq = (this.radius + other.radius) ** 2;
    return distanceSq <= minDistSq;
  }
}