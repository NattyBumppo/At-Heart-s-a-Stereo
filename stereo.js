var canvas;
var context;
var timeout;


// var alpha = 255;
var level = 0;
var testSign = 1;
var isPlaying = false;
var testDataLabels = new Array("Macedonia", "Malta", "Moldova", "Monaco", "Spain", "Holland", "Norway", "Poland", "Portugal", "Romania");
var testData =
    [   [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10],
        [10, 10, 9, 9, 8, 8, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1],
        [-20, -18, -16, -14, -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
        [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        [20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 0, -2, -4, -6, -8, -10, -12, -14, -16, -18],
        [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6, -7, -8],
        [0, 1, 2, 3, 2, 1, 0, -1, -2, -3, -2, -1, 0, 1, 2, 3, 2, 1, 0, -1],
        [-20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1]
    ];

var testDataTimes = new Array("1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989");
var dataIterator;

// Config values
var boxWidth = 50;
var boxHeight = 6;
var numBars = 10;
var maxBoxes = 24;
var spaceBetweenBoxes = 2;
var spaceBetweenBars = 2;  
var timeStep = 0;

var backgroundColor = "#111111";
var centerColor = "#444444";
var barLabelColor = "#FFFFFF";
var barLabelFont = "12px sans-serif";
var barLabelShadowOffsetX = 1;
var barLabelShadowOffsetY = 1;
var barLabelShadowBlur = 1;
var barLabelShadowColor = "#000000";
var buttonOutlineColor = "#FFFFFF";
var buttonInsideColor = "#999999";
var buttonOutlineThickness = 1;
var centerHeight = 30;
var centerLeftHorizontalMargin = 64;
var centerRightHorizontalMargin = 20;

var leftBarOffset = 0;
var leftBarWidth = 54;
var leftBarColor = "#333333";
var leftBarHeight = maxBoxes * (boxHeight + spaceBetweenBoxes) + 20;

var bottomBarOffset = 0;
var bottomBarWidth = 640;
var bottomBarColor = "#444444";
var bottomBarHeight = 30;

playButton = new Object();
stopButton = new Object();
timeButton = new Object();
previousButton = new Object();
currentButton = new Object();
nextButton = new Object();

playButton.scale = 0.5;
stopButton.scale = 0.5;
timeButton.scale = 0.5;
playButton.offset = leftBarWidth + 4;
stopButton.offset = -5;

timeButton.offset = -10;
timeButton.verticalMargin = 4;

previousButton.offset = 5;
previousButton.scale = 1.6;
previousButton.verticalMargin = 4;
previousButton.color = new Array(192, 192, 192, 0.6);

currentButton.offset = 5;
currentButton.scale = 1.6;
currentButton.verticalMargin = 4;
currentButton.color = new Array(40, 40, 40, 1.0);

nextButton.offset = 5;
nextButton.scale = 1.6;
nextButton.verticalMargin = 4;
nextButton.color = new Array(192, 192, 192, 0.6);


// Initializes the play/pause button
playButton.init = function()
{
    var bottomBarPos = canvas.height - bottomBarHeight / 2;

    playButton.width = bottomBarHeight;
    playButton.centerX = playButton.offset + (playButton.width / 2);
    playButton.centerY = bottomBarPos;
    
    playButton.rectangle = new Array(playButton.centerX - (playButton.width / 2) * playButton.scale, playButton.centerY - (playButton.width / 2) * playButton.scale, playButton.width * playButton.scale, playButton.width * playButton.scale);
}

// Draws the play/pause button
playButton.draw = function()
{
    context.strokeStyle = buttonOutlineColor;
    context.fillStyle = buttonInsideColor;
    context.lineWidth = buttonOutlineThickness;

    if(!isPlaying)
    {
        // Draw Play Button
        context.beginPath();
        context.moveTo(playButton.rectangle[0], playButton.rectangle[1]);
        context.lineTo(playButton.rectangle[0] + playButton.rectangle[2], playButton.rectangle[1] + playButton.rectangle[3] / 2)
        context.lineTo(playButton.rectangle[0], playButton.rectangle[1] + playButton.rectangle[3]);
        context.lineTo(playButton.rectangle[0], playButton.rectangle[1]);

        context.fill();
        context.stroke();
        context.closePath();
    }
    else
    {
        // Draw Pause Button
        context.fillRect(playButton.rectangle[0], playButton.rectangle[1], playButton.rectangle[2] / 2 - 4, playButton.rectangle[3]);
        context.strokeRect(playButton.rectangle[0], playButton.rectangle[1], playButton.rectangle[2] / 2 - 4, playButton.rectangle[3]);

        context.fillRect(playButton.rectangle[0] + playButton.rectangle[2] / 2 + 4, playButton.rectangle[1], playButton.rectangle[2] / 2 - 4, playButton.rectangle[3]);
        context.strokeRect(playButton.rectangle[0] + playButton.rectangle[2] / 2 + 4, playButton.rectangle[1], playButton.rectangle[2] / 2 - 4, playButton.rectangle[3]);
    }
}

// Draws the stop button
stopButton.draw = function()
{
    // Draw Stop Button
    context.beginPath();
    context.moveTo(stopButton.rectangle[0], stopButton.rectangle[1]);
    context.lineTo(stopButton.rectangle[0] + stopButton.rectangle[2], stopButton.rectangle[1]);
    context.lineTo(stopButton.rectangle[0] + stopButton.rectangle[2], stopButton.rectangle[1] + stopButton.rectangle[3]);
    context.lineTo(stopButton.rectangle[0], stopButton.rectangle[1] + stopButton.rectangle[3]);
    context.lineTo(stopButton.rectangle[0], stopButton.rectangle[1]);

    context.fill();
    context.stroke();
    context.closePath();
}

// Initializes the stop button
stopButton.init = function()
{
    var bottomBarPos = canvas.height - bottomBarHeight / 2;

    stopButton.width = bottomBarHeight;
    stopButton.centerX = playButton.offset + playButton.width + stopButton.offset + (stopButton.width / 2);
    stopButton.centerY = playButton.centerY;

    stopButton.rectangle = new Array(stopButton.centerX - (stopButton.width / 2) * stopButton.scale, stopButton.centerY - (stopButton.width / 2) * stopButton.scale, stopButton.width * stopButton.scale, stopButton.width * stopButton.scale);
}


// Initializes the button to change the time speed
timeButton.init = function()
{
    var bottomBarPos = canvas.height - bottomBarHeight / 2;

    timeButton.width = bottomBarHeight * 2.5;
    timeButton.centerX = playButton.offset + playButton.width + stopButton.offset + stopButton.width + timeButton.offset + (timeButton.width / 2);
    timeButton.centerY = playButton.centerY;

    timeButton.rectangle = new Array(timeButton.centerX - (timeButton.width / 2) * timeButton.scale, timeButton.centerY - bottomBarHeight / 2 + timeButton.verticalMargin, timeButton.width * timeButton.scale, bottomBarHeight - timeButton.verticalMargin * 2);

    timeButton.value = 1;
    timeStep = 512 / timeButton.value;
}

// Draws the time button
timeButton.draw = function()
{
    // Draw the outer rectangle
    context.strokeStyle = buttonOutlineColor;
    context.fillStyle = buttonInsideColor;
    context.lineWidth = buttonOutlineThickness;
    context.strokeRect(this.rectangle[0], this.rectangle[1], this.rectangle[2], this.rectangle[3]);

    // Draw the text in the middle
    context.fillStyle = barLabelColor;    
    context.font = barLabelFont;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(this.value + "x", this.centerX, this.centerY);

}

// Make the time step decrease
timeButton.quicken = function()
{
    timeButton.value *= 2;
    if (timeButton.value == 32)
    {
        timeButton.value = 1;
    }
    timeStep = 512 / timeButton.value;
}

// Set up the dimensions for the previous button
previousButton.init = function()
{
    previousButton.width = bottomBarHeight * 2.5;
    previousButton.centerX = timeButton.centerX + (timeButton.width / 2) + previousButton.offset + (previousButton.width / 2) * previousButton.scale;
    previousButton.centerY = playButton.centerY;

    previousButton.rectangle = new Array(previousButton.centerX - (previousButton.width / 2) * previousButton.scale, previousButton.centerY - bottomBarHeight / 2 + previousButton.verticalMargin, previousButton.width * previousButton.scale, bottomBarHeight - previousButton.verticalMargin * 2);
}

// Draw the previous button
previousButton.draw = function()
{
    // Draw the outer rectangle
    context.strokeStyle = buttonOutlineColor;
    context.lineWidth = buttonOutlineThickness;
    context.strokeRect(this.rectangle[0], this.rectangle[1], this.rectangle[2], this.rectangle[3]);


    // Draw the text for the previous button (if any data is applicable)
    if (dataIterator > 0)
    {
        text = testDataTimes[dataIterator - 1];
    }
    else
    {
        text = "";
    }

    context.fillStyle = barLabelColor;    
    context.font = barLabelFont;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, this.centerX, this.centerY);

    // Layer over the text in the rectangle (to "gray out" the text)
    context.fillStyle = "rgba(" + this.color[0] + ", " + this.color[1] + ", " + this.color[2] + ", " + this.color[3] + ")";
    context.fillRect(this.rectangle[0], this.rectangle[1], this.rectangle[2], this.rectangle[3]);

}

// Set up the dimensions for the current button
currentButton.init = function()
{
    currentButton.width = bottomBarHeight * 2.5;
    currentButton.centerX = previousButton.centerX + (previousButton.width / 2) * previousButton.scale + currentButton.offset + (currentButton.width / 2) * currentButton.scale;
    currentButton.centerY = playButton.centerY;

    currentButton.rectangle = new Array(currentButton.centerX - (currentButton.width / 2) * currentButton.scale, currentButton.centerY - bottomBarHeight / 2 + currentButton.verticalMargin, currentButton.width * currentButton.scale, bottomBarHeight - currentButton.verticalMargin * 2);
}

// Draw the current button
currentButton.draw = function()
{

    // Draw the inner rectangle (darker)
    context.fillStyle = "rgba(" + this.color[0] + ", " + this.color[1] + ", " + this.color[2] + ", " + this.color[3] + ")";
    context.fillRect(this.rectangle[0], this.rectangle[1], this.rectangle[2], this.rectangle[3]);    

    // Draw the outer rectangle
    context.strokeStyle = buttonOutlineColor;
    context.lineWidth = buttonOutlineThickness;
    context.strokeRect(this.rectangle[0], this.rectangle[1], this.rectangle[2], this.rectangle[3]);

    // Draw the text for the current button
    text = testDataTimes[dataIterator];

    context.fillStyle = barLabelColor;    
    context.font = barLabelFont;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, this.centerX, this.centerY);


}

// Set up the dimensions for the next button
nextButton.init = function()
{
    nextButton.width = bottomBarHeight * 2.5;
    nextButton.centerX = currentButton.centerX + (currentButton.width / 2) * currentButton.scale + nextButton.offset + (nextButton.width / 2) * nextButton.scale;
    nextButton.centerY = playButton.centerY;

    nextButton.rectangle = new Array(nextButton.centerX - (nextButton.width / 2) * nextButton.scale, nextButton.centerY - bottomBarHeight / 2 + nextButton.verticalMargin, nextButton.width * nextButton.scale, bottomBarHeight - nextButton.verticalMargin * 2);
}

// Draw the next button
nextButton.draw = function()
{
    // Draw the outer rectangle
    context.strokeStyle = buttonOutlineColor;
    context.lineWidth = buttonOutlineThickness;
    context.strokeRect(this.rectangle[0], this.rectangle[1], this.rectangle[2], this.rectangle[3]);

    // Draw the text for the next button (if any data is applicable)
    if (dataIterator < testDataTimes.length - 1)
    {
        text = testDataTimes[dataIterator + 1];
    }
    else
    {
        text = "";
    }

    context.fillStyle = barLabelColor;    
    context.font = barLabelFont;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, this.centerX, this.centerY);

    // Layer over the text in the rectangle (to "gray out" the text)
    context.fillStyle = "rgba(" + this.color[0] + ", " + this.color[1] + ", " + this.color[2] + ", " + this.color[3] + ")";
    context.fillRect(this.rectangle[0], this.rectangle[1], this.rectangle[2], this.rectangle[3]);

}

function initDraw()
{
    canvas = document.getElementById("stereo-canvas");
    context = canvas.getContext("2d");

    canvas.style.backgroundColor = backgroundColor;

    canvas.addEventListener("click", onClick, false);

    dataIterator = 0;

    playButton.init();
    stopButton.init();
    timeButton.init();
    previousButton.init();
    currentButton.init();
    nextButton.init();

    process();
}

function process()
{
    var barNo = 0;
    var maxLevel = 1000;

    if (isPlaying)
    {
        // Move on to next data point if there is data left
        if (dataIterator < testDataTimes.length - 1)
        {
            // alert(dataIterator + " < " + testDataTimes.length);
            dataIterator++;
        }
        // Otherwise, stop moving   
        else
        {
            isPlaying = false;
        }
    }

    draw(numBars, barNo, maxLevel);
    timeout = setTimeout("process()", timeStep);
}

function draw(numBars, barNo, maxLevel)
{
    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d");

    // alert("Drawing with dataIterator: " + dataIterator);

    context.clearRect(0, 0, canvas.width, canvas.height);

    // hard-coded
    maxLevel = 20;

    drawBars(numBars, maxLevel);

    drawCenter();
    drawLeftBar();
    drawBottomBar();
    drawButtons();
    drawText();
}

function drawBars(numBars, maxLevel)
{
    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d")

    var barNo;
    for(barNo = 0; barNo < numBars; barNo++)
    {
        drawBar(barNo, testData[barNo][dataIterator], maxLevel, maxBoxes);
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

// Draw left bar
function drawLeftBar()
{
    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d");
    
    var centerPos = canvas.height / 2;

    context.fillStyle = leftBarColor;

    // Draw top half of bar
    context.fillRect(leftBarOffset, centerPos - centerHeight / 2 - leftBarHeight, leftBarWidth, leftBarHeight);

    // Draw bottom half of bar
    context.fillRect(leftBarOffset, centerPos + centerHeight / 2, leftBarWidth, leftBarHeight);
}

// Draw bottom bar
function drawBottomBar()
{
    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d");

    var bottomBarPos = canvas.height - bottomBarHeight / 2;
    
    context.fillStyle = bottomBarColor;

    // Draw bottom bar
    context.fillRect(bottomBarOffset, bottomBarPos - bottomBarHeight / 2, bottomBarWidth, bottomBarHeight);

}

function drawButtons()
{
    playButton.draw();
    stopButton.draw();
    timeButton.draw();
    previousButton.draw();
    currentButton.draw();
    nextButton.draw();
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
        context.fillText(testDataLabels[barNo], x, y, boxWidth);
    }

    // Draw axis labels
    var topLabel = "More Unemployment";
    var bottomLabel = "Less Employment";

    // Save context to restore later
    context.save();
    // Draw top text at the vertical center of the top left bar, and in the left half
    context.translate(leftBarOffset + leftBarWidth / 4, centerPos - centerHeight / 2 - leftBarHeight / 2);
    // Rotate pi/2 (90 degrees) counterclockwise
    context.rotate(-Math.PI/2);
    // Draw top text
    context.fillText(topLabel, 0, 0, leftBarHeight - 10);

    // Restore context to how it was before
    context.restore();
    
    // Save context to restore later
    context.save();

    // Draw bottom text at the vertical center of the bottom left bar, and in the left half
    context.translate(leftBarOffset + leftBarWidth / 4, centerPos + centerHeight / 2 +  + leftBarHeight / 2);
    // Rotate pi/2 (90 degrees) counterclockwise
    context.rotate(-Math.PI/2);
    // Draw bottom text
    context.fillText(bottomLabel, 0, 0, leftBarHeight - 10);

    // Restore context to how it was before
    context.restore();  

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

// Mouse click event listener
function onClick(e)
{
    switch(getClickedObject(e))
    {
        case "playButton":
            // alert("play button clicked!");
            if (isPlaying)
            {
                // Switch to paused
                isPlaying = false;
            }
            else
            {
                // Switch to playing
                isPlaying = true;
            }

            break;
        case "stopButton":
            dataIterator = 0;
            isPlaying = false;
            break;
        case "timeButton":
            // alert("time button clicked!");
            timeButton.quicken();
            break;
        case "previousButton":
            // alert("previous button clicked!");
            isPlaying = false;
            if (dataIterator > 0)
            {
                dataIterator--;
            }
            clearTimeout(timeout);
            process();
            break;
        case "nextButton":
            // alert("next button clicked!");
            isPlaying = false;
            if (dataIterator < testDataTimes.length - 1)
            {
                dataIterator++;
            }
            clearTimeout(timeout);
            process();
            break;
        default:
            // alert("Other click");
    }
}

// Parse mouse click to figure out which on-screen object was clicked
function getClickedObject(e)
{

    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d");

    var centerPos = canvas.height / 2;
    var centerWidth = boxWidth * numBars + spaceBetweenBars * (numBars - 1) + centerLeftHorizontalMargin + centerRightHorizontalMargin;

    var posX;
    var posY;

    // Need to check pageX/Y and clientX/Y in order to have cross-browser compatibility
    if (e.pageX || e.pageY)
    {
        posX = e.pageX;
        posY = e.pageY;
    }   
    else if (e.clientX || e.clientY)
    {
        posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    // Correct using canvas offset (as well as the offset of the canvas's parent, which helps for Firefox's case)
    posX -= (canvas.offsetLeft + canvas.offsetParent.offsetLeft);
    posY -= (canvas.offsetTop + canvas.offsetParent.offsetTop);

    if (((posX >= playButton.rectangle[0]) && (posX <= playButton.rectangle[0] + playButton.rectangle[2])) && ((posY >= playButton.rectangle[1]) && (posY <= playButton.rectangle[1] + playButton.rectangle[3])))
    {
        return "playButton";
    }

    if (((posX >= stopButton.rectangle[0]) && (posX <= stopButton.rectangle[0] + stopButton.rectangle[2])) && ((posY >= stopButton.rectangle[1]) && (posY <= stopButton.rectangle[1] + stopButton.rectangle[3])))
    {
        return "stopButton";
    }

    if (((posX >= timeButton.rectangle[0]) && (posX <= timeButton.rectangle[0] + timeButton.rectangle[2])) && ((posY >= timeButton.rectangle[1]) && (posY <= timeButton.rectangle[1] + timeButton.rectangle[3])))
    {
        return "timeButton";
    }

   if (((posX >= previousButton.rectangle[0]) && (posX <= previousButton.rectangle[0] + previousButton.rectangle[2])) && ((posY >= previousButton.rectangle[1]) && (posY <= previousButton.rectangle[1] + previousButton.rectangle[3])))
    {
        return "previousButton";
    }

   if (((posX >= nextButton.rectangle[0]) && (posX <= nextButton.rectangle[0] + nextButton.rectangle[2])) && ((posY >= nextButton.rectangle[1]) && (posY <= nextButton.rectangle[1] + nextButton.rectangle[3])))
    {
        return "nextButton";
    }


    return "";
}

function showVariable2Data()
{
    document.getElementById("variable_2_data").style.visibility = 'visible';

}

function hideVariable2Data()
{
    document.getElementById("variable_2_data").style.visibility = 'hidden';

}


