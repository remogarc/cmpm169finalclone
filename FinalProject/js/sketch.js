// sketch.js - Space Cat

// Cats and Rats
let cat;
let rat;
let cat2; 
let rat2;
let jazzcat; 
let jazzrat; 
let nyancat;
let nyanrat; 
let popcat; 
let poprat;


let canvasW = 1400;
let canvasH = 700;
let ratA;
let catA;
let animalWidth = 300;
let animalHeight = 200;
let backgroundImage;

// Rat dead
let ratDead = false;
let rat2Dead = false;
let jazzratDead = false;
let popratDead = false;
let nyanratDead = false;


let possibleSpeeds = [-5,5];


function preload(){
    cat = loadImage("../img/cat.png");
    rat = loadImage("../img/rat.png");
    cat2 = loadImage("../img/cat2.png");
    rat2 = loadImage("../img/rat2.png");
    jazzcat = loadImage("../img/jazzcat.png");
    jazzrat = loadImage("../img/jazzrat.png");
    nyancat = loadImage("../img/nyancat.png");
    nyanrat = loadImage("../img/nyanrat.png");
    popcat = loadImage("../img/popcat.png");
    poprat = loadImage("../img/poprat.png");


    backgroundImage = loadImage('../img/galaxgybg.png');
    //test
}

// Set up the canvas
function setup() {

    createCanvas(canvasW, canvasH,WEBGL);
    ratA = new Animal(random(-200, 200),random(-200, 200),rat);
    rat2 = new Animal(random(-200, 200),random(-200, 200),rat2);
    jazzrat = new Animal(random(-200, 200),random(-200, 200),jazzrat);
    poprat = new Animal(random(-200, 200),random(-200, 200),poprat);
    nyanrat = new Animal(random(-200, 200),random(-200, 200),nyanrat);

    catA = new Animal(random(-200, 200),random(-200, 200),cat);
}

function draw() {
   //background(220);
   image(backgroundImage,0,0);
   imageMode(CENTER);

   for(let i = 0; i < 140; i+=2)
   {
    stroke(255);            // Set the stroke (pixel color) to white
    point(starArr[i], starArr[i+1]);           // Draw a point at the random (x, y) position
   }
   // Stars


   //Update and display animals
   if(!ratDead){
    ratA.update();
    ratA.display();
   }

    if(!rat2Dead){
    rat2.update(); 
    rat2.display();
    }

    if(!jazzratDead){
    jazzrat.update();
    jazzrat.display();
    }

    if(!popratDead){
    poprat.update();
    poprat.display();
    }

    if(!nyanratDead){
    nyanrat.update();
    nyanrat.display();
    }


   catA.update();
   catA.display();

   if(!ratDead && catA.intersects(ratA)) {//Make both animals move in the opposite direction when they collide
    catA.speedX *= -1;
    catA.speedY *= -1;
    catA.display();
    ratDead = true;
  }

  if(!rat2Dead && catA.intersects(rat2)) {
    catA.speedX *= -1;
    catA.speedY *= -1;
    catA = new Animal(0,0,cat2);
    catA.display();
    rat2Dead = true;
  }

  if(!jazzratDead && catA.intersects(jazzrat)) {
    catA.speedX *= -1;
    catA.speedY *= -1;
    catA = new Animal(0,0,jazzcat);
    catA.display();
    jazzratDead = true;
  }

  if (!popratDead && catA.intersects(poprat)) {
    catA.speedX *= -1;
    catA.speedY *= -1;
    catA = new Animal(0,0,popcat);
    catA.display();
    popratDead = true;
  }

  if (!nyanratDead && catA.intersects(nyanrat)) {
    catA.speedX *= -1;
    catA.speedY *= -1;
    catA = new Animal(0,0,nyancat);
    catA.display();
    nyanratDead = true;
  }

}

class Animal {//Animal class
    constructor(x, y, img) {
      this.x = x+canvasW/2;
      this.y = y+canvasH/2;
      this.img = img
      this.radius = animalWidth/4;
      this.speedX = random(possibleSpeeds);
      this.speedY = random(possibleSpeeds);
    }
  
    // Update animal position
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      // Bounce off the edges
      if (this.x +animalWidth/4 >= canvasW|| this.x -animalWidth/4 <= 0 ) {
        this.speedX *= -1;
      }
      if (this.y + animalHeight/4 >= canvasH || this.y -animalHeight/4 <= 0) {
        this.speedY *= -1;
      }
    }
  
    // Display animal
    display() {
      /*noFill();
      ellipse(this.x-700,this.y-350,this.radius);*/
      if(this.speedX < 0){//Flip the image depending on speed
        image(this.img, this.x-canvasW/2, this.y-canvasH/2,animalWidth,animalHeight);
      }
      else{
        image(this.img, this.x-canvasW/2, this.y-canvasH/2,-animalWidth,animalHeight);
      }
    }
  
    // Check if this animal intersects with another animal
    intersects(other) {
      let distanceSq = (this.x - other.x) ** 2 + (this.y - other.y) ** 2;
      let minDistSq = (this.radius + other.radius) ** 2;
      return distanceSq <= minDistSq;
    }
  }