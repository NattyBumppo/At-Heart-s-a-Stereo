var canvas;
var context;
var timeout;
var hoverRects = new Array();
var prevPosX;
var prevPosY;

var readyToAdvance = true;

var testint = 0;

var currentDataset = dataset1;
var variable1Col = 0;
var variable2Col = 0;

// var alpha = 255;
var level = 0;
var isPlaying = false;
var dataIterator;

// Config values
var boxWidth = 50;
var boxHeight = 3;
var numBars = 10;
var maxBoxes = 44;
var spaceBetweenBoxes = 2;
var spaceBetweenBars = 2;  
var timeStep = 0;

var backgroundColor = "#111111";
var centerColor = "#444444";
var barLabelColor = "#FFFFFF";
var barLabelFontPt = "12"
var barLabelFont = barLabelFontPt + "px sans-serif";
var barLabelShadowOffsetX = 1;
var barLabelShadowOffsetY = 1;
var barLabelShadowBlur = 1;
var barLabelShadowColor = "#000000";
var buttonOutlineColor = "#DDDDDD";
var buttonInsideColor = "#999999";
var buttonOutlineThickness = 1;

var centerHeight = 30;
var centerWidth = 640
var centerLeftHorizontalMargin = 64;
var centerRightHorizontalMargin = 20;

var leftBarOffset = 0;
var leftBarWidth = 54;
var leftBarColor = "#333333";
var leftBarHeight = 240 - centerHeight / 2

var tickLength = 5;
var tickColor = "#FFFFFF";

var bottomBarOffset = 0;
var bottomBarWidth = 640;
var bottomBarColor = "#444444";
var bottomBarHeight = 30;

var tooltipColor = "rgba(0, 255, 200, 0.7)";
var tooltipFontPt = 12
var tooltipFont = tooltipFontPt + "px sans-serif";
var tooltipFontColor = "#000000";
var tooltipCursorDistanceX = 8;
var tooltipCursorDistanceY = 4;
var currentTooltipDisplay = false;
var currentTooltipPos = new Array();
var currentTooltipBarNo = -1;

playButton = new Object();
stopButton = new Object();
timeButton = new Object();
previousButton = new Object();
currentButton = new Object();
nextButton = new Object();

playButton.scale = 0.5;
stopButton.scale = 0.4;
timeButton.scale = 0.5;
playButton.offset = leftBarWidth + 4;
stopButton.offset = -2;
//playButton.greyOutColor = "rgb(100, 100, 100)";

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

    // If on the last step, don't draw any button here; it won't do anything anyway
    if (dataIterator == (currentDataset.timeLabels.length - 1))
    {
        return;
    }
    // Otherwise draw the button
    context.fillStyle = buttonInsideColor;

    context.lineWidth = buttonOutlineThickness;
    context.lineCap = "round";

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
        context.fillRect(playButton.rectangle[0], playButton.rectangle[1], playButton.rectangle[2] / 2 - 3, playButton.rectangle[3]);
        context.strokeRect(playButton.rectangle[0], playButton.rectangle[1], playButton.rectangle[2] / 2 - 3, playButton.rectangle[3]);

        context.fillRect(playButton.rectangle[0] + playButton.rectangle[2] / 2 + 3, playButton.rectangle[1], playButton.rectangle[2] / 2 - 3, playButton.rectangle[3]);
        context.strokeRect(playButton.rectangle[0] + playButton.rectangle[2] / 2 + 3, playButton.rectangle[1], playButton.rectangle[2] / 2 - 3, playButton.rectangle[3]);
    }
}

// Draws the stop button
stopButton.draw = function()
{
    // Draw Stop Button
    /* Commenting out to replace the square stop button with an arrow
    context.beginPath();
    context.moveTo(stopButton.rectangle[0], stopButton.rectangle[1]);
    context.lineTo(stopButton.rectangle[0] + stopButton.rectangle[2], stopButton.rectangle[1]);
    context.lineTo(stopButton.rectangle[0] + stopButton.rectangle[2], stopButton.rectangle[1] + stopButton.rectangle[3]);
    context.lineTo(stopButton.rectangle[0], stopButton.rectangle[1] + stopButton.rectangle[3]);
    context.lineTo(stopButton.rectangle[0], stopButton.rectangle[1]);
    */

    context.strokeStyle = buttonOutlineColor;
    context.lineWidth = buttonOutlineThickness * 2;
    context.lineCap = "round";

    // Draw arc of circle of reset button
    var x = (stopButton.rectangle[0] + stopButton.rectangle[2] / 2);
    var y = (stopButton.rectangle[1] + stopButton.rectangle[3] / 2);
    var radius = (stopButton.rectangle[2] / 2);
    var startAngle = Math.PI / 2;
    var endAngle = Math.PI;
    var clockwise = true;


    context.beginPath();
    context.arc(x, y, radius, startAngle, endAngle, clockwise);

    // Draw arrow at the end of the arc
    context.lineTo(stopButton.rectangle[0] -2, y);
    context.lineTo(stopButton.rectangle[0] - 2, stopButton.rectangle[1] - 2);
    context.lineTo(stopButton.rectangle[0] - 2, y);
    context.lineTo(x, y);
    
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
    timeStep  = 1024 / timeButton.value;
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
        text = currentDataset.timeLabels[dataIterator - 1];
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
    text = currentDataset.timeLabels[dataIterator];

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
    if (dataIterator < currentDataset.timeLabels.length - 1)
    {
        text = currentDataset.timeLabels[dataIterator + 1];
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

    dataIterator = 0;

    setUpElements();
    updateVariableLabels();

    playButton.init();
    stopButton.init();
    timeButton.init();
    previousButton.init();
    currentButton.init();
    nextButton.init();

    canvas.addEventListener("click", onClick, false);
    canvas.addEventListener("mousemove", onMouseMove, false);

    process();
}

// Set up initial state of dynamic HTML elements on page
function setUpElements()
{
    // Set up dataset selector
    var datasetSelector = document.getElementById("datasetSelector");
    var optgroup = document.createElement("optgroup");

    for (datasetCounter in datasets)
    {
        // alert("dataset name: " + datasets[datasetCounter].name)
        // alert("First time label:" + datasets[datasetCounter].timeLabels[0])
        var option = new Option(datasets[datasetCounter].name);
        option.setAttribute("value", datasetCounter)
        optgroup.appendChild(option)
    }
    datasetSelector.appendChild(optgroup);

    // Set up variable 1 selector
    var variable1Selector = document.getElementById("variable1Selector");
    optgroup = document.createElement("optgroup");
    optgroup.setAttribute("id", "variable1optgroup");
    variable1Selector.appendChild(optgroup);

    // Set up variable 2 selector
    var variable2Selector = document.getElementById("variable2Selector");
    optgroup = document.createElement("optgroup");
    optgroup.setAttribute("id", "variable2optgroup");
    variable2Selector.appendChild(optgroup);

}

// Use the current selected dataset to load variables into the
// variable 1 and variable 2 selectors 
function updateVariableLabels()
{
    // Load variable 1 data labels from dataset
    var variable1optgroup = document.getElementById("variable1optgroup");
    
    // First, depopulate of old dataset's values, if necessary
    if (variable1optgroup.hasChildNodes())
    {
        while (variable1optgroup.childNodes.length >= 1)
        {
            variable1optgroup.removeChild(variable1optgroup.firstChild);
        }
    }

    // Now, repopulate with new dataset's values
    for (colNo in currentDataset.columnLabels)
    {
        var option = new Option(currentDataset.columnLabels[colNo])
        option.setAttribute("value", colNo);
        variable1optgroup.appendChild(option);
    }

    // Load variable 2 data labels from dataset  

    var variable2optgroup = document.getElementById("variable2optgroup");
    
    // First, depopulate of old dataset's values, if necessary
    if (variable2optgroup.hasChildNodes())
    {
        while (variable2optgroup.childNodes.length >= 1)
        {
            variable2optgroup.removeChild(variable2optgroup.firstChild);
        }
    }

    for (colNo in currentDataset.columnLabels)
    {
        var option = new Option(currentDataset.columnLabels[colNo])
        option.setAttribute("value", colNo);
        variable2optgroup.appendChild(option);
    }

    variable1Col = 0;
    variable2Col = 0;
}

function process()
{
    var barNo = 0;
    var maxLevel = currentDataset.columnMaxValues[variable1Col];

    draw(numBars, barNo, maxLevel);

    if (readyToAdvance)
    {
        if (isPlaying)
        {
            // Move on to next data point if there is data left
            if (dataIterator < currentDataset.timeLabels.length - 1)
            {
                // alert(dataIterator + " < " + currentDataset.timeLabels.length);
                dataIterator++;
            }
            // Otherwise, stop moving   
            else
            {
                isPlaying = false;
            }
        }
        readyToAdvance = false;
        timeout = setTimeout("advanceTime()", timeStep);
    }
    timeout = setTimeout("process()", 16);
}

function advanceTime()
{
    readyToAdvance = true;
}

function draw(numBars, barNo, maxLevel)
{
    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d");

    // alert("Drawing with dataIterator: " + dataIterator);

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBars(numBars, maxLevel);

    drawCenter();
    drawLeftBar();
    drawBottomBar();
    drawButtons();
    drawText();
    setupTooltips();
    if (currentTooltipDisplay)
    {
        showTooltip(currentTooltipBarNo, currentTooltipPos[0], currentTooltipPos[1]);
    }
}

// Gets the min of the dataset. I decided not to use Math.min because
// it processes "" (no data) as 0.
function getDatasetMin(dataset)
{
    var currentMin = dataset.columnDataPerSheet[0][0][0];

    for (sheetNo in dataset.columnDataPerSheet)
    {
        for (colNo in dataset.columnDataPerSheet[sheetNo])
        {
            for (timeNo in dataset.columnDataPerSheet[sheetNo][colNo])
            {
                testMin = dataset.columnDataPerSheet[sheetNo][colNo][timeNo];
                if ((testMin < currentMin) && (testMin != ""))
                {
                    currentMin = testMin;
                }
            }
        }
    }

    return currentMin;
}

function getDatasetMax(dataset)
{
    // alert(Math.max.apply(Math, dataset.columnDataPerSheet));
    var currentMax = dataset.columnDataPerSheet[0][0][0];

    for (sheetNo in dataset.columnDataPerSheet)
    {
        for (colNo in dataset.columnDataPerSheet[sheetNo])
        {
            for (timeNo in dataset.columnDataPerSheet[sheetNo][colNo])
            {
                testMax = dataset.columnDataPerSheet[sheetNo][colNo][timeNo];
                if ((testMax > currentMax) && (testMax != ""))
                {
                    currentMax = testMax;
                }
            }
        }
    }

    return currentMax;
}

function drawBars(numBars, maxLevel)
{
    alert("Min: " + getDatasetMin(currentDataset));
    alert("Max: " + getDatasetMax(currentDataset));

    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d")

    var usingSecondVariable = (document.getElementById("variable2element").style.visibility != "hidden");

    var barNo;
    for(barNo = 0; barNo < numBars; barNo++)
    {
        drawBar(barNo, currentDataset.columnDataPerSheet[barNo][variable1Col][dataIterator], maxLevel, maxBoxes, usingSecondVariable);
    }
}


// Maps level to a box level, and draws it
function drawBar(barNo, level, maxLevel, maxBoxes, usingSecondVariable)
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
            y = centerPos - (centerHeight / 2) - (boxHeight + spaceBetweenBoxes) * (boxNo + 1);
        }
        else
        {
            // Draw from the center down
            y = centerPos + spaceBetweenBoxes + centerHeight / 2 + (boxHeight + spaceBetweenBoxes) * boxNo;
        }

        if (usingSecondVariable)
        {
            var variable2Value = currentDataset.columnDataPerSheet[barNo][variable2Col][dataIterator];
            var variable2Max = currentDataset.columnMaxValues[variable2Col];
            context.fillStyle = getBoxColor(Math.abs(variable2Value), variable2Max);
        }
        else
        {
            context.fillStyle = getBoxColor(boxNo, maxBoxes);
        }

        context.fillRect(x, y, boxWidth, boxHeight);
    }
}

function drawCenter()
{
    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d");

    var centerPos = canvas.height / 2;
    // var centerWidth = boxWidth * numBars + spaceBetweenBars * (numBars - 1) + centerLeftHorizontalMargin + centerRightHorizontalMargin;

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

    // Draw tick marks for max and min
    var maxPosX = leftBarOffset + leftBarWidth - tickLength;
    var maxPosY = centerPos - centerHeight / 2 - (boxHeight + spaceBetweenBoxes) * maxBoxes;

    var minPosX = leftBarOffset + leftBarWidth - tickLength;
    var minPosY = centerPos + centerHeight / 2 + (boxHeight + spaceBetweenBoxes) * maxBoxes;

    context.strokeStyle = tickColor;
    context.beginPath();
    context.moveTo(maxPosX, maxPosY);
    context.lineTo(maxPosX + tickLength, maxPosY);
    context.moveTo(minPosX, minPosY);
    context.lineTo(minPosX + tickLength, minPosY);
    context.stroke();
    context.closePath();
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
        var lines = new Array(currentDataset.dataSheets[barNo], "");
        
        // Make font smaller and smaller until it fits
        var fits = (context.measureText(lines[0]).width < boxWidth);
        if(!fits)
        {
            // If the line can be split up into two lines, do so first
            if (isSplittable(lines[0]) && lines[1] == "")
            {
                // alert("Slicing up " + lines[0]);
                var splitArray = lines[0].split(" ");
                
                // Now find the pair of lines with the shortest maximum length
                var maxLength = 1000;
                var slicePoint = 0;
                for (var i = 1; i < splitArray.length; i++)
                {
                    // Get the maximum measured length between the two slices
                    // (joined back together with spaces after the split)
                    var localMax = Math.max(context.measureText(splitArray.slice(0, i).join(" ")).width, context.measureText(splitArray.slice(i).join(" ")).width);
                    // alert("localMax: " + localMax);
                    // We want to minimize the maximum length
                    if (localMax < maxLength)
                    {
                        // alert(localMax + " < " + maxLength);
                        maxLength = localMax;
                        slicePoint = i;
                    }
                }
                // alert("slicePoint: " + slicePoint)
                // At this point, we've determined the best way to split the strings
                // alert("The best way to split these strings is " + splitArray.slice(0, slicePoint).join(" ") + " / " + splitArray.slice(slicePoint).join(" "));
                lines[0] = splitArray.slice(0, slicePoint).join(" ");
                lines[1] = splitArray.slice(slicePoint).join(" ");
            }

            // Now, re-check if both lines fit
            fits = ((context.measureText(lines[0]).width < boxWidth) && (context.measureText(lines[1]).width) < boxWidth);
        }

        // Save old font
        var oldBarLabelFontPt = barLabelFontPt;
        var oldBarLabelFont = barLabelFont;

        // If it still doesn't fit, decrease font size until it does
        while(!fits)
        {
            barLabelFontPt--;
            barLabelFont = barLabelFontPt + "px sans-serif";
            context.font = barLabelFont;
            fits = ((context.measureText(lines[0]).width < boxWidth) && (context.measureText(lines[1]).width) < boxWidth);

            //alert("Calculated width in pixels of '" + barLabel + "' in " + barLabelFontPt + "pt font: " + context.measureText(barLabel).width);
            //alert("Fits: " + fits);

        }


        // Adding 0.5 to the position allows the text to be properly centered
        var x = centerLeftHorizontalMargin + (boxWidth + spaceBetweenBars) * (barNo + 0.5);
        var y = centerPos;

        // alert("lines: " + lines);
        // Single line
        if (lines[1] == "")
        {
            context.fillText(lines[0], x, y, boxWidth);
        }
        // Two lines
        else
        {
            context.fillText(lines[0], x, y - centerHeight / 4 + 2, boxWidth);
            context.fillText(lines[1], x, y + centerHeight / 4 - 2, boxWidth);
        }

        // Restore font
        barLabelFontPt = oldBarLabelFontPt;
        barLabelFont = oldBarLabelFont;
        context.font = barLabelFont;

    }

    // Draw axis labels
    var topLabel = currentDataset.axisLabels[variable1Col][0];
    var bottomLabel = currentDataset.axisLabels[variable1Col][1];

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

// Looks at 
function isSplittable(line)
{
    // Returns true if a space is found in the string; false otherwise
    return (line.indexOf(" ") != -1);
}

function setupTooltips()
{
    // Check for hovering over a bar (or the center bar below/above it)
    var centerPos = canvas.height / 2;

    // Reassign hoverRect to the new, current values
    hoverRects = new Array();

    var maxLevel = currentDataset.columnMaxValues[variable1Col];

    // Go to each bar and get a rectangle encompassing its content (including the center bar)
    var barNo;
    for (barNo = 0; barNo < numBars; barNo++)
    {
        
        var level = currentDataset.columnDataPerSheet[barNo][variable1Col][dataIterator];

        // Get how many boxes will make up the stack
        var boxesToLight = maxBoxes * (level / maxLevel);

        // In case boxesToLight was multiplied by a negative level, reset to positive
        if (boxesToLight < 0)
        {
            boxesToLight *= -1;
        }


        var bar = new Object();
        bar.left = centerLeftHorizontalMargin + (boxWidth + spaceBetweenBars) * barNo;
        if(level > 0)
        {
            // Bar is from the center up
            bar.top = centerPos - (centerHeight / 2 + (boxHeight + spaceBetweenBoxes) * boxesToLight);
            bar.bottom = centerPos + centerHeight / 2;
        }
        else
        {
            // Bar is from the center down
            bar.top = centerPos - centerHeight / 2;
            bar.bottom = centerPos + centerHeight / 2 + spaceBetweenBoxes + (boxHeight + spaceBetweenBoxes) * boxesToLight;
        }
        bar.width = boxWidth;
        bar.height = bar.bottom - bar.top;

        hoverRects.push(new Array(bar.left, bar.top, bar.width, bar.height));
    }
    // alert(hoverRects.length);


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
            if (dataIterator < currentDataset.timeLabels.length - 1)
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

// Mouse move event listener
function onMouseMove(e)
{
    var barNo = getMouseMoveObject(e);
    if (barNo == -1)
    {
        // Not on a bar, so don't display (last frame's) tooltip
        currentTooltipDisplay = false;
    }
    else
    {
        // Get mouse coordinates for showing the tooltip
        var mousePos = getMousePos(e);
        var posX = mousePos[0];
        var posY = mousePos[1];

        showTooltip(barNo, mousePos[0], mousePos[1]);
    }
}

// Show a tooltip corresponding to the currently hovered-over bar
function showTooltip(objectNo, posX, posY)
{
    if(objectNo >= 0)
    {
        // Construct lines of text to show
        var sheetLabel = currentDataset.dataSheets[objectNo];
        var timeLabel = currentDataset.timeLabels[dataIterator];
        var variable1NameLabel = currentDataset.columnLabels[variable1Col];
        var variable1ValueLabel = currentDataset.columnDataPerSheet[objectNo][variable1Col][dataIterator];
        var variable2NameLabel = currentDataset.columnLabels[variable2Col];
        var variable2ValueLabel = currentDataset.columnDataPerSheet[objectNo][variable2Col][dataIterator];

        var lines = new Array();
        lines.push(sheetLabel);
        lines.push("(" + timeLabel + ")");
        lines.push(variable1NameLabel + ": " + variable1ValueLabel);

        // Add info for variable 2 if it's displayed as well
        if (document.getElementById("variable2element").style.visibility != "hidden")
        {
            lines.push(variable2NameLabel + ": " + variable2ValueLabel);
        }

        // Draw rectangle and text
        drawTooltipRectangleAndText(lines, posX, posY, objectNo);

        // Set global so that the tooltip continues to be displayed as long as it's applicable
        currentTooltipDisplay = true;
        currentTooltipPos = new Array(posX, posY);
        currentTooltipBarNo = objectNo;
    }
}

function drawTooltipRectangleAndText(lines, posX, posY, objectNo)
{
    var rectHeight = (tooltipFontPt + 1) * (lines.length);
    var rectWidth = 0;
    // Get the width
    for (lineNo in lines)
    {
        if (lines[lineNo].length * (tooltipFontPt * 2 / 3) > rectWidth)
        {
            rectWidth = lines[lineNo].length * (tooltipFontPt * 2 / 3);
        }
    }
    // alert("rectWidth: " + rectWidth);
    // Draw rectangle
    context.fillStyle = tooltipColor;
    
    // If on the left side of the bars, render the tooltip to the right;
    // otherwise, render it to the left
    if (objectNo < numBars / 2)
    {
        context.fillRect(posX + tooltipCursorDistanceX, posY + tooltipCursorDistanceY, rectWidth, rectHeight);
    }
    else
    {
        context.fillRect(posX - tooltipCursorDistanceX - rectWidth, posY + tooltipCursorDistanceY, rectWidth, rectHeight);
    }

    // Draw text
    var vOffset = 2;
    var hOffset = 2;
    for (lineNo in lines)
    {
        context.fillStyle = tooltipFontColor;    
        context.font = tooltipFont;
        context.textAlign = 'left';
        context.textBaseline = 'top';
        // Draw either to the left or the right of the cursor, as above with the rectangle
        if (objectNo < numBars / 2)
        {
            context.fillText(lines[lineNo], posX + tooltipCursorDistanceX + hOffset, posY + vOffset + tooltipCursorDistanceY);
        }
        else
        {
            context.fillText(lines[lineNo], posX - tooltipCursorDistanceX - rectWidth + hOffset, posY + vOffset + tooltipCursorDistanceY);
        }        
            
        vOffset += tooltipFontPt;
    }

    prevPosX = posX;
    prevPosY = posY;
}

// Parse mouse move event to figure out where the mouse cursor is
function getMouseMoveObject(e)
{
    var mousePos = getMousePos(e);
    var posX = mousePos[0];
    var posY = mousePos[1];
    // alert("Mouse move at (" + posX + ", " + posY + ")");

    // Check if on a bar
    var barNo = getBarNoFromMouseCoordinates(posX, posY);
    // alert("(" + posX + ", " + posY + ") is on bar " + barNo)
    return barNo;
}

function getBarNoFromMouseCoordinates(posX, posY)
{
    for (rectNo in hoverRects)
    {
        // alert(rectNo);
        // alert(hoverRects[rectNo])
        if (((posX >= hoverRects[rectNo][0]) && (posX <= hoverRects[rectNo][0] + hoverRects[rectNo][2])) && ((posY >= hoverRects[rectNo][1]) && (posY <= hoverRects[rectNo][1] + hoverRects[rectNo][3])))
        {
          return rectNo;
        }
    }
    return -1;
}


// Parse mouse click to figure out which on-screen object was clicked
function getClickedObject(e)
{
    var centerPos = canvas.height / 2;
    var centerWidth = boxWidth * numBars + spaceBetweenBars * (numBars - 1) + centerLeftHorizontalMargin + centerRightHorizontalMargin;

    var mousePos = getMousePos(e);
    var posX = mousePos[0];
    var posY = mousePos[1];

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

function getMousePos(e)
{
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

    return (new Array(posX, posY));
}


function showVariable2Data()
{
    document.getElementById("variable2element").style.visibility = 'visible';
    document.getElementById("colorExplanation").style.visibility = 'visible';

    variable2Change();
}

function hideVariable2Data()
{
    document.getElementById("variable2element").style.visibility = 'hidden';
    document.getElementById("colorExplanation").style.visibility = 'hidden';
}

function datasetChange()
{
    var datasetNo = document.getElementById("datasetSelector").value;
    currentDataset = datasets[datasetNo];
    updateVariableLabels();
    dataIterator = 0;
    // alert("Dataset changed");
}

function variable1Change()
{
    variable1Col = document.getElementById("variable1Selector").value;
    // alert("Variable 1 changed");
}

function variable2Change()
{
    variable2Col = document.getElementById("variable2Selector").value;
    displayColorExplanation();
    // alert("Variable 2 changed");
}

function displayColorExplanation()
{
    var colorExplanation = document.getElementById("colorExplanation");

    // Add color explanation data

    // Lower bound (signless) is always zero; upper-bound is determined from the data
    var upperBound = currentDataset.columnMaxValues[variable2Col];

    var colorExplanationText = "Bar Color (+/-)<br /><br />";

    colorExplanationText += "0 to " + (upperBound / 4);
    colorExplanationText += colorRectangleHTML(0);
    colorExplanationText += (upperBound / 4) + " to " + (upperBound / 4) * 2 + "<br />";
    colorExplanationText += colorRectangleHTML(1);
    colorExplanationText += (upperBound / 4) * 2 + " to " + (upperBound / 4) * 3 + "<br />";
    colorExplanationText += colorRectangleHTML(2);
    colorExplanationText += (upperBound / 4) * 3 + " to " + upperBound + "<br />";
    colorExplanationText += colorRectangleHTML(3);

    colorExplanation.innerHTML = colorExplanationText;

}

// Returns the HTML for the gradient rectangle referenced
function colorRectangleHTML(rectNo)
{
    var string = "";
    //string += '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">';
    var startColor, endColor;
    
    switch(rectNo)
    {
        // First quarter (green to halfway between yellow and green)
        case 0:
            startColor = "rgb(0, 255, 0)";
            endColor = "rgb(127, 127, 0)";
            break;
        // Second quarter (halfway between yellow and green to yellow)
        case 1:
            startColor = "rgb(127, 127, 0)";
            endColor = "rgb(255, 255, 0)";
            break;
        // Third quarter (yellow to halfway between yellow and red)
        case 2:
            startColor = "rgb(255, 255, 0)";
            endColor = "rgb(255, 127, 0)";
            break;
        // Fourth quarter (halfway between yellow and red to red)
        case 3:
            startColor = "rgb(255, 127, 0)";
            endColor = "rgb(255, 0, 0)";
            break;
        default:
            startColor = "rgb(0, 0, 0)";
            endColor = "rgb(0, 0, 0)";
            break;  
    }

    //string += '<linearGradient id="grad' + rectNo + '" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:' + startColor + ';stop-opacity:1" /><stop offset="100%" style="stop-color:' + endColor + ';stop-opacity:1" /></linearGradient></defs><rect width="100" height="30" fill="url(#grad' + rectNo + ')" stroke-width="1" /></svg>';

    var userAgent = navigator.userAgent;

    if ((userAgent.indexOf("Chrome") != -1) || (userAgent.indexOf("Safari") != -1))
    {
        // Detected that the user is running Chrome or Safari (or at least claims to be doing so)
        // alert("Chrome!");
        string += '<div style="background-image: -webkit-gradient(linear, left top, right bottom, color-stop(0, ' + startColor + '), color-stop(1, ' + endColor +')); width:100px; height:20px;"></div>';
    }
    else if (userAgent.indexOf("Firefox") != -1)
    {
        // Detected that the user is running Firefox (or at least claims to be doing so)
        // alert("Firefox!");
        string += '<div style="background-image: -moz-linear-gradient(top left, ' + startColor + ' 0%, ' + endColor + ' 100%); width:100px; height:20px;"></div>';
    }
    else
    {
        // alert("Different user agent: " + userAgent);
    }

    

    // alert("rectangle " + rectNo);
    // alert(startColor + " to " + endColor);
    // alert(string);
    
    return string;
}



