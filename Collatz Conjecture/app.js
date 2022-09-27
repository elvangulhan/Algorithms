let canvas      = document.getElementById("board");
let canvasCtx   = canvas.getContext("2d");
canvas.width    = 1024;
canvas.height   = 640;

let lineCount   = 10;

function rand(max, min = 1){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let lines   = [];

while(lineCount--){
    let peaks   = [];
    peaks[0]    = rand(20);
    while(peaks[peaks.length-1]!=1){
        if(peaks[peaks.length-1]%2==0)
            peaks.push(peaks[peaks.length-1]/2);
        else
            peaks.push(peaks[peaks.length-1]*3+1);
    }
    lines.push(peaks);
}

let mY = 0; 
let mX = lines[0].length;

for(let i = 1; i < lines.length; i++){
    if(lines[i].length > mX)
        mX = lines[i].length;
    let tM = Math.max(...lines[i]);
    if(mY < tM)
        mY = tM;
}

let lastPos = {x: 0, y: 0};

for(let i = 0; i < lines.length; i++){
    let lineColor = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    for(let j = 0; j < lines[i].length; j++){

        let posX = 0 + 25 + (j * canvas.width / mX);
        let posY = canvas.height - (25 + ((canvas.height-50) / mY) * lines[i][j]);
        canvasCtx.fillStyle = lineColor;
        canvasCtx.beginPath();
        canvasCtx.arc(posX,posY,3,0,2 * Math.PI);
        canvasCtx.fill();
        if(j!=0){
            canvasCtx.moveTo(lastPos.x, lastPos.y);
            canvasCtx.lineTo(posX, posY);
            canvasCtx.strokeStyle = lineColor;
            canvasCtx.stroke();
        }
        lastPos.x = posX;
        lastPos.y = posY;
    }
}
