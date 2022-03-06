let canvas      = document.getElementById("board");
let canvasCtx   = canvas.getContext("2d");
canvas.width    = canvas.height = 300;

function generateRandom(max, min = 1){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let pointCount  = generateRandom(5,25);
let pointRadius = 5; 
let points      = [];
let sPointInd   = -1; // starting point (index)
let sPointX     = canvas.width + 1; // starting point X value (axis coordinate)
let tempPoint   = -1;
let prevIndex   = 0;

function findNextPoint(){
    let center = {x: points[sPointInd].x, y: points[sPointInd].y};
    if(tempPoint!=-1)
        center = tempPoint;
    let q = points[prevIndex];
    
    for(let axs = 0; axs < points.length; axs++){
        if(points[axs].x != q.x){
            let area = (points[axs].x - center.x) * (q.y - center.y) - (points[axs].y - center.y) * (q.x - center.x);
            if(area > 0){ // counter clock
                q = points[axs];
            }
        }
    }
        canvasCtx.lineWidth = 1;
        canvasCtx.beginPath();
        canvasCtx.moveTo(center.x, center.y);
        canvasCtx.lineTo(q.x, q.y);
        canvasCtx.stroke();
        tempPoint = q;
        prevIndex++;
        if(prevIndex <= points.length)
            findNextPoint();
}

for(let i = 0; i < pointCount; i++){
    let point = {
                x: generateRandom(canvas.width-pointRadius, pointRadius),
                y: generateRandom(canvas.height-pointRadius, pointRadius)
                };
    points.push(point);
    if(point.x < sPointX){  // we comparing the points to find the leftmost point
        sPointInd   = i;
        sPointX     = point.x;
    }
    canvasCtx.beginPath();
    canvasCtx.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI);
    canvasCtx.arc(point.x, point.y, pointRadius / 8, 0, 2 * Math.PI);
    canvasCtx.lineWidh = 1;
    canvasCtx.strokeStyle = "#000";
    canvasCtx.stroke();
}
findNextPoint();