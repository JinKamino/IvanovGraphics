const imageInput = document.getElementById('imageInput');
var imageCanvas = document.getElementById('imageCanvas');
var imageCtx = imageCanvas.getContext("2d");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var isDrawingEnabled = false;
var button1 = document.getElementById("button1");
var button2 = document.getElementById("button2");
var button3 = document.getElementById("button3");
var button4 = document.getElementById("button4");
var button5 = document.getElementById("button5");
var colorInput = document.getElementById("fillColor");
var colorInputBorder = document.getElementById("borderColor");
imageInput.addEventListener('change', handleImageUpload);

function handleImageUpload(event) 
{
    const file = event.target.files[0];
    if (file) 
    {
        const reader = new FileReader();
        reader.onload = function (e) 
        {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () 
            {
                imageCanvas.width = img.width;
                imageCanvas.height = img.height;
                imageCtx.drawImage(img, 0, 0);
            };
        };

        reader.readAsDataURL(file);
    }
}

canvas.addEventListener("mousedown", draw2);
canvas.addEventListener("mouseup", disableDrawing);
canvas.addEventListener("mousemove", draw);
var flag = 0;

function draw2(event) 
{
    if (flag === 1) 
    {
        enableDrawing(event);
    }
    else if (flag === 2) 
    {
        floodFill(ctx.getImageData(0, 0, canvas.width, canvas.height), event.offsetX, event.offsetY, getPixelColor(ctx.getImageData(0, 0, canvas.width, canvas.height), event.offsetX, event.offsetY));
        return;
    }
    else if (flag === 3) 
    {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        startFindBoundary(imageData, event.offsetX, event.offsetY, hex_to_rgba(colorInputBorder.value), `rgba(0, 255, 0, 255)`);
        ctx.putImageData(imageData, 0, 0);
        return;
    }
    else if (flag === 5) 
    {
        floodFillIMG(ctx.getImageData(0, 0, canvas.width, canvas.height), event.offsetX, event.offsetY, getPixelColor(ctx.getImageData(0, 0, canvas.width, canvas.height), event.offsetX, event.offsetY), imageCtx.getImageData(0, 0, imageCanvas.width, imageCanvas.height));
        return;
    }
}

function enableDrawing(event) 
{
    isDrawingEnabled = true;
    draw(event);
}

function disableDrawing() 
{
    isDrawingEnabled = false;
}

function draw(event) 
{
    if (!isDrawingEnabled || flag != 1) 
    {
        return;
    }
    const x = event.offsetX;
    const y = event.offsetY;
    ctx.fillStyle = colorInputBorder.value;
    ctx.fillRect(x, y, 8, 8);
}

button1.onclick = function () 
{
    if (flag !== 1) 
    {
        flag = 1;
        button1.style.backgroundColor = "grey";
        button2.style.backgroundColor = "white";
        button3.style.backgroundColor = "white";
        button5.style.backgroundColor = "white";
    }
    else 
    {
        flag = 0;
        button1.style.backgroundColor = "white";
    }
}

button2.onclick = function () 
{
    if (flag !== 2) 
    {
        flag = 2;
        button1.style.backgroundColor = "white";
        button2.style.backgroundColor = "grey";
        button3.style.backgroundColor = "white";
        button5.style.backgroundColor = "white";
    }
    else 
    {
        flag = 0;
        button2.style.backgroundColor = "white";
    }
}

button3.onclick = function () {
    if (flag !== 3) 
    {
        flag = 3;
        button1.style.backgroundColor = "white";
        button2.style.backgroundColor = "white";
        button3.style.backgroundColor = "grey";
        button5.style.backgroundColor = "white";
    }
    else 
    {
        flag = 0;
        button3.style.backgroundColor = "white";
    }
}

button4.onclick = function () 
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

button5.onclick = function () 
{
    if (flag !== 5)
    {
        flag = 5;
        button1.style.backgroundColor = "white";
        button2.style.backgroundColor = "white";
        button3.style.backgroundColor = "white";
        button5.style.backgroundColor = "grey";
    }
    else 
    {
        flag = 0;
        button5.style.backgroundColor = "white";
    }
}

function getPixelColor(imageData, x, y) 
{
    const index = (y * imageData.width + x) * 4;
    return `rgba(${imageData.data[index]}, ${imageData.data[index + 1]}, ${imageData.data[index + 2]}, ${imageData.data[index + 3]})`;
}

function setPixelColor(imageData, x, y, color) 
{
    const index = (y * imageData.width + x) * 4;
    const rgba = color.match(/\d+/g);
    imageData.data[index] = rgba[0];
    imageData.data[index + 1] = rgba[1];
    imageData.data[index + 2] = rgba[2];
    imageData.data[index + 3] = rgba[3];
}

function hex_to_rgba(hex_color) 
{
    hex_color = hex_color.replace("#", "");
    var r = parseInt(hex_color.substring(0, 2), 16);
    var g = parseInt(hex_color.substring(2, 4), 16);
    var b = parseInt(hex_color.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${255})`;
}

const set = [];

function floodFillLine(imageData, x, y, boundaryColor) 
{
    let left = x, right = x;
    while (right + 1 < imageData.width && getPixelColor(imageData, right + 1, y) === boundaryColor) 
    {
        ++right;
    }
    while (left > 0 && getPixelColor(imageData, left - 1, y) === boundaryColor) 
    {
        --left;
    }
    for (let i = left; i <= right; ++i) 
    {
        setPixelColor(imageData, i, y, hex_to_rgba(colorInput.value));
    }
    for (let i = left; i <= right; ++i) 
    {
        if (y + 1 < imageData.height && getPixelColor(imageData, i, y + 1) === boundaryColor) 
        {
            floodFillLine(imageData, i, y + 1, boundaryColor);
        }
        if (y > 0 && getPixelColor(imageData, i, y - 1) === boundaryColor) 
        {
            floodFillLine(imageData, i, y - 1, boundaryColor);
        }
    }
}

function floodFill(imageData, startX, startY, boundaryColor) 
{
    floodFillLine(imageData, startX, startY, boundaryColor);
    ctx.putImageData(imageData, 0, 0);
    set.length = 0;
}

function containsObject(obj, list) 
{
    var i;
    for (i = 0; i < list.length; i++) 
    {
        if (list[i][0] === obj[0] && list[i][1] === obj[1]) 
        {
            return true;
        }
    }

    return false;
}

function neighborsBoundaries(imageData, x, y, boundaryColor) 
{
    const neighbors = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
        [x - 1, y - 1],
        [x - 1, y + 1],
        [x + 1, y + 1],
        [x + 1, y - 1],
    ];
    for (const [nx, ny] of neighbors) 
    {
        if (getPixelColor(imageData, nx, ny) === boundaryColor) 
        {
            return true;
        }
    }
    return false;
}

function startFindBoundary(imageData, startX, startY, boundaryColor, fillColor) 
{
    let currentX = startX;
    while (getPixelColor(imageData, currentX, startY) != boundaryColor) 
    {
        currentX++;
    }
    findBoundary(imageData, currentX - 1, startY, boundaryColor, fillColor)
}

function findBoundary(imageData, startX, startY, boundaryColor, fillColor) 
{
    const boundaryPixels = [];
    const visited = [];
    const stack = [];
    stack.push([startX, startY]);
    visited.push([startX, startY]);
    boundaryPixels.push([startY, startX]);
    while (stack.length) 
    {
        const [x, y] = stack.pop();

        const neighbors = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
            [x - 1, y - 1],
            [x - 1, y + 1],
            [x + 1, y + 1],
            [x + 1, y - 1],
        ];
        for (const [nx, ny] of neighbors) 
        {

            if (!containsObject([nx, ny], visited)) 
            {
                if (getPixelColor(imageData, nx, ny) !== boundaryColor) 
                {
                    if (neighborsBoundaries(imageData, nx, ny, boundaryColor)) 
                    {
                        stack.push([nx, ny]);
                        boundaryPixels.push([ny, nx]);
                    }
                }
                visited.push([nx, ny]);
            }
        }
    }
    for (const [ny, nx] of boundaryPixels) 
    {
        setPixelColor(imageData, nx, ny, fillColor);
    }
    boundaryPixels.sort();
    var i;
    for (i = 0; i < boundaryPixels.length - 1; i++) 
    {
        if (boundaryPixels[i][0] === boundaryPixels[i + 1][0]) 
        {
            let left = boundaryPixels[i][1] + 1, right = boundaryPixels[i + 1][1];
            while (getPixelColor(imageData, left, boundaryPixels[i][0]) !== boundaryColor && left != right && getPixelColor(imageData, left, boundaryPixels[i][0]) !== fillColor) 
            {
                left++;
            }
            if (getPixelColor(imageData, left, boundaryPixels[i][0]) === boundaryColor) 
            {
                findBoundary1(imageData, left - 1, boundaryPixels[i][0], boundaryColor, fillColor);
            }
        }
    }

    return boundaryPixels;
}

function findBoundary1(imageData, startX, startY, boundaryColor, fillColor) 
{
    const boundaryPixels = [];
    const visited = [];
    const stack = [];
    stack.push([startX, startY]);
    visited.push([startX, startY]);
    boundaryPixels.push([startY, startX]);
    while (stack.length) 
    {
        const [x, y] = stack.pop();
        const neighbors = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
            [x - 1, y - 1],
            [x - 1, y + 1],
            [x + 1, y + 1],
            [x + 1, y - 1],
        ];
        for (const [nx, ny] of neighbors) 
        {
            if (!containsObject([nx, ny], visited)) 
            {
                if (getPixelColor(imageData, nx, ny) !== boundaryColor) 
                {
                    if (neighborsBoundaries(imageData, nx, ny, boundaryColor)) 
                    {
                        stack.push([nx, ny]);
                        boundaryPixels.push([ny, nx]);
                    }
                }
                visited.push([nx, ny]);
            }
        }
    }

    for (const [ny, nx] of boundaryPixels) 
    {
        setPixelColor(imageData, nx, ny, fillColor);
    }

    return boundaryPixels;
}

function floodFillIMG(canvasData, startX, startY, boundaryColor, imageData) 
{
    floodFillLineIMG(canvasData, startX, startY, startX, startY, boundaryColor, imageData);
    ctx.putImageData(canvasData, 0, 0);
    set.length = 0;
}

function floodFillLineIMG(canvasData, x, y, startX, startY, boundaryColor, imageData) 
{
    for (let i = 0; i < set.length; i++) 
    {
        const pair = set[i];
        if (pair[0] === x && pair[1] === y) 
        {
            return;
        }
    }
    let currentX = x;
    while (getPixelColor(canvasData, currentX, y) === boundaryColor && currentX < canvasData.width) 
    {
        set.push([currentX, y]);
        const xx = ((currentX - startX) % imageData.width + imageData.width) % imageData.width;
        const yy = ((y - startY) % imageData.height + imageData.height) % imageData.height;
        const index = (yy * imageData.width + xx) * 4;
        const color = `rgba(${imageData.data[index]}, ${imageData.data[index + 1]}, ${imageData.data[index + 2]}, ${imageData.data[index + 3]})`;
        setPixelColor(canvasData, currentX, y, color);
        currentX++;
    }
    let right = currentX - 1;
    currentX = x - 1;
    while (getPixelColor(canvasData, currentX, y) === boundaryColor && currentX >= 0) 
    {
        set.push([currentX, y]);
        const xx = ((currentX - startX) % imageData.width + imageData.width) % imageData.width;
        const yy = ((y - startY) % imageData.height + imageData.height) % imageData.height;
        const index = (yy * imageData.width + xx) * 4;
        const color = `rgba(${imageData.data[index]}, ${imageData.data[index + 1]}, ${imageData.data[index + 2]}, ${imageData.data[index + 3]})`;
        setPixelColor(canvasData, currentX, y, color);
        currentX--;
    }
    let left = currentX + 1;
    currentX = left;
    while (currentX !== right + 1) 
    {
        if (getPixelColor(canvasData, currentX, y + 1) === boundaryColor && y + 1 < canvasData.height) 
        {
            let flag1 = false;
            for (let i = 0; i < set.length; i++) 
            {
                const pair = set[i];
                if (pair[0] === currentX && pair[1] === y + 1) 
                {
                    flag1 = true;
                }
            }
            if (flag1 === false) 
            {
                floodFillLineIMG(canvasData, currentX, y + 1, startX, startY, boundaryColor, imageData);
            }
        }
        currentX++;
    }
    currentX = left;
    while (currentX !== right + 1) 
    {
        if (getPixelColor(canvasData, currentX, y - 1) === boundaryColor && y - 1 >= 0) 
        {
            let flag1 = false;
            for (let i = 0; i < set.length; i++) 
            {
                const pair = set[i];
                if (pair[0] === currentX && pair[1] === y - 1) 
                {
                    flag1 = true;
                }
            }
            if (flag1 === false) 
            {
                floodFillLineIMG(canvasData, currentX, y - 1, startX, startY, boundaryColor, imageData);
            }
        }
        currentX++;
    }
}