const canvas = document.getElementById("bg");
const c = canvas.getContext("2d");

const setCanvasExtents = () => {
    w = document.body.clientWidth;
    h = document.body.clientHeight;
    canvas.width = w;
    canvas.height = h;
    //duplicate assignment for testing
    window.width=w;
    window.height=h;

};

setCanvasExtents();

window.addEventListener('resize', function(event){
    setCanvasExtents();
});


