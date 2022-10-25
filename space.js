//create array for ships
const images = [
    "assets/enemyships/enemy.png",
    "assets/enemyships/enemy2.png",
    "assets/enemyships/enemy3.png",
    "assets/ship.png"
];
let image = [];
let raf;
let move = {};
let c2w = canvas2.width
let start, previousTimeStamp;
let star_particles= [];
let enemyShips = [];
let starShips = [];
let _particles = [];
let timer = 0;
let lastTime = (new Date()).getTime();
//let starShipCollide=false;
const particles_num = 100;
let star_damage = false;
let star_explode = false;
let ship;
let finish = false;
let oldWH = [];

function Base_Con(x, y, dx, dy){
    //base props
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
}

//Ship Constructor
function Ship(x, y, dx, dy, imageNumber){
    Base_Con.call(this, x, y, dx, dy);
    //global props
    this.w = W/10;
    this.h = H/10;

    this.explode=false;
    this.lives = 2;

    this.dim={
        _dimShip: false,
        _dimLen: 45,
        _dimCount: 0
    };

    this._particles = [];

    this.imageNumber = imageNumber;

    this.particle={
        _y:0,
        _x:0,
    }

    this.positions=[];
    //console.log('df',typeof this._particles);
    this.ypositions=[{a:1}];
}
//INHERIT
StarShip.prototype = Object.create(Ship.prototype);
StarShip.prototype.constructor = StarShip;
EnemyShip.prototype = Object.create(Ship.prototype);
EnemyShip.prototype.constructor = EnemyShip;
/*
Object.setPrototypeOf(StarShip.prototype,Ship.prototype );
Object.setPrototypeOf(EnemyShip.prototype,Ship.prototype );
*/
//Object.setPrototypeOf(Particles_Con.prototype,Ship.prototype );
Ship.prototype.update = function(){
    if (this.constructor.name !== 'EnemyShip') {
        if (this.r){
            this.x += this.dx;
        } else if(this.l) {
            this.x += -this.dx;
        }
        if (this.s){
            this.fireLazor();
        }
    }
    else{
        this.x += this.dx;
        this.y += this.dy;
    }
}
Ship.prototype.draw = function(){
    let b = this.constructor.name
    this.draw = ()=>{
        if(this.explode){
            this.explosion(this.x,this.y);
        }
        else if(this.dim._dimShip){
            this.dimmer(this.x,this.y);
        }
        else {
            //trail effect
            ctx.drawImage(
                image[this.imageNumber],
                this.x,
                this.y,
                this.w,
                this.h)
            ;
            if (b !== 'EnemyShip') {
                this.trail();
            }
            else{
                if(timer%5 === 0 && this.y < H/2) {
                    this.es = true
                    //console.log('EVERY5');
                }
                if(this.es) {
                    this.fireLazor(this.y);
                }
            }

        }
        if (b === 'EnemyShip') {
            this.shipCollide();
            this.shootStarShip();
            this.shotByStarShip();
        }
        this.update();
        this.bounds();
        this.storeLast(this.x, this.y);
    };
}
Ship.prototype.bounds = function(){
    if (this.constructor.name === 'EnemyShip') {
        this.bounds=()=>{
            if(this.x<0 || this.x>W-(W/10)){
                this.dx = -this.dx
            }

            if(this.y<0 || this.y>H-(H/10)){
                this.dy = -this.dy;
            }
        }
    }
    else{
        //stay in bounds to the left of screen
        if(this.x < 0){
            this.x = 0;
        }
        //stay in bounds to the right of screen
        if(this.x > W-(W/10)){
            this.x = W-(W/10);
        }
    }
}
Ship.prototype.shipLives = function(){
        this.lives -= 1;
}
Ship.prototype.dimmer = function(xd,yd){
/*    if (this.constructor.name === 'EnemyShip') {
        this.es = false;
    }*/
    let ran = Math.random() < 0.5 ? this.w : 1;
    //ctx.globalAlpha = ran;
    ctx.drawImage(
        image[this.imageNumber],
        xd,
        yd,
        this.w/ran,
        this.h/ran
    );

    //dim count
    this.dim._dimCount++
    if (this.dim._dimCount === this.dim._dimLen){
        this.shipLives();
        this.dim._dimShip = false;
        this.dim._dimCount = 0;
        if(this.lives <= 0){
            this.explode = true;
        }
    }
}
Ship.prototype.explosion = function(x,y){
/*    if (this.constructor.name === 'EnemyShip') {
        this.es = false;
    }*/
    if (this._particles.length === 0) {
        for (let i = 0; i < particles_num; i++) {
            let xn = x + this.w / 2;
            let yn = y + (this.h / 2);
            let num0 = Math.floor(Math.random() * 15) + 1;
            let num = Math.floor(Math.random() * 15) + 1;
            let num2 = (Math.round(Math.random()) ? 1 : -1) * num0;
            let num3 = (Math.round(Math.random()) ? 1 : -1) * num;
            let dx = num2;
            let dy = num3;
            let rad = Math.random() * 3;
            let r = Math.round(Math.random()) * 255;
            let g = Math.round(Math.random()) * 255;
            let b = Math.round(Math.random()) * 255;
            let ran = Math.round(Math.random()) + 1;
            let width = this.w;
            let color = `rgba(${r},${g},${b},${ran})`;
            let p = this.particle;

            let particle = new Particles_Con(
                xn, yn, dx, dy, rad, width, color, p
            );
            this._particles.push(particle);
        }
    }
    //TODO SET PARTICLES FOR SMALLER SCREEN
    if (this._particles.length > 1) {
        //console.log('m',b)
        this._particles.forEach((particle) =>{
            particle.draw();
            if (
                particle._x > (particle.width)*2
                || particle._x < (particle.width)*-2
            )
            {
                this._particles.length = 0;
                this.explode = false;
                if (this.constructor.name === 'EnemyShip') {
                    enemyShips.splice(
                        enemyShips.indexOf(this),
                        1
                    );
                }
            }
        });
    }
}
Ship.prototype.storeLast = function(x,y){
        // push an item
        this.positions.push({
            x: x,
            y: y
        });

        //get rid of first item
        if (this.positions.length > this.trailLen){
            this.positions.shift();
        }
}

Ship.prototype.reset = function(W,H){
    if(this.positions.length > 0 && oldWH.length > 1) {
        this.x = (oldWH[1].W / oldWH[0].W) * this.positions[0].x;
        this.y = (oldWH[1].H / oldWH[0].H) * this.positions[0].y;
        this.w = W / 10;
        this.h = H / 10;
    }
}

//StarShip object
function StarShip(x, y, dx, dy, imageNumber){
    Ship.call(this, x, y, dx, dy, imageNumber);

    //star ship
    this.lazor = {
        x: W / 2 + ((W / 1000)),
        y: H - ((H / 10) * 2),
        w: W / 1000,
        h: (H / 10)
    };

    this.trailLen = 6;
    this.r = false;
    this.l = false;
    this.s = false;
    //all ships methods
    this.fireLazor = ()=>{
        ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
        if(this.lazor.y > (-1 * this.lazor.h * 2)){
            this.lazor.x = this.x + (W/10)/2;
            ctx.fillRect(
                this.lazor.x,
                this.lazor.y,
                this.lazor.w,
                this.lazor.h
            );
            this.lazor.y -= this.lazor.h;
        }
        else{
            this.s = false;
            this.lazor.y = H - ((H/10)*2);
        }
    };
    /*this.dimmer = (xd,yd)=>{}//in ship.draw();*/
    //Star Ship methods
    this.trail = ()=>{
        for (let i = 0; i < this.positions.length; i++) {
            ctx.globalAlpha = (i + 1) / this.positions.length;
            ctx.drawImage(
                image[this.imageNumber],
                this.positions[i].x,
                this.positions[i].y,
                this.w,
                this.h
            );
        }
    };
    this.keydown = (key)=>{
        if (key === "ArrowRight") {
            this.r = true;
        }
        if (key === "ArrowLeft") {
            this.l = true;
        }
        if (key === " ") {
            this.s = true;
        }
    };
    this.keyup = (key)=>{
        if (key === "ArrowRight") {
            this.r = false;
        }
        if (key === "ArrowLeft") {
            this.l = false;
        }
    };
}

//init
(function() {
    oldWH.push({W:W,H:H})
    console.log('push',oldWH);
    let imagesLoaded = 0;

    for(let i =0; i < images.length; i++){
        image[i] = new Image();
        image[i].addEventListener('load', () => {
            // execute drawImage statements here
            //ctx.drawImage(image, 500, 500);
            imagesLoaded++;
            if(imagesLoaded === images.length){
                startGame();
            }
        }, false);
        image[i].src = images[i];
    }

    const x = W / 2 - ((W / 10) / 2);
    const y = H - (H / 10);
    const dx = (W / 10) / 7.5;
    const dy = 0;
    const imageNumber = 3;
    const _starShip = new StarShip(x,y,dx,dy,imageNumber);
    starShips.push(_starShip);

    ship = starShips[0];

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
})();

let startGame = () => {

    //ctx.drawImage(image[3], 500, 500);
    raf = window.requestAnimationFrame(gameLoop);

}

function Particles_Con(x, y, dx, dy, rad, width, color, p) {
    Base_Con.call(this, x, y, dx, dy);
    this._x = p._x;
    this._y = p._y;
    this.width = width;

    this.draw = function (){

        ctx.fillStyle = color;
        ctx.fillRect(
            this.x + this._x,
            this.y + this._y,
            this.width/50,
            this.width/50
        );
        this.update();
    };
    this.update = function (b){
            this._x += dx;
            this._y += dy;
    }
}

//EnemyShip object
function EnemyShip(x, y, dx, dy, imageNumber){
    Ship.call(this, x, y, dx, dy, imageNumber);

    //enemy ships
    this.eLazor={
        _y:0,
        x:x,
        y:y,
        w:W/500,
        h:(H/20)
    };
    this.lastWH = [];
    this.trailLen = 1;
    this.es = true;
    //all ships methods

    this.fireLazor=(ys)=>{

        ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
        this.eLazor.x = this.x + this.w / 2;

        ctx.fillRect(
            this.eLazor.x,
            ys+(this.eLazor.h*2)+this.eLazor._y,
            this.eLazor.w * 2,
            this.eLazor.h
        );

        this.eLazor._y += this.eLazor.h;
        if(this.eLazor._y >= H){
            this.es = false;
            this.eLazor._y = 0;
        }
    }

    //strictly enemy ships

    this.shipCollide=()=>{
        // collide with star ship
        if(
            (
                this.x >= (ship.x - ship.w)
                && this.x <= (ship.x + ship.w)
            )
            && (this.y >= ship.y)
        ){
            this.dim._dimShip = true;
            //starShipCollide = true;
            ship.dim._dimShip = true;
        }
    }
    this.shootStarShip=()=>{
        // shoot star ship
        if(
            (
                this.eLazor.x >= (ship.x)
                && this.eLazor.x <= (ship.x + ship.w)
            )
            && (this.eLazor._y >= ship.y)
        ){
            //starShipCollide = true;
            ship.dim._dimShip = true;
        }
    }
    this.shotByStarShip=()=>{
        //shot by star Ship
        if(
            ship.s
            && ship.lazor.x >= this.x
            && ship.lazor.x <= (this.x + this.w)
            && (ship.lazor.y <= this.y)
        ){
            //console.log('KILL',ship.lazor.x, this.x );
            this.dim._dimShip = true;
        }
    }

}

/*this.reset = (W,H)=>{
    this.x = 500;
    this.y = 300;
    this.w = W / 10;
    this.h = H / 10;
    reset = false;
};*/

let gameLoop = (timestamp) =>{
    let start = performance.now();
    //clear canvas
    ctx.clearRect(0, 0, W, H);
    //console.log('ts',timestamp);

    //move ship here
    //ship.update();

    //set boundaries here
    //ship.bounds();

    //trail effect
    //ship.trail();

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
            let x = Math.floor(Math.random() * W);

            //good
            if(x > W-(W/10)){
                x =   W-(W/10);
            }
            //good
            else if(x < (W/10)){
                x = 0
            }
            let y = Math.floor(Math.random() * H);
            if(y > H-(H/5)){
                y =  H - ((H/5));
            }
            //good
            else if(y < (H/10)){
                y = 0
            }
            let eachShip = new EnemyShip(
                //set random values here
                200,
                150,
                10,
                2,
                Math.floor(Math.random() * 2) + 1
            );

            enemyShips.push(eachShip);
            //console.log('timerEneny',timer,enemyShips);
        }
    }
    console.log('loopshipr',reSet);
    // check if window resize here
    if(enemyShips.length > 0) {
        if (reSet === true) {

            oldWH.push({W:W,H:H});

            if (oldWH.length > 2){
                oldWH.shift();
            }

            console.log('push2',oldWH);

            ship.reset(W,H);
            enemyShips.forEach((eachShip, index, arr) => {
                eachShip.reset(W, H);
                if (index === arr.length - 1) {
                    reSet = false;
                }
            });
        }
        else {
            //draw ship object here
            ship.draw();
            //loop through each enemy ship here
            enemyShips.forEach((eachShip, index) => {
                eachShip.draw();
                //console.log('forEach',index);
            });
        }
    }

    let end = performance.now();

    //console.log('performance',end-start);
    // call animation again
    window.requestAnimationFrame(gameLoop);
}
