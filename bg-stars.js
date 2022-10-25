console.log('W',W)
console.log('H',H)

const makeStars = count => {
    const out = [];
    for (let i = 0; i < count; i++) {
        const s = {
            x: Math.random() * 1600 - 800,
            y: Math.random() * 900 - 450,
            z: Math.random() * 1000
        };
        out.push(s);
    }
    return out;
};

let stars = makeStars(10000);

const clear = () => {
    c.fillStyle = "black";
    c.fillRect(0, 0, W, H);
};

const putPixel = (x, y, brightness) => {
    const intensity = brightness * 255;
    const rgb = "rgb(" + intensity + "," + intensity + "," + intensity + ")";
    c.fillStyle = rgb;
    c.fillRect(x, y, 2, 2);
};

const moveStars = distance => {
    const count = stars.length;
    for (let i = 0; i < count; i++) {
        const s = stars[i];
        s.z -= distance;
        while (s.z <= 1) {
            s.z += 1000;
        }
    }
};

let prevTime;
const init = time => {
    prevTime = time;
    requestAnimationFrame(tick);
};

const tick = time => {
/*    console.log('W',W);
    console.log('H',H);
    console.log('w1',window.width);
    console.log('h1',window.height);*/
    let elapsed = time - prevTime;
    prevTime = time;

    moveStars(elapsed * 0.1);

    clear();

    const cx = W / 2;
    const cy = H / 2;

    const count = stars.length;
    for (let i = 0; i < count; i++) {
        const star = stars[i];

        const x = cx + star.x / (star.z * 0.001);
        const y = cy + star.y / (star.z * 0.001);

        if (x < 0 || x >= W || y < 0 || y >= H) {
            continue;
        }

        const d = star.z / 1000.0;
        const b = 1 - d * d * d;

        putPixel(x, y, b);
    }

    requestAnimationFrame(tick);
};

requestAnimationFrame(init);

//reference
//https://codesandbox.io/s/lucid-fast-0v7ch?from-embed=&file=/index.html:653-2326
//https://betterprogramming.pub/fun-with-html-canvas-lets-create-a-star-field-a46b0fed5002
