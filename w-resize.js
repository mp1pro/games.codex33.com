
canvas = document.getElementById("bg");
canvas2 = document.getElementById("space");

const loady = ()=>{
    W = document.body.clientWidth;
    H = document.body.clientHeight;

    canvas.width = W;
    canvas.height = H;

    canvas2.width = W;
    canvas2.height = H;
}

const setCanvasLoad = () => {
    loady();
    c = canvas.getContext("2d");
    ctx = canvas2.getContext("2d");
    reSet = false;
};

const setCanvasResize = () => {
    loady();
    reSet = true;
};

setCanvasLoad();

window.addEventListener('resize', () => {
    setCanvasResize();
});


