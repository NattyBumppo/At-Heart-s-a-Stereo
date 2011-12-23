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
var barLabelColor = "#FFFFFF";
var barLabelFont = "16px sans-serif";
var barLabelShadowOffsetX = 1;
var barLabelShadowOffsetY = 1;
var barLabelShadowBlur = 4;
var barLabelShadowColor = "#000000";
var centerHeight = 30;
var centerLeftHorizontalMargin = 60;
var centerRightHorizontalMargin = 20;


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

    drawBars(numBars, maxLevel);

    drawCenter();

    drawText();
}

function drawBars(numBars, maxLevel)
{

    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d")

    var barNo;
    for(barNo = 0; barNo < numBars; barNo++)
    {

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
    }
}


// Maps level to a box level, and draws it
function drawBar(barNo, level, maxLevel, maxBoxes)
{
    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d");

    boxesToLight = maxBoxes * (level / maxLevel);
    // In case boxesToLight was multiplied by a negative level, reset to positive
    if (boxesToLight < 0)
    {
        boxesToLight *= -1;
    }

    var boxNo;

    for(boxNo = 0; boxNo < boxesToLight; boxNo++)
    {
        x = centerLeftHorizontalMargin + (boxWidth + spaceBetweenBars) * barNo;


        var centerPos = canvas.height / 2;
        if(level > 0)
        {
            // Draw from the center up
            y = centerPos - (boxHeight + spaceBetweenBoxes) - (centerHeight / 2 + (boxHeight + spaceBetweenBoxes) * boxNo);
        }
        else
        {
            // Draw from the center down
            y = centerPos + spaceBetweenBoxes + (centerHeight / 2 + (boxHeight + spaceBetweenBoxes) * boxNo);
        }
        context.fillStyle = getBoxColor(boxNo, maxBoxes);
        context.fillRect(x, y, boxWidth, boxHeight);
    }
}

function drawCenter()
{
    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d");

    var centerPos = canvas.height / 2;
    var centerWidth = boxWidth * numBars + spaceBetweenBars * (numBars - 1) + centerLeftHorizontalMargin + centerRightHorizontalMargin;

    context.fillStyle = centerColor;
    context.fillRect(0, centerPos - centerHeight / 2, centerWidth, centerHeight);

}

// Draws all of the on-screen text for the application
function drawText()
{
    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d");
    
    // Draw bar labels
    var centerPos = canvas.height / 2;
    var centerWidth = boxWidth * numBars + spaceBetweenBars * (numBars - 1) + centerLeftHorizontalMargin + centerRightHorizontalMargin;

    context.fillStyle = barLabelColor;    
    context.font = barLabelFont;
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    context.shadowOffsetX = barLabelShadowOffsetX;
    context.shadowOffsetY = barLabelShadowOffsetY;
    context.shadowBlur = barLabelShadowBlur;
    context.shadowColor = barLabelShadowColor;

    var barNo;
    for(barNo = 0; barNo < numBars; barNo++)
    {
        // Adding 0.5 to the position allows the text to be properly centered
        var x = centerLeftHorizontalMargin + (boxWidth + spaceBetweenBars) * (barNo + 0.5);
        var y = centerPos;
        context.fillText("testing", x, y, boxWidth);
    }

    // Reset shadows
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 0;
    context.shadowColor = "#000000";
        

}

// Return a color corresponding to how high the bar is
// (colors cycle from green to red)
function getBoxColor(boxNo, maxBoxes)
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
