var red = 0;
var green = 0;
var blue = 0;
var alpha = 255;

function initDraw()
{
    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d");

    return setInterval(draw, 16);
}

function draw()
{
    var canvas = document.getElementById("stereo-canvas");
    var context = canvas.getContext("2d")

    // Create an imagedata object in order to do
    // individual pixel manipulation on the canvas
    var image_data = context.createImageData(canvas.width, canvas.height);
    var x = 0, y = 0;

    for(y = 0; y < canvas.height; y++)
    {
        for(x = 0; x < canvas.width; x++)
        {
            // Set pixel colors
            image_data.data[(y * canvas.width + x) * 4] = red;
            image_data.data[(y * canvas.width + x) * 4 + 1] = green;
            image_data.data[(y * canvas.width + x) * 4 + 2] = blue;
            image_data.data[(y * canvas.width + x) * 4 + 3] = alpha;

            // Change pixel colors
            red += 1;
            green += 3;
            blue--;
            if (red > 255){ red = 0; }
            if (green > 255){ green = 0; }
            if (blue < 0){ blue = 255; }
        }
    }
    context.putImageData(image_data, 0, 0);
}