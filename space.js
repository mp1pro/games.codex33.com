//create array for ships
const images = ["assets/enemyships/enemy.png","assets/enemyships/enemy2.png","assets/enemyships/enemy3.png","assets/ship.png"];
let image = [];
let raf;
let move = {};
let c2w = canvas2.width
let start, previousTimeStamp;

const ship = {
    x:w/2 - ((w/10)/2),
    y:h - (h/10),
    w:w/10,
    h:h/10,
    vy:0,
    vx:0,
    r:false,
    l:false,
    s:false,
    shoot:true,
    xMove: (w/10) + (w/10)/2,
    yMove: (h/10),
    velocity:(w/10)/7.5,
    lazor:{
        x:w/2 + ((w/1000)),
        y:h - ((h/10)*2),
        w:w/1000,
        h:(h/10)
    },
    draw() {
        ctx.drawImage(image[3],this.x, this.y, this.w, this.h);
    },
    fireLazor(){
        ctx.fillStyle = "#FF0000";
        if(this.lazor.y > (-1 * this.lazor.h)){
            this.lazor.x = this.x + (w/10)/2;
            ctx.fillRect(this.lazor.x, this.lazor.y, this.lazor.w, this.lazor.h);
            this.lazor.y -= this.lazor.h;
        }
        else{
            this.s = false;
            this.lazor.y = h - ((h/10)*2);
        }
    },
    update(){
        if (this.r) {
            this.x += this.velocity;
        } else if (this.l) {
            this.x += -this.velocity;
        }
        if (this.s) {
            this.fireLazor();
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

    reset(w,h) {
        this.x = w / 2 - (w / 10) / 2;
        this.y = h - (h / 10);
        this.w = w / 10;
        this.h = h / 10;
        reset =false;
    },
    keydown(key){
        if (key === "ArrowRight") {
            this.r = true;
        }
        if (key === "ArrowLeft") {
            this.l = true;
        }
        if (key === " ") {
            this.s = true;
        }
    },
    keyup(key){
        if (key === "ArrowRight") {
            this.r = false;
        }
        if (key === "ArrowLeft") {
            this.l = false;
        }
    }
};

(function() {
    let imagesLoaded = 0;
    window.addEventListener('keydown', (e)=>{
        let key = e.key;
        if(key === "ArrowRight" || key === "ArrowLeft" || key === " ") {
            e.preventDefault();
        }
        ship.keydown(key);

    });
    document.addEventListener('keyup', (e)=>{
        let key = e.key;
        ship.keyup(key);
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

