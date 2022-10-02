let canvas      = document.getElementById("board");
let canvasCtx   = canvas.getContext("2d");
canvas.width    = 1024;
canvas.height   = 640;

canvasCtx.globalCompositeOperation='destination-over';

let pointCount  = 25,
    points      = Array(),
    pointsLen   = 0;

let maxRelation = Math.floor(Math.sqrt(pointCount)); // the square root of the total number of points will be connected (at most)

function gRand(max, min = 1){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function dist(x1,y1,x2,y2){
    return Math.floor(Math.sqrt((x2 - x1) ** 2 + (y2-y1) ** 2));
}

function hexC(){
    return '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
}

function start(){
    while(pointCount--){
        let pointX  = gRand(canvas.width - 10, 10),
            pointY  = gRand(canvas.height - 10, 10),
            hexCl   = hexC();
        canvasCtx.beginPath();
        canvasCtx.arc(pointX, pointY, 20, 0, 2 * Math.PI, false);
        canvasCtx.strokeStyle   = "#000";
        canvasCtx.fillStyle     = "#000 ";
        canvasCtx.fillText(pointCount, pointX, pointY+2.5);
        canvasCtx.textBaseline = 'middle';
        canvasCtx.textAlign = 'center';
        canvasCtx.font = "16px Arial";
        canvasCtx.stroke();
        canvasCtx.fillStyle     = hexCl;
        canvasCtx.fill();
        

        points.push({
            "id": pointCount,
            "c": hexCl,
            "x": pointX,
            "y": pointY,
            "relations": ""
        });
    }
    pointsLen = points.length;
    generic();
}

function generic(){
    points.reverse();
    for(let i = 0; i < points.length; i++){
        let dR = []; // temp array for keeping dists
        let jC = gRand(maxRelation, 1); // max relationship between two points
        for(let j = 0; j < points.length; j++){
            if(points[j].id!=points[i].id){
                let o = {
                    "id": points[j].id,
                    "dist": dist(points[i].x, points[i].y, points[j].x, points[j].y)
                };
                dR.push(o);
            }
        }
        dR.sort((a, b) => a.dist - b.dist);
        while(jC--)
            points[i].relations += dR[jC].id+",";
        let jRL = (points[i].relations).split(","); // point relations (received after dist calculation)
        for(let k = 0; k < jRL.length - 1; k++){
            let devX = gRand(12,-12);
            let devY = gRand(12,-12);
            // when drawing the lines i have to add the deviation, lines overlap if deviation is not added
            canvasCtx.beginPath();
            canvasCtx.moveTo(points[i].x, points[i].y);
            canvasCtx.lineTo(points[jRL[k]].x + devX , points[jRL[k]].y + devY);
            canvasCtx.lineWidth = 3;
            canvasCtx.strokeStyle = points[i].c;
            canvasCtx.stroke();
        }
    }
    path();
}

function finder(from, end, poll, used = [], chain = []){
    if(used.length == 0)
        used.push(end);
    let sub = poll.filter(function(el){
        return el.relations.includes(end) && !used.includes(el.id);
    });
    for(let k = 0; k < sub.length; k++)
        if(!used.includes(sub[k].id))
            used.push(sub[k].id);
    for(let i = 0; i < sub.length; i++){
        if(sub[i].id != from){
            chain.push(end);
            return finder(from, sub[i].id, poll, used, chain);
        }else{
            chain.push(end);
            return chain.reverse();
        }
    }
    
}

function path(){
    for(let i = 1; i < points.length; i++){
        let chain   = finder(0, i, points);
        console.log("Path: ["+i+"] way is:"+chain);
    }
}

start();
