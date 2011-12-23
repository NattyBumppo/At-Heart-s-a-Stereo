var alpha = 255;
var level = 0;
var testSign = 1;


// Config values
var boxWidth = 44;
var boxHeight = 8;
var numBars = 10;
var maxBoxes = 20;
var spaceBetweenBoxes = 2;
var spaceBetweenBars = 4;  
var timeStep = 16;
var backgroundColor = "#000000";
var centerColor = "#444444";
var centerHeight = 30;
var centerHorizontalMargin = 20;


function initDraw()
{
    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d");

    return setInterval(process, timeStep);
}

function process()
{

    var barNo = 0;
    var maxLevel = 1000;

    draw(numBars, barNo, maxLevel);

}

function draw(numBars, barNo, maxLevel)
{
    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d")

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw bars
    for(barNo = 0; barNo < numBars; barNo++)
    {
        // level += 10 * testSign;
        // if (level > maxLevel){ testSign *= -1; }

        // if (level < 0){ testSign *= -1; }


        level += 3 * testSign;
        // If the level is beyond the maximum level, and positive,
        // make it start going start
        if (level > maxLevel)
        {
            testSign = -1;
        }

        // If the level is beyond the maximum level, and negative,
        // make it start going up
        if (level < maxLevel * (-1))
        {
            testSign = 1;
        }

        drawBar(barNo, level, maxLevel, maxBoxes);
        // testSign *= -1;
    }

    // Draw center
    var centerPos = canvas.height / 2;
    var centerWidth = boxWidth * numBars + spaceBetweenBars * (numBars - 1) + centerHorizontalMargin * 2;

    context.fillStyle = centerColor;
    context.fillRect(0, centerPos - centerHeight / 2, centerWidth, centerHeight);

}

// Maps level to a box level, and draws it
function drawBar(barNo, level, maxLevel, maxBoxes)
{
    // alert("barNo, level, sign, maxLevel, maxBoxes: " + barNo + " " + level + " " + sign + " " + maxLevel + " " + maxBoxes);

    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d")

    boxesToLight = maxBoxes * (level / maxLevel);
    // In case boxesToLight was multiplied by a negative level, reset to positive
    if (boxesToLight < 0)
    {
        boxesToLight *= -1;
    }

    // alert (boxesToLight);

    var boxNo;

    for(boxNo = 0; boxNo < boxesToLight; boxNo++)
    {
        x = centerHorizontalMargin + (boxWidth + spaceBetweenBars) * barNo;


        var centerPos = canvas.height / 2;
        if(level > 0)
        {
            // alert("positive");
            // Draw from the center up
            y = centerPos - (boxHeight + spaceBetweenBoxes) - (centerHeight / 2 + (boxHeight + spaceBetweenBoxes) * boxNo);
        }
        else
        {
            // alert("negative");
            // Draw from the center down
            y = centerPos + spaceBetweenBoxes + (centerHeight / 2 + (boxHeight + spaceBetweenBoxes) * boxNo);
        }
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
