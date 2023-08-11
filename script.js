let bubbles = [];
class Bubble {
constructor(color, y) {
this.x = random(width);
this.y = random(0, document.body.scrollHeight);
this.diameter = random(10, 100);
this.speed = random(0.7, 2.1);
this.color = color;
}
move() {
this.y -= this.speed;
if (this.y < -this.diameter) {
this.y = document.body.scrollHeight + this.diameter;
this.x = random(width);
}
}
display() {
noStroke();
fill(this.color);
ellipse(this.x, this.y, this.diameter);
}
}
class AvatarBubble extends Bubble {
constructor() {
super();
this.diameter = 256;
this.speed *= 0.5;
this.x = random(0, width * 0.1);
this.img = loadImage('avatar.png');
}
display() {
image(this.img, this.x - this.diameter / 2, this.y - this.diameter / 2, this.diameter, this.diameter);
}
}
function setup() {
createCanvas(windowWidth, document.body.scrollHeight).position(0, 0).style('z-index', '0');
for (let i = 0; i < 12; i++) {
bubbles.push(new Bubble(color('#e9a651')));
bubbles.push(new Bubble(color('#9c2834')));
bubbles.push(new Bubble(color('#214b70')));
}
bubbles.push(new AvatarBubble());
}
function draw() {
background('#fffbe2');
for (let bubble of bubbles) {
bubble.move();
bubble.display();
}
}
function windowResized() {
resizeCanvas(windowWidth, document.body.scrollHeight);
}
