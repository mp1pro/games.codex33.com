//create array for ships
const images = ["assets/enemyships/enemy.png","assets/enemyships/enemy2.png","assets/enemyships/enemy3.png","assets/ship.png"];
let image = [];
(function() {
    let imagesLoaded = 0;
    for(let i =0; i < images.length; i++){
        image[i] = new Image();
        image[i].addEventListener('load', () => {
            // execute drawImage statements here
            //ctx.drawImage(image, 500, 500);
            imagesLoaded++;
            if(imagesLoaded === images.length){
                console.log('we can start',imagesLoaded,images.length);
                drawImage();
            }
        }, false);
        image[i].src = images[i];
    }
})();

let drawImage = () => {
    ctx.drawImage(image[3], 500, 500);
}

class Player {
    rightPressed = false;
    leftPressed = false;
    shootPressed = false;

    constructor(canvas, velocity) {
        this.canvas = canvas;
        this.velocity = velocity;

        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 75;
        this.width = 50;
        this.height = 48;
        this.image = new Image();
        this.image.src = "assets/ship.png";

        document.addEventListener("keydown", this.keydown);
        document.addEventListener("keyup", this.keyup);
    }
    init(){
        const x = this.props.width/2 - (this.props.width/10)/2;
        const y = this.props.height - (this.props.height/10);

        const move = {
            x: x,
            y: y
        };

        return move;
    }

    draw(ctx) {
        console.log('draw',ctx,this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    collideWithWalls() {
        //left
        if (this.x < 0) {
            this.x = 0;
        }

        //right
        if (this.x > this.canvas.width - this.width) {
            this.x = this.canvas.width - this.width;
        }
    }

    move() {
        if (this.rightPressed) {
            this.x += this.velocity;
        } else if (this.leftPressed) {
            this.x += -this.velocity;
        }
    }

    keydown = (event) => {
        if (event.code == "ArrowRight") {
            this.rightPressed = true;
        }
        if (event.code == "ArrowLeft") {
            this.leftPressed = true;
        }
        if (event.code == "Space") {
            this.shootPressed = true;
        }
    };

    keyup = (event) => {
        if (event.code == "ArrowRight") {
            this.rightPressed = false;
        }
        if (event.code == "ArrowLeft") {
            this.leftPressed = false;
        }
        if (event.code == "Space") {
            this.shootPressed = false;
        }
    };
}
