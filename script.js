let bubbles = [];

class Bubble {
    constructor(color, y) {
        this.x = random(width);
        this.y = random(0, height);
        this.diameter = random(10, 100);
        this.speed = random(1, 3);
        this.color = color;
    }

    move() {
        this.y -= this.speed;
        if (this.y < -this.diameter) {
            this.y = height + this.diameter;
            this.x = random(width);
        }
    }

    display() {
        fill(this.color);
        noStroke();
        ellipse(this.x, this.y, this.diameter, this.diameter);
    }
}

function setup() {
    const contentHeight = document.getElementById('content').scrollHeight;
    const contentWidth = document.getElementById('content').offsetWidth;
    let canvas = createCanvas(contentWidth, contentHeight);
    canvas.id('bubbles');
    canvas.parent('content');
    for (let i = 0; i < 12; i++) {
        bubbles.push(new Bubble(color('#e9a651')));
        bubbles.push(new Bubble(color('#9c2834')));
        bubbles.push(new Bubble(color('#214b70')));
    }
}

function draw() {
    background('#fffbe2');
    for (const bubble of bubbles) {
        bubble.move();
        bubble.display();
    }
}

function windowResized() {
    const contentHeight = document.getElementById('content').scrollHeight;
    const contentWidth = document.getElementById('content').offsetWidth;
    resizeCanvas(contentWidth, contentHeight);
}

function setupGrowOnHover() {
    document.querySelectorAll('.grow-on-hover').forEach(el => {
    
        el.addEventListener('mouseover', function() {
            el.style.transform = `scale(1.1)`;
        });
    
        el.addEventListener('mouseout', function() {
            el.style.transform = `scale(1)`;
        });
    });
}

setupGrowOnHover()
