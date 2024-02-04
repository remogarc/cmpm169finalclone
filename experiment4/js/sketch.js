// sketch.js - Emmersive Laser Show
// Author: Stephanie Ramirez
// Date: February 4th, 2024

var r = 0,ra = 1,s = 200,eq = 7.5,c = 0,cs = 1;
var x = 0,y = 0;
var x1 = 0,y1 = 0;
var sp;
var sp1,seed;
var audio;  
var capture;
var fft;
var amp;
var particles = [];

function preload() {
  audio = loadSound('assets/sample169.mp3');
}

function setup() {
  let canvasContainer = select("#canvas-container");
  let canvas = createCanvas(600, 600);
  canvas.parent(canvasContainer);
  background(0);
  // Laser setup
  s = 1.4*(width+height)/eq;
  pi = PI*2;
  csp = ((random(1,pi)/PI)/s + 1)%255;
  seed = round(csp+cos(random(-PI,PI)*(eq*csp)+pi)*(Math.E%s));
  sp  = cos(seed+csp)%255;
  sp1 = sin(seed+csp)%255;
  sp  = sp/2;
  sp1 = sp1/2;
  csp = tan(Number(sp,sp1))+pi;
  colorMode(HSB,255,255,255,255);
  // Audio setup
  fft = new p5.FFT();
  audio.play(); 
  // Loop the audio
  audio.setLoop(true);
  loop();
  // Create a capture object from the webcam
  pixelDensity(1);
  capture = createCapture(VIDEO);
  capture.size(320, 240);
  capture.hide();
}

function draw() {
  frameRate(30);
  background(255);
  // Display the webcam capture in the center of the canvas
  image(capture, width / 4, height / 4, width / 2, height / 2);
  // Apply a color pixel effect to the webcam
  loadPixels();
  for (let y = 0; y < height; y ++) {
    for (let x = 0; x < width; x++) {
      let i = (width * y + x) * 4;
      let rI = ((width * y) + (width - x - 1)) * 4;

      // get r,g,b values from pixel array
      let r = pixels[i + 0];
      let g = pixels[i + 1];
      let b = pixels[i + 2];

      let br = (r + b + g) / 3;

      if (br > 110) {
      // Make background black
       pixels[i + 0] = 0;
       pixels[i + 1] = 0;
       pixels[i + 2] = 0;
      }
    }
  }
  updatePixels();
  noStroke();
  fill(0, 15);
  rect(0, 0, width, height);
  // Create laser circle on canvas
  angleMode(RADIANS);
  for(var i = 0;i < round(pi*10);i++){
    createIt();
  }
  stroke(100);
  noFill();
  strokeWeight(2);
  ellipse(width/2,height/2,s*2);
  // Reset angle mode to DEGREES for audio waveform
  angleMode(DEGREES);
  // Create circular waveform
  translate(width/2, height/2);
  fft.analyze();
  amp = fft.getEnergy(20, 200);
  var wave = fft.waveform();
  stroke(255);
  noFill();
  
  for(var l = -1; l <= 1; l+= 2){
    beginShape();
    for(var i = 0; i <= 180; i += 0.5) {
      var index = floor(map(i, 0, 180, 0, wave.length - 1));
      var r = map(wave[index], -1, 1, 260, 190);
      var x = r * sin(i) * l;
      var y = r * cos(i);
      vertex(x,y);
    }
  endShape();
  }
  var p = new Particles();
  particles.push(p);
  
  for(var i = particles.length - 1; i >= 0; i--) {
    if(!particles[i].edges()) {
      particles[i].update(amp > 230);
      particles[i].show();
    } else {
      particles.splice(i,1);
    }
  }
}
// Function for circular lasers
function createIt(){
  c+= cs*csp;
  if(c > 255 | c < 0){
    cs = -cs;
  }
  x+=sp;
  y+=sp;
  x1+=sp1;
  y1+=sp1;
  push();
  stroke(c,255,255,255);
  strokeWeight(2.5);
  r+=ra;
  translate(width/2,height/2);
  rotate(radians(r));
  line(cos(x/PI)*s,sin(y/PI)*s,sin(x1/PI)*s,cos(y1/PI)*s);
  pop();
  x-=sp/pi;
  y-=sp/pi;
  x1-=sp1/pi;
  y1-=sp1/pi;
}

class Particles {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250);
    this.vel = createVector(0,0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001));
    this.w = random(3,5)
  }
  update(cond) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if(cond) {
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
  }
  edges() {
    if(this.pos.x < -width / 2 || this.pos.x > width / 2 || this.pos.y < -height / 2 || this.pos.y > height / 2) {
      return true;
    } else {
      return false;
    }
  }
  show() {
    noStroke();
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.w);
  }
}
// Reset Canvas
function keyPressed() {
  if (keyCode == DELETE || keyCode == BACKSPACE) {
    // Reset seed
    seed = round(random(1000)); // You can adjust the range as needed
    // Restart the audio
    audio.stop();
    audio.play();
    // Reset particles
    particles = [];
    // Clear the canvas
    clear();
    // Laser setup
    s = 1.4 * (width + height) / eq;
    pi = PI * 2;
    csp = ((random(1, pi) / PI) / s + 1) % 255;
    sp = cos(seed + csp) % 255;
    sp1 = sin(seed + csp) % 255;
    sp = sp / 2;
    sp1 = sp1 / 2;
    csp = tan(Number(sp, sp1)) + pi;
    colorMode(HSB, 255, 255, 255, 255);
  }
}