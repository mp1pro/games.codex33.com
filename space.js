//create array for ships
const images = ["assets/enemyships/enemy.png","assets/enemyships/enemy2.png","assets/enemyships/enemy3.png","assets/ship.png"];
let image = [];
let raf;
let move = {};
let c2w = canvas2.width
let start, previousTimeStamp;
let positions=[];
let star_particles= [];
let enemyShips = [];
let _particles = [];
let timer = 0;
let lastTime = (new Date()).getTime();
let starShipCollide=false;
const particles_num = 100;
let damage = false;
let star_damage = false;
let explode = false;
let star_explode = false;


const ship = {
    x: w / 2 - ((w / 10) / 2),
    y: h - (h / 10),
    w: w / 10,
    h: h / 10,
    vy: 0,
    vx: 0,
    r: false,
    l: false,
    s: false,
    shoot: true,
    lives: 1,
    xMove: (w / 10) + (w / 10) / 2,
    yMove: (h / 10),
    velocity: (w / 10) / 7.5,
    lazor: {
        x: w / 2 + ((w / 1000)),
        y: h - ((h / 10) * 2),
        w: w / 1000,
        h: (h / 10)
    },
    trailLen: 6,
    dimShip: false,
    dimLen: 60,
    dimCount: 0,
    particle:{
        _y:0,
        _x:0,
    },
    explosion(x, y) {
        if (star_particles.length === 0) {
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
                star_particles.push(particle);
            }
        }

        if (star_particles.length > 1) {

            //turn off lazer here
            star_damage = true
            starShipCollide = false;
            let b = 'star';
            star_particles.forEach(function (particle) {
                particle.draw(b);
            });
        }
    },
    shipLives(){
        if(starShipCollide){
            this.lives -= 1;
        }
    },
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
        if(star_explode && !starShipCollide){
            this.explosion(this.x,this.y);
        }
        else if(starShipCollide){
            let ran = Math.random() < 0.5 ? this.width : 1;
            //ctx.globalAlpha = ran;
            ctx.drawImage(image[3],this.x, this.y, this.w/ran, this.h/ran);

            //dim count
            this.dimCount++;

            if (this.dimCount === this.dimLen) {
                if(this.lives <= 0){
                    star_explode = true;
                }
                this.shipLives();
                starShipCollide = false;
                this.dimCount = 0;
            }
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
        if(this.lazor.y > (-1 * this.lazor.h * 2)){
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

function Particles_Con(x, y, dx, dy, rad, width, color, p) {
    this.x = x;
    this.y = y;
    this._x = p._x;
    this._y = p._y;
    this.width = width;

    this.draw = function (b){
        //console.log('b',this.x)
        ctx.fillStyle = color;
        ctx.fillRect(this.x + this._x, this.y + this._y,this.width/50,this.width/50);
        this.update(b);
    };
    this.update = function (b){
            this._x += dx;
            this._y += dy;

        if (this._x > (this.width)*2 || this._x < (this.width)*-2){
            if (b ==='star') {
                star_particles.length = 0;
                star_damage = false;
                star_explode = false;
            }
            else{
                enemyShips.splice(enemyShips.indexOf(this), 1);
                explode = false;
                damage = false;
                _particles.length = 0;
            }
        }
    }
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
        this.lives = 1;
        this.damage = false;
        this.eLazor={
            _y:0,
            x:x,
            y:y,
            w:w/500,
            h:(h/20)
        };
        this.dim={
            _dimShip: false,
            _dimLen: 60,
            _dimCount: 0
        };
        this.particle={
            _y:0,
            _x:0,
        }
    }
    shipLives(){
        if(this.dim._dimShip){
            this.lives -= 1;
        }
    }
    explosion(x,y) {
        if (_particles.length === 0) {
            for (let i = 0; i < particles_num; i++) {
                let xn = x + this.width/2
                let yn = y + (this.height/2)
                let num0 = Math.floor(Math.random()*15) + 1;
                let num = Math.floor(Math.random()*15) + 1;
                let num2 = (Math.round(Math.random()) ? 1 : -1)*num0;
                let num3 = (Math.round(Math.random()) ? 1 : -1)*num;
                let dx = num2;
                let dy = num3;
                let rad = Math.random() * 3;
                let r = Math.round(Math.random()) * 255;
                let g = Math.round(Math.random()) * 255;
                let b = Math.round(Math.random()) * 255;
                let ran = Math.round(Math.random()) + 1;
                let width = this.width;
                let color = `rgba(${r},${g},${b},${ran})`;
                let p = this.particle;

                let particle = new Particles_Con(
                    xn, yn, dx, dy, rad, width, color, p
                );
                _particles.push(particle);
            }
        }

        if (_particles.length > 1){
            //console.log('he',_particles);
            //turn off lazer here
            this.damage = true
            starShipCollide = false;
            let b ='enemy'
            _particles.forEach(function (particle){
                particle.draw(b);

            });
        }
    }
    draw(){

        if(explode){
            this.explosion(this.x,this.y);
        }
        else if(this.dim._dimShip){
            this.dimmer(this.x,this.y);
        }
        else{
            ctx.drawImage(image[this.imageNumber], this.x, this.y, this.width, this.height);
        }

        this.move();
        this.bounds();
        this.shipCollide();
        this.shootStarShip();
        this.shotByStarShip();

        if(timer%5 === 0 && this.y < h/2){
            this._shootShip = true
            //console.log('EVERY5');
        }

        if(this._shootShip && !this.damage) {
            this.shootLazor(this.y);
        }
    }
    dimmer(xd,yd){
        let ran = Math.random() < 0.5 ? this.width : 1;
        ctx.drawImage(image[this.imageNumber],xd, yd, (this.width)/ran, (this.height)/ran);

        //dim count
        this.dim._dimCount++;

        if (this.dim._dimCount === this.dim._dimLen) {
            //console.log('lives', this.lives);
            if(this.lives <= 0){
                explode = true;
            }

            this.shipLives();
            this.dim._dimShip = false;
            this.dim._dimCount = 0;
        }
    }
    shootLazor(ys){

            ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
            this.eLazor.x = this.x + this.width / 2;

            ctx.fillRect(this.eLazor.x, ys+(this.eLazor.h*2)+this.eLazor._y, this.eLazor.w * 2, this.eLazor.h);

            this.eLazor._y += this.eLazor.h;
            if(this.eLazor._y >= h){
                this._shootShip = false;
                this.eLazor._y = 0;
            }
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
        }
    }
    shootStarShip(){
        // shoot star ship
        if((this.eLazor.x >= (ship.x) && this.eLazor.x <= (ship.x + ship.w)) && (this.eLazor._y >= ship.y)){
            starShipCollide = true;
        }
    }
    shotByStarShip(){
        //shot by star Ship
        if(ship.s && ship.lazor.x >= this.x && ship.lazor.x <= (this.x + this.width) && (ship.lazor.y <= this.y)){
            //console.log('KILL',ship.lazor.x, this.x );
            this.dim._dimShip = true;
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
        if(timer%2 === 0 && enemyShips.length < 1){
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
                500,
                300,
                0,
                0,
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
