// sketch.js - Space Cat
const canvasW = 1400;
const canvasH = 700;
let animalWidth = 300;
let animalHeight = 200;
let possibleSpeeds = [-5, 5];
let catInfo = {};
let ratInfo = {};
let backgroundImage;
let cat;
let rat;
let ratDead = false;
let ratsCaught = [];
let particles = [];

let colorScheme = ['#FF0000',
	'#FF7F00',
	'#FFFF00',
	'#00FF00',
	'#0000FF',
	'#4B0082',
  '#9400D3'
];

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
  let popMusic = loadSound("../music/pop.mp3");
  let nyanMusic = loadSound("../music/nyancat.mp3");

  catInfo.regCat = {
    image: regCatImg,    
    music: spaceMusic,
    id: 0
  };
  catInfo.jazzCat = {
    image: jazzCatImg,
    music: jazzMusic,
    id: 1
  };
  catInfo.popCat = {
    image: popCatImg, 
    music: popMusic,
    id: 2
  };
  catInfo.nyanCat = {
    image: nyanCatImg,
    music: nyanMusic,
    id: 3
  };
  // add more cats here but always make nyan cat last with the last ID

  ratInfo.regRat = {
    image: regRatImg,
    id: 0
  };
  ratInfo.jazzRat = {
    image: jazzRatImg,
    id: 1
  };
  ratInfo.popRat = {
    image: popRatImg,
    id: 2
  };
  ratInfo.nyanRat = {
    image: nyanRatImg,
    id: 3
  };
  // add more rats here but always make nyan rat with the last ID

  backgroundImage = loadImage('../img/galaxybg.png');
}

// Set up the canvas
function setup() {
  createCanvas(canvasW, canvasH, WEBGL);
  rat = new Animal(-200, -200, ratInfo.regRat.image, 0);
  cat = new Animal(0, 0, catInfo.regCat.image, 0);

  catInfo.regCat.music.play();
  catInfo.regCat.music.setLoop(true);
}

function draw() {
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

    ratDead = true;
    setTimeout(delayRespawn, 3000);
  }

  updateAndDisplayTrail();
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
    this.prevX = this.x;
    this.prevY = this.y;
    this.radius = animalWidth / 4;
    this.speedX = random(possibleSpeeds);
    this.speedY = random(possibleSpeeds);
  }

  // Update animal position
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    this.prevX = this.x;
    this.prevY = this.y;

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
    //Flip the image depending on speed
    if (this.speedX < 0) {
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
    let oldRatType = Object.keys(ratInfo).find(type => ratInfo[type]["id"] === this.id);
    let oldCatType = Object.keys(catInfo).find(type => catInfo[type]["id"] === cat.id);
    let oldMusic = catInfo[oldCatType]["music"];
    oldMusic.stop();

    if (!ratsCaught.includes(this.id)) { ratsCaught.push(this.id) }

    if (oldRatType != "nyanRat") {
      // Spawn nyan rat if all other rats except have been caught
      if (ratsCaught.length == Object.keys(ratInfo).length - 1) {
        this.img = ratInfo.nyanRat.image;
        this.id = ratInfo.nyanRat.id;
      } else {  // Spawn rat that hasn't been caught yet
        let newRatId = int(random(ratInfo.nyanRat.id));
        while (ratsCaught.includes(newRatId)) {
          newRatId = int(random(ratInfo.nyanRat.id));
        }

        let newRatType = Object.keys(ratInfo).find(type => ratInfo[type]["id"] === newRatId);
        this.img = ratInfo[newRatType]["image"];
        this.id = newRatId;
      }

      ratDead = false;
    }

    cat.id = ratInfo[oldRatType]["id"];
    let newCatType = Object.keys(catInfo).find(type => catInfo[type]["id"] === cat.id);
    cat.img = catInfo[newCatType]["image"];
    let newMusic = catInfo[newCatType]["music"];
    newMusic.play();
    newMusic.setLoop(true);
  }

}


function Particle(x, y, vx, vy) {
  this.pos = createVector(x, y);
  this.vel = createVector(vx, vy);
  this.acc = createVector(0, 0);
  this.lifespan = 255;
  this.color = random(colorScheme);

  this.update = function() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 4;
  };

  this.display = function() {
    noStroke();
    fill(this.color + hex(this.lifespan, 2));
    ellipse(this.pos.x, this.pos.y, 12); // Adjust size as needed
  };

  this.isDead = function() {
    return this.lifespan < 0;
  };
}

function updateAndDisplayTrail() {
  let direction = createVector(cat.x - cat.prevX, cat.y - cat.prevY).mult(-1);
  direction.normalize();

  for (let i = 0; i < 5; i++) {
    let angle = direction.heading() + random(-PI / 6, PI / 6);
    let speed = random(3, 8);
    particles.push(new Particle(cat.x - canvasW / 2, cat.y - canvasH / 2, cos(angle) * speed, sin(angle) * speed));
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}