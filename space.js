//create array for ships
const images = ["assets/enemyships/enemy.png","assets/enemyships/enemy2.png","assets/enemyships/enemy3.png","assets/ship.png"];
let image = [];
let raf;
let move = {};
let c2w = canvas2.width
let start, previousTimeStamp;
let positions=[];
let enemyShips = [];
let timer = 0;
let lastTime = (new Date()).getTime();
let starShipCollide=false;

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
    trailLen:6,
    dimShip:false,
    dimLen: 30,
    dimCount: 0,
    trail(){
        for (let i = 0; i < positions.length; i++) {
            ctx.globalAlpha = (i + 1) / positions.length;
            ctx.drawImage(image[3],positions[i].x, positions[i].y, this.w, this.h);
        }
    },
    storeLast(x,y){
        // push an item
        positions.push({
            x: x,
            y: y
        });

        //get rid of first item
        if (positions.length > this.trailLen) {
            positions.shift();
        }
    },
    draw() {

        if(starShipCollide){
            let ran = (Math.floor(Math.random() * 10)) * 0.1;
            ctx.globalAlpha = ran;
            ctx.drawImage(image[3],this.x, this.y, this.w, this.h);

            //dim count
            this.dimCount++;

            if (this.dimCount === this.dimLen) {
                starShipCollide = false;
                this.dimCount = 0;
            }
            //console.log('starship',starShipCollide);
        }
        else {
            //trail effect
            ctx.drawImage(image[3],this.x, this.y, this.w, this.h);
            this.trail();
        }
        this.storeLast(this.x, this.y);

    },
    fireLazor(){
        ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
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

//enemyShip object
class EnemyShip{
    constructor(x, y, dx, dy, imageNumber) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.width = w/10;
        this.height = h/10;
        this.imageNumber = imageNumber;
        this._shootShip = true;
        this._shootLen = 60;
        this._shootCount = 0;
        this.eLazor={
            _y:0,
            x:x,
            y:y,
            w:w/500,
            h:(h/20)
        };
        this.dim={
            _dimShip: false,
            _dimLen: 30,
            _dimCount: 0
        }
    }
    draw(){
        if(this.dim._dimShip){
            this.dimmer(this.x,this.y);
        }else{
            ctx.drawImage(image[this.imageNumber], this.x, this.y, this.width, this.height);
        }

        this.move();
        this.bounds();
        this.shipCollide();

        if(timer%5 === 0 && this.y < h/2){
            this._shootShip = true
            //console.log('EVERY5');
            //
        }
        //console.log('SHOOT',this._shootShip);

        if(this._shootShip) {
            this.shootLazor(this.y);
        }
    }
    dimmer(xd,yd){
        let ran = (Math.floor(Math.random() * 10)) * 0.1;
        ctx.globalAlpha = ran;
        ctx.drawImage(image[this.imageNumber],xd, yd, this.width, this.height);

        //dim count
        this.dim._dimCount++;

        if (this.dim._dimCount === this.dim._dimLen) {
            this.dim._dimShip = false;
            this.dim._dimCount = 0;

        }
    }
    shootLazor(ys) {
            //console.log('here',ys);

            ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
            this.eLazor.x = this.x + this.width / 2;
            // if(this.eLazor._y)
            //this.eLazor._y = ys + (this.eLazor.h * 2);
            ctx.fillRect(this.eLazor.x, ys+(this.eLazor.h*2)+this.eLazor._y, this.eLazor.w * 2, this.eLazor.h);

            this.eLazor._y += this.eLazor.h;
            if(this.eLazor._y >= h){
                this._shootShip = false;
                this.eLazor._y = 0;
                //this.eLazor.x = this.x + this.width / 2;
            }
        /*              if (this.eLazor.y <= h) {
                          this.eLazor.x = this.x + this.width / 2;
                          //this.eLazor.y = this.y + (this.eLazor.h * 2);
                          ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
                          ctx.fillRect(this.eLazor.x, this.eLazor.y, this.eLazor.w * 2, this.eLazor.h);
                          this.eLazor.y += this.eLazor.h;
                      } else {
                          this._shootShip = false;
                          this.eLazor.x = this.x + this.width / 2;
                      }*/

/*        if(this._shootShip) {
            console.log('here',this.eLazor.y);
            this.eLazor.y = this.y + (this.eLazor.h * 2);
            if (this.eLazor.y <= h) {
                this.eLazor.x = this.x + this.width / 2;

                ctx.fillRect(this.eLazor.x, this.eLazor.y, this.eLazor.w * 2, this.eLazor.h);
                this.eLazor.y += 10;
            } else {
                this._shootShip = false;
                this.eLazor.y = this.y + (this.eLazor.h * 2);
            }
        }*/
    }
    move(){
        this.x += this.dx;
        this.y += this.dy;
    }
    bounds(){
        if(this.x<0 || this.x>w-(w/10)){
            this.dx = -this.dx
        }

        if(this.y<0 || this.y>h-(h/10)){
            this.dy = -this.dy;
        }
    }
    shipCollide(){
        // collide with star ship
        if((this.x >= (ship.x - ship.w) && this.x <= (ship.x + ship.w)) && (this.y >= ship.y)){

            this.dim._dimShip = true;
            starShipCollide = true;
            // ship.dimShip = true;
            //console.log('here',this.x,ship._dim.dimShip);
            console.log('timerEneny',timer,enemyShips)

        }
    }
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

    //trail effect
    //ship.trail();

    //draw ship object here
    ship.draw();

    //timer
    let currentTime = (new Date()).getTime();

    if (currentTime - lastTime >= 1000) {

        //console.log("Last Time: " + lastTime);
        //console.log("Current Time: " + currentTime);

        lastTime = currentTime;
        timer++;
        // call the function that uses timer here
        //console.log('timer',timer);
        // noinspection DuplicatedCode
        if(timer%2 === 0 && enemyShips.length < 3){
            let x = Math.floor(Math.random() * w);

            //good
            if(x > w-(w/10)){
                x =   w-(w/10);
            }
            //good
            else if(x < (w/10)){
                x = 0
            }
            let y = Math.floor(Math.random() * h);
            if(y > h-(h/5)){
                y =  h - ((h/5));
            }
            //good
            else if(y < (h/10)){
                y = 0
            }
            let eachShip = new EnemyShip(
                //set random values here
                x,
                y,
                3,
                9,
                Math.floor(Math.random() * 2) + 1
            );

            enemyShips.push(eachShip);
            //console.log('timerEneny',timer,enemyShips);
        }

    }

    //loop through each enemy ship here
    enemyShips.forEach(function(eachShip){
        eachShip.draw();

    })

    // call animation again
    window.requestAnimationFrame(gameLoop);
}
