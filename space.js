//create array for ships
const images = ["assets/enemyships/enemy.png","assets/enemyships/enemy2.png","assets/enemyships/enemy3.png","assets/ship.png"];
let image = [];
let raf;
let move = {};
let c2w = canvas2.width


const ship = {
    x:w/2 - (w/10)/2,
    y:h - (h/10),
    w:w/10,
    h:h/10,
    vy:0,
    vx:0,
    draw() {
        ctx.drawImage(image[3],this.x, this.y, this.w, this.h);
    },
    reset(w,h){
        this.x = w/2 - (w/10)/2;
        this.y = h - (h/10);
        this.w = w/10;
        this.h = h/10;
    }
};

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
                startGame();
            }
        }, false);
        image[i].src = images[i];
    }
})();

let startGame = () => {

    //ctx.drawImage(image[3], 500, 500);
    raf = window.requestAnimationFrame(gameLoop);

}

let gameLoop = () =>{
    //console.table({w,h,c2w});
    ctx.clearRect(0, 0, w, h);
    // catch new window dimensions and reset screen and ship size
    ship.reset(w,h);
    //call ship object here
    ship.draw();
    window.requestAnimationFrame(gameLoop)
}

/*class Player {
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
}*/

