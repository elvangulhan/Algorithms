let canvas      = document.getElementById("board");
let canvasCtx   = canvas.getContext("2d");
/*
    max dot count, must be perfect square and its perfect square must be an odd number
    Eg:
        9, 25, 49, 81, 121, 169, 225, 289 ... (n^2) mod 2 == 1 
*/
let maxNumberCount = 225; 
let dotSize = 40; // width & height ~ x & y 

canvas.width = canvas.height = Math.sqrt(maxNumberCount * dotSize * dotSize);

let x = canvas.width / 2, 
    y = canvas.height / 2;

let stepCounter     = 1,
    stepTurn        = 1,
    stepDirection   = 0 // 0 = right, 1 = up, 2 = left, 3 = down

function drawDot(x, y, tx, color = "#fff", color2 = "#000"){
    let dotX = x-dotSize/2,
        dotY = y-dotSize/2;

    canvasCtx.beginPath();
    canvasCtx.fillStyle = color;
    canvasCtx.fillRect(dotX,dotY,dotSize-1,dotSize-1);
    canvasCtx.fillStyle = color2;
    canvasCtx.fillText(tx,dotX+dotSize/2-4.5,dotY+dotSize/2+4.5);
    canvasCtx.stroke();
}

function isPrimaryNum(num){
    for(let i = 2, n = Math.sqrt(num); i <= n; i++)
        if(num % i == 0) return false;
    return num > 1;
}

for(let dot = 1; dot <= maxNumberCount; dot++){

    if(isPrimaryNum(dot))
        drawDot(x,y,dot,"#e74c3c");
        else
        drawDot(x,y,dot,"#fff");

    switch(stepDirection){
        case 0: x+=dotSize; break;
        case 1: y-=dotSize; break;
        case 2: x-=dotSize; break;
        case 3: y+=dotSize; break;
    }

    if(dot%stepCounter==0){
        (++stepTurn%2==0) ? stepCounter++ : false;
        stepDirection = (stepDirection + 1) % 4;
    }
    
}