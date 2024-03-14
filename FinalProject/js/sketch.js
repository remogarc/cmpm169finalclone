// sketch.js - Space Cat
const canvasW = 1400;
const canvasH = 700;
let animalWidth = 150;
let animalHeight = 150;
let asteroidWidth = 100;
let asteroidHeight = 100;
let asteroids = [];
let possibleSpeeds = [-5, 5];
let catInfo = {};
let ratInfo = {};
let backgroundImage;
let cat;
let rat;
let ratDeathSound
let ratDead = false;
let ratsCaught = [];
let particles = [];

var drawRainbow = function(shift) {
  var red = color(255, 10, 10);
  var orange = color(255, 111, 0);
  var yellow = color(255, 255, 0);
  var green = color(0, 255, 0);
  var blue = color(0, 136, 255);
  var purple = color(145, 48, 255);

  scale(nyanscale,nyanscale);
  translate(0,nyany);
  
  strokeWeight(20);
  drawRainbowStreak(shift, red, 125);
  drawRainbowStreak(shift, orange, 145);
  drawRainbowStreak(shift, yellow, 165);
  drawRainbowStreak(shift, green, 185);
  drawRainbowStreak(shift, blue, 205);
  drawRainbowStreak(shift, purple, 225);
  resetMatrix();
};

let drawStars = function(state, dx) {
  stroke(255, 255, 255);
  drawStar(state, 400 - (dx % 400), 30);
  drawStar((state + 2) % 4, 400 - ((dx + 100) % 400), 100);
  drawStar((state + 1) % 4, 400 - ((dx - 60) % 400), 150);
  drawStar((state + 3) % 4, 400 - ((dx + 200) % 400), 230);
  drawStar((state + 2), 400 - ((dx + 300) % 400), 290);
  drawStar((state + 1), 400 - ((dx - 175) % 400), 370);
};

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
  let countryCatImg = loadImage("../img/countrycat.png");
  let rockCatImg = loadImage("../img/rockcat.png");
  let hiphopCatImg = loadImage("../img/hiphopcat.png");
  let nyanCatImg = loadImage("../img/nyancat.png");

  let regRatImg = loadImage("../img/rat.png");
  let jazzRatImg = loadImage("../img/jazzrat.png");
  let popRatImg = loadImage("../img/poprat.png");
  let countryRatImg = loadImage("../img/countryrat.png");
  let rockratImg = loadImage("../img/rockrat.png");
  let hiphopRatImg = loadImage("../img/hiphoprat.png");
  let nyanRatImg = loadImage("../img/nyanrat.png")
  let rathead = loadImage("../img/ratHead.png");
  let ratBone1 = loadImage("../img/ratBone1.png");
  let ratBone2 = loadImage("../img/ratBone2.png");
  let ratBone3 = loadImage("../img/ratBone3.png");
  let ratBone4 = loadImage("../img/ratBone4.png");

  let spaceMusic = loadSound("../music/space.mp3");
  let jazzMusic = loadSound("../music/jazz.mp3");
  let popMusic = loadSound("../music/pop.mp3");
  let countryMusic = loadSound("../music/country.mp3");
  let rockMusic = loadSound("../music/rock.mp3");
  let hiphopMusic = loadSound("../music/hiphop.mp3");
  let nyanMusic = loadSound("../music/nyancat.mp3");
  ratDeathSound = loadSound("../music/squek.mp3");

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
  catInfo.countryCat = {
    image: countryCatImg,
    music: countryMusic,
    id: 3
  };
  catInfo.rockCat = {
    image: rockCatImg,
    music: rockMusic,
    id: 4
  };
  catInfo.hiphopCat = {
    image: hiphopCatImg,
    music: hiphopMusic,
    id: 5
  };
  catInfo.nyanCat = {
    image: nyanCatImg,
    music: nyanMusic,
    id: 6
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
  ratInfo.countryRat = {
    image: countryRatImg,
    id: 3
  };
  ratInfo.rockRat = {
    image: rockratImg,
    id: 4
  };
  ratInfo.hiphopRat = {
    image: hiphopRatImg,
    id: 5
  };
  ratInfo.nyanRat = {
    image: nyanRatImg,
    id: 6
  };
  // add more rats here but always make nyan rat with the last ID

  backgroundImage = loadImage('../img/galaxybg.png');
  asteroid = loadImage('../img/asteroid.png');
}

// Set up the canvas
function setup() {
  createCanvas(canvasW, canvasH, WEBGL);
  rat = new Animal(-200, -200, ratInfo.regRat.image, 0);
  cat = new Animal(0, 0, catInfo.regCat.image, 0);

  catInfo.regCat.music.play();
  catInfo.regCat.music.setLoop(true);

  // Create multiple asteroids
  for (let i = 0; i < 15; i++) {
    let asteroidX = random(canvasW) - canvasW / 2;
    let asteroidY = random(canvasH) - canvasH / 2;
    asteroids.push(new Asteroid(asteroidX, asteroidY, asteroid));
  }
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

  // Update and display asteroids
  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].update();
    asteroids[i].display();

    // Check for mouse interaction
    if (asteroids[i].isMouseOver() && mouseIsPressed) {
      asteroids[i].dragging = true;
      asteroids[i].offsetX = asteroids[i].x - mouseX;
      asteroids[i].offsetY = asteroids[i].y - mouseY;
    }

    if (asteroids[i].dragging) {
      asteroids[i].x = mouseX + asteroids[i].offsetX;
      asteroids[i].y = mouseY + asteroids[i].offsetY;
    }
    // Stop dragging when mouse is released
    if (!mouseIsPressed) {
      asteroids[i].dragging = false; 
    }

    // Check for collision with the cat
    if (cat.intersects(asteroids[i])) {
      // Invert the cat's direction
      cat.speedX *= -1;
      cat.speedY *= -1;

      // Invert the asteroid's direction
      asteroids[i].speedX *= -1;
      asteroids[i].speedY *= -1;
    }

    if (rat.intersects(asteroids[i])) {
      // Invert the cat's direction
      rat.speedX *= -1;
      rat.speedY *= -1;

      // Invert the asteroid's direction
      asteroids[i].speedX *= -1;
      asteroids[i].speedY *= -1;
    }
  }

  // On collision, change cat direction and respawn new rat
  if (!ratDead && cat.intersects(rat)) {
    cat.speedX *= -1;
    cat.speedY *= -1;
    cat.display();
    ratDeathSound.play();
    ratDeathSound.setLoop(false);

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

class Asteroid {
  constructor(x, y, img) {
    this.x = x + canvasW / 2;
    this.y = y + canvasH / 2;
    this.img = img;
    this.radius = asteroidWidth / 4;
    this.speedX = random(possibleSpeeds);
    this.speedY = random(possibleSpeeds);
    this.paused = false;
    this.dead = false;
  }

  update() {
    if (!this.paused) {
      if (this.speedX == 0) {
        this.speedX = random(possibleSpeeds);
        this.speedY = random(possibleSpeeds);
      }

      this.x += this.speedX * 0.25; // Adjust the speed as needed HERE
      this.y += this.speedY * 0.25; // Adjust the speed as needed HERE

      // Bounce off the edges
      if (this.x + asteroidWidth / 4 >= canvasW || this.x - asteroidWidth / 4 <= 0) {
        this.speedX *= -1;
      }
      if (this.y + asteroidHeight / 4 >= canvasH || this.y - asteroidHeight / 4 <= 0) {
        this.speedY *= -1;
      }
    } else {
      this.speedX = 0;
      this.speedY = 0;
    }
  }

  display() {

    if (this.speedX < 0) {//Flip the image depending on speed
      image(this.img, this.x - canvasW / 2, this.y - canvasH / 2, asteroidWidth, asteroidHeight);
    }
    else {
      image(this.img, this.x - canvasW / 2, this.y - canvasH / 2, -asteroidWidth, asteroidHeight);
    }
  }

  // Check if this animal intersects with asteroid
  intersects(other) {
    let distanceSq = (this.x - other.x) ** 2 + (this.y - other.y) ** 2;
    let minDistSq = (this.radius + other.radius) ** 2;
    return distanceSq <= minDistSq;
  }

  // Check if the mouse is over the asteroid
  isMouseOver() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d <= this.radius;
  }
}

function Particle(x, y, vx, vy) {
  this.pos = createVector(x, y);
  this.vel = createVector(vx, vy);
  this.acc = createVector(0, 0);
  this.lifespan = 255;
  this.color = random(colorScheme);

  this.update = function () {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 4;
  };

  this.display = function () {
    noStroke();
    fill(this.color + hex(this.lifespan, 2));
    ellipse(this.pos.x, this.pos.y, 12);
  };

  this.isDead = function () {
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