let bubbles = [];
const iphoneSlider = document.getElementById('iphone-slider');

class Bubble {
    isLeftover = false;

    constructor(color, x = random(width), diameter = random(10, 100), speedMultiplier = 1) {
        this.x = x;
        this.y = random(0, height);
        this.diameter = diameter;
        this.speed = random(1, 3) * speedMultiplier;
        this.color = color;
    }

    move() {
        const intersection = this.calculateIntersection(iphoneSlider);
        this.y -= (intersection !== 0) ? this.speed * (1 - intersection * 0.65) : this.speed;
        this.x += random(-1, 1) / 5;

        if (this.y < -this.diameter) {
            this.isLeftover ? this.remove() : this.reset();
        }
    }

    display() {
        fill(this.color);
        noStroke();
        ellipse(this.x, this.y, this.diameter, this.diameter);
    }

    isInside(px, py) {
        return dist(px, py, this.x, this.y) < this.diameter / 2;
    }

    reset() {
        this.y = height + this.diameter;
        this.x = random(width);
    }

    remove() {
        bubbles = bubbles.filter(bubble => bubble !== this);
    }

    calculateIntersection(elem) {
        const scrollY = window.scrollY;
        const bubbleBounds = {
            left: this.x - this.diameter / 2,
            right: this.x + this.diameter / 2,
            top: this.y - this.diameter / 2 - scrollY,
            bottom: this.y + this.diameter / 2 - scrollY
        };
        const elemRect = elem.getBoundingClientRect();

        const overlap = {
            left: Math.max(bubbleBounds.left, elemRect.left),
            right: Math.min(bubbleBounds.right, elemRect.right),
            top: Math.max(bubbleBounds.top, elemRect.top),
            bottom: Math.min(bubbleBounds.bottom, elemRect.bottom)
        };

        if (overlap.right < overlap.left || overlap.bottom < overlap.top) return 0;  // No overlap

        const overlapArea = (overlap.right - overlap.left) * (overlap.bottom - overlap.top);
        const bubbleArea = Math.PI * (this.diameter / 2) ** 2;
        return overlapArea / bubbleArea;
    }
}

// Preloading sound
let bubbleSound;
let soundLoaded = false;

function preload() {
    bubbleSound = new Howl({
        src: ['bubblePop.mp3'],
        volume: 0.02,
        onload: () => {
            soundLoaded = true;
            console.log("Sound loaded successfully.");
        },
        onloaderror: (e, message) => {
            soundLoaded = false;
            console.error("Error loading the sound file.", message);
        }
    });
}

function setup() {
    const contentElement = document.getElementById('content');
    const canvas = createCanvas(contentElement.offsetWidth, contentElement.scrollHeight);
    canvas.id('bubbles');
    canvas.parent('content');

    const colors = ['#e9a651', '#9c2834', '#214b70'];
    for (let i = 0; i < 12; i++) {
        colors.forEach(color => bubbles.push(new Bubble(color)));
    }
}

function draw() {
    background('#fffbe2');
    bubbles.forEach(bubble => {
        bubble.move();
        bubble.display();
    });
}

function windowResized() {
    const contentElement = document.getElementById('content');
    resizeCanvas(contentElement.offsetWidth, contentElement.scrollHeight);
}

function touchStarted() {
    handleBubbleInteraction();
}

function mousePressed() {
    handleBubbleInteraction();
}

function handleBubbleInteraction() {
    for (let i = bubbles.length - 1; i >= 0; i--) {
        if (bubbles[i].isInside(mouseX, mouseY)) {
            soundLoaded ? bubbleSound.play() : console.warn("The sound has not been loaded yet.");
            createLeftoverBubbles(bubbles[i]);
            bubbles[i].reset();
            break;
        }
    }
}

function createLeftoverBubbles(originalBubble) {
    const originalArea = Math.PI * (originalBubble.diameter / 2) ** 2;
    let accumulatedArea = 0;
    const colors = ['#e9a651', '#9c2834', '#214b70'];

    while (accumulatedArea < originalArea / 2) {
        let maxDiameter = Math.sqrt((originalArea - accumulatedArea) / Math.PI) * 2;
        let newDiameter = random(Math.min(10, originalBubble.diameter / 2), maxDiameter / 2);

        let bubble = new Bubble(random(colors), 
                                random(originalBubble.x - originalBubble.diameter / 3, originalBubble.x + originalBubble.diameter / 3), 
                                newDiameter, 
                                random(2, 4));

        bubble.y = random(originalBubble.y - originalBubble.diameter / 3, originalBubble.y + originalBubble.diameter / 3);
        bubble.isLeftover = true;

        bubbles.push(bubble);
        accumulatedArea += Math.PI * (newDiameter / 2) ** 2;
    }
}

function setupGrowOnHover() {
    document.querySelectorAll('.grow-on-hover').forEach(el => {
        el.addEventListener('mouseover', () => el.style.transform = 'scale(1.1)');
        el.addEventListener('mouseout', () => el.style.transform = 'scale(1)');
    });
}

setupGrowOnHover();
