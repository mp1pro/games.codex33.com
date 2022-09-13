//create array for ships
const images = ["assets/enemyships/enemy.png","assets/enemyships/enemy2.png","assets/enemyships/enemy3.png","assets/ship.png"];
let image = [];
let raf;
let move = {};
let c2w = canvas2.width
let start, previousTimeStamp;

const ship = {
    x:w/2 - (w/10)/2,
    y:h - (h/10),
    w:w/10,
    h:h/10,
    vy:0,
    vx:0,
    r:false,
    l:false,
    s:false,
    xMove: (w/10) + (w/10)/2,
    yMove: (h/10),
    velocity:(w/10)/7.5,
    update(){
        //console.log('keypress',this.r,'position',this.x,'velocity',this.velocity);
        if (this.r) {
            this.x += this.velocity;
            //console.log('trigger here','v',this.velocity);
        } else if (this.l) {
            this.x += -this.velocity;
        }
    },
    bounds(){
        //console.log('bounds',this.x,'w',w-(w/10));
        //stay in bounds to the left of screen
        if(this.x < 0){
            this.x = 0;
        }
        //stay in bounds to the right of screen
        if(this.x > w-(w/10)){
            this.x = w-(w/10);
        }
    },
    draw() {
        ctx.drawImage(image[3],this.x, this.y, this.w, this.h);
    },
    reset(w,h) {
        this.x = w / 2 - (w / 10) / 2;
        this.y = h - (h / 10);
        this.w = w / 10;
        this.h = h / 10;
        console.log('reset2/////////////////////////////////////////////////',reset);
        reset =false;
    },
    keydown(event){
        if (event.key === "ArrowRight") {
            this.r = true;
        }
        if (event.key === "ArrowLeft") {
            this.l = true;
        }
        if (event.key === "Space") {
            this.s = true;
        }
    },
    keyup(event){
        if (event.key === "ArrowRight") {
            this.r = false;
        }
        if (event.key === "ArrowLeft") {
            this.l = false;
        }
        if (event.key === "Space") {
            this.s = false;
        }
    }
};

(function() {
    let imagesLoaded = 0;
    window.addEventListener('keydown', (e)=>{
        let key = e.key;
        if(key === "ArrowRight" || key === "ArrowLeft" || key === "Space") {
            e.preventDefault();
        }
        ship.keydown(e);

    });
    document.addEventListener('keyup', (e)=>{
        ship.keyup(e);
    });
    for(let i =0; i < images.length; i++){
        image[i] = new Image();
        image[i].addEventListener('load', () => {
            // execute drawImage statements here
            //ctx.drawImage(image, 500, 500);
            imagesLoaded++;
            if(imagesLoaded === images.length){
                //console.log('we can start',imagesLoaded,images.length);
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

let gameLoop = (timestamp) =>{
    //clear canvas
    ctx.clearRect(0, 0, w, h);

    //move ship here
    ship.update();

    //set boundaries here
    ship.bounds();



    // check if window resize here
    if(reset === true){
        ship.reset(w,h);
    }

    //draw ship object here
    ship.draw();

    //console.log('x',ship.x)
    // call animation again
    window.requestAnimationFrame(gameLoop);
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

