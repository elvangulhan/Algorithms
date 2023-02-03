let messages = {
    "error_0" : "something went wrong, please try again",
    "error_1" : "extension not supported, please try again"
}

let canvas              = document.getElementById("board");
let canvasCtx           = canvas.getContext("2d");
let hough               = document.getElementById("hough");
let houghCtx            = hough.getContext("2d");
let imgFile             = null,
    imgExt              = null,
    iW                  = 0,
    iH                  = 0;
let allowedExtensions   = ["jpeg","png"];

function getPx(data){
    return function(pX ,pY){
        return data[((iW * pY) + pX) * 4];
    };
}

function setGrayScale(tData){
    let imgData     = tData;
    let imgPixels   = imgData.data;
        for(let i = 0; i < imgPixels.length; i += 4){
            let avg = (imgPixels[i+1] + imgPixels[i+2] + imgPixels[i+3]) / 3;
            imgPixels[i]    = avg; 
            imgPixels[i+1]  = avg; 
            imgPixels[i+2]  = avg; 
            imgPixels[i+3]  = 255;
        }
    return imgData;
}

function setSobel(tData){
    let imgData = [], 
        kernelX = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ],
        kernelY = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
    ],
    pixels  = getPx(tData.data);
    for(let y = 0; y < iH; y++){
        for(let x = 0; x < iW; x++){
            let pX = 0, pY = 0;
            for(let k = 0; k < 3; k++)
                for(let j = 0; j < 3; j++)
                {
                    pX += kernelX[k][j] * pixels(x + (j-1), y + (k-1));
                    pY += kernelY[k][j] * pixels(x + (j-1), y + (k-1));
                }
            let mag = Math.sqrt(pX**2 + pY**2);
            imgData.push(mag, mag, mag, 255);
        }
    }
    imgData = new ImageData(new Uint8ClampedArray(imgData), iW, iH);
    return imgData;
}

function drawHoughSpace(tIndex, rH){
    houghCtx.beginPath();
    houghCtx.fillStyle = 'rgba(0,0,0,.01)';;
    houghCtx.fillRect(tIndex, rH, 1, 1);
    houghCtx.closePath();
}

function setHoughSpace(tData){
    let _iW         = iW,
        _iH         = iH;
    let nAC         = 180; // number of angles cells (maybe i should use 180 or 360 i will try this)
    let rHMax       = Math.sqrt(_iW * _iW + _iH * _iH);
    let acm         = new Array(nAC);

    hough.width     = nAC;
    hough.height    = rHMax;

    let cosT = new Array(nAC), // i'm using cos & sin table for more performance
        sinT = new Array(nAC);

    for(let theta = 0, tIndex = 0; tIndex < nAC; theta += Math.PI / nAC, tIndex++){
        cosT[tIndex] = Math.cos(theta);
        sinT[tIndex] = Math.sin(theta);
    }

    let rH; 
    let tIndex = 0;
    let pixels = getPx(tData.data);

    for(let x = 0; x < _iW; x++){
        for(let y = 0; y < _iH; y++){
            if(pixels(x, y) > 225){
                let _x = x,
                    _y = y;
                _x -= _iW / 2;
                _y -= _iH / 2;
                for(tIndex = 0; tIndex < nAC; tIndex++){
                    rH = rHMax + _x * cosT[tIndex] + _y * sinT[tIndex]; // roots
                    rH >>=1;
                    if(acm[tIndex] == undefined) acm[tIndex] = [];
                    if(acm[tIndex][rH] == undefined)
                        acm[tIndex][rH] = 1;
                    else
                        acm[tIndex][rH]++;
                    drawHoughSpace(tIndex, rH);
                }
            }
        }
    }
}

function ReadIMG(imgData){
    imgFile = imgData.files[0];
    if(imgFile){
        imgExt = (imgFile.type).split("/")[1]; // uploaded img extension
        if(allowedExtensions.includes(imgExt)){
            let reader = new FileReader();
            reader.readAsDataURL(imgFile);
            reader.onload = function(){
                let tempImage = new Image();
                tempImage.src = reader.result;
                tempImage.onload = function(){
                    iW = canvas.width   = this.width;
                    iH = canvas.height  = this.height;
                    canvasCtx.drawImage(tempImage, 0, 0, iW, iH);
                    let grayScale = setGrayScale(canvasCtx.getImageData(0, 0, iW, iH));
                    let sobelFilter = setSobel(grayScale);
                    setHoughSpace(canvasCtx.getImageData(0,0,iW,iH));
                    canvasCtx.putImageData(sobelFilter,0 ,0)
                }
            }
        }else{
            alert(messages["error_1"]);
        }
    }else{
        alert(messages["error_0"]);
    }
}