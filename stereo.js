var alpha = 255;
var level = 0;
var testSign = 1;


// Config values
var boxWidth = 44;
var boxHeight = 8;
var spaceBetweenBoxes = 2;
var spaceBetweenBars = 4;  
var timeStep = 64;
var backgroundColor = "#000000"; 

function initDraw()
{
    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d");

    var i;
    for(i = 0; i < 20; i++)
    {
        // alert(i + " of " + 20 + ": " + getColor(i, 20));
    }

    return setInterval(process, timeStep);
}

function process()
{
    /*
    // Create an imagedata object in order to do
    // individual pixel manipulation on the canvas
    var imageData = context.createImageData(canvas.width, canvas.height);
    var x = 0, y = 0;

    for(y = 0; y < canvas.height; y++)
    {
        for(x = 0; x < canvas.width; x++)
        {
            // Set pixel colors
            imageData.data[(y * canvas.width + x) * 4] = red;
            imageData.data[(y * canvas.width + x) * 4 + 1] = green;
            imageData.data[(y * canvas.width + x) * 4 + 2] = blue;
            imageData.data[(y * canvas.width + x) * 4 + 3] = alpha;

            // Change pixel colors
            red += 1;
            green += 3;
            blue--;
            if (red > 255){ red = 0; }
            if (green > 255){ green = 0; }
            if (blue < 0){ blue = 255; }
        }
    }
    context.putImageData(imageData, 0, 0);

    */

    var numBars = 10;

    var barNo = 0;
    var maxLevel = 1000;


    level += 5 * testSign;
    if (level > maxLevel){ testSign *= -1; }

    if (level < 0){ testSign *= -1; }

    draw(numBars, barNo, maxLevel);

}

function draw(numBars, barNo, maxLevel)
{
    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d")

    context.clearRect(0, 0, canvas.width, canvas.height);
    for(barNo = 0; barNo < numBars; barNo++)
    {
        level += 10 * testSign;
        if (level > maxLevel){ testSign *= -1; }

        if (level < 0){ testSign *= -1; }

        drawBar(barNo, level, true, maxLevel, 20);
    }

}

// Maps level to a box level, and draws it
function drawBar(barNo, level, sign, maxLevel, maxBoxes)
{
    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d")

    boxesToLight = maxBoxes * (level / maxLevel);
    // alert (boxesToLight);

    var boxNo;

    for(boxNo = 0; boxNo < boxesToLight; boxNo++)
    {
        x = 45 + (boxWidth + spaceBetweenBars) * barNo;
        y = canvas.height - (45 + (boxHeight + spaceBetweenBoxes) * boxNo);
        // alert("Drawing at x: " + x + " and y: " + y + " and boxNo: " + boxNo);
        context.fillStyle = getColor(boxNo, maxBoxes);
        context.fillRect(x, y, boxWidth, boxHeight);
    }
}

// Return a color corresponding to how high the bar is
// (colors cycle from green to red)
function getColor(boxNo, maxBoxes)
{
    // Colors go from green (#00FF00)
    // to yellow (#FFFF00) to red (#FF0000)

    if ((boxNo / maxBoxes) < 0.5)
    {
        red = 255 * ((boxNo / maxBoxes) * 2.0);
        red = Math.floor(red);
    }
    else
    {
        red = 255;
    }
    // alert("Red: " + red);

    var green;
    if ((boxNo / maxBoxes) < 0.5)
    {
        green = 255;
    }
    else
    {
        green = 255 - 255 * ((boxNo * 2 - maxBoxes) / (maxBoxes));
        green = Math.floor(green);
    }
    var blue = 0;

    // Return a combined string of the hex versions of each color (padded to 2 chars each)
    colorString = ( "0" + red.toString(16)).slice(-2) + ( "0" + green.toString(16)).slice(-2) + ( "0" + blue.toString(16)).slice(-2);

    return colorString;

}
