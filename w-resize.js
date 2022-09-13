
canvas = document.getElementById("bg");
canvas2 = document.getElementById("space");

const setCanvasExtents = () => {
    w = document.body.clientWidth;
    h = document.body.clientHeight;

    canvas.width = w;
    canvas.height = h;

    canvas2.width = w;
    canvas2.height = h;

    //duplicate assignment for testing
    window.width=w;
    window.height=h;

    c = canvas.getContext("2d");
    ctx = canvas2.getContext("2d");
    reset = true;
};

setCanvasExtents();

window.addEventListener('resize', function(event){
    setCanvasExtents();
});


