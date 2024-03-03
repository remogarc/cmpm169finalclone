// sketch.js - Space Cat
const canvasW = 1400;
const canvasH = 700;
let animalWidth = 300;
let animalHeight = 200;
let possibleSpeeds = [-5, 5];
let catImages = {};
let ratInfo = {};
let backgroundImage;
let cat;
let rat;
let ratDead = false;
let ratsCaught = [];

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

  catImages.regCat = {
    image: regCatImg,
    id: 0
  };
  catImages.jazzCat = {
    image: jazzCatImg,
    id: 1
  };
  catImages.popCat = {
    image: popCatImg,
    id: 2
  };
  catImages.nyanCat = {
    image: nyanCatImg,
    id: 3
  };
  // add more cats here

  ratInfo.regRat = {
    image: regRatImg,
    music: spaceMusic,
    id: 0
  };
  ratInfo.jazzRat = {
    image: jazzRatImg,
    music: jazzMusic,
    id: 1
  };
  ratInfo.popRat = {
    image: popRatImg,
    music: popMusic,
    id: 2
  };
  ratInfo.nyanRat = {
    image: nyanRatImg,
    music: nyanMusic,
    id: 3
  };
  // add more rats here

  backgroundImage = loadImage('../img/galaxybg.png');
}

// Set up the canvas
function setup() {
  createCanvas(canvasW, canvasH, WEBGL);
  rat = new Animal(-200, -200, ratInfo.regRat.image, 0);
  cat = new Animal(0, 0, catImages.regCat.image, 0);

  ratInfo.regRat.music.play();
  ratInfo.regRat.music.setLoop(true);
}

function draw() {
  //background(220);
  image(backgroundImage, 0, 0);
  imageMode(CENTER);

  // Update and display animals
  if (!ratDead) {
    rat.update();
    rat.display();
  }

  cat.update();
  cat.display();

  // On collision, change cat direction and respawn new rat
  if (!ratDead && cat.intersects(rat)) {
    cat.speedX *= -1;
    cat.speedY *= -1;
    cat.display();

    //rat.x = rat.x * -1;
    //rat.y = rat.y * -1;
    ratDead = true;
    setTimeout(delayRespawn, 3000);
  }
}

function delayRespawn() {
  rat.respawn();
  
}

class Animal {
  constructor(x, y, img, id) {
    this.x = x + canvasW / 2;
    this.y = y + canvasH / 2;
    this.img = img;
    this.id = id;
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

  respawn() {
    let currentRatType = Object.keys(ratInfo).find(type => ratInfo[type]["id"] === this.id);
    let currentMusic = ratInfo[currentRatType]["music"];
    currentMusic.stop();

    if (!ratsCaught.includes(this.id)) { ratsCaught.push(this.id) }

    // Spawn nyan rat if all other rats except have been caught
    if (ratsCaught.length == Object.keys(ratInfo).length - 1) {
      this.img = ratInfo.nyanRat.image;
      this.id = ratInfo.nyanRat.id;
      ratInfo.nyanRat.music.play();
      ratInfo.nyanRat.music.setLoop(true);
    } else {  // Spawn rat that hasn't been caught yet
      let newRatId = int(random(ratInfo.nyanRat.id));
      while (ratsCaught.includes(newRatId)) {
        newRatId = int(random(ratInfo.nyanRat.id));
      }

      let newRatType = Object.keys(ratInfo).find(type => ratInfo[type]["id"] === newRatId);
      this.img = ratInfo[newRatType]["image"];
      this.id = newRatId;

      let newMusic = ratInfo[newRatType]["music"];
      newMusic.play();
      newMusic.setLoop(true);
    }

    ratDead = false;
  }
}