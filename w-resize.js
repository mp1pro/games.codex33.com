
canvas = document.getElementById("bg");
canvas2 = document.getElementById("space");

const setCanvasExtents = () => {
    W = document.body.clientWidth;
    H = document.body.clientHeight;

    canvas.width = W;
    canvas.height = H;

    canvas2.width = W;
    canvas2.height = H;

    //duplicate assignment for testing
    window.width=W;
    window.height=H;

    c = canvas.getContext("2d");
    ctx = canvas2.getContext("2d");
    reset = true;
};

setCanvasExtents();

window.addEventListener('resize', function(event){
    setCanvasExtents();
});


