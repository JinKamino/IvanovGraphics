function split_spectrum(image, spectre)
{
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const image_data = context.getImageData(0, 0, canvas.width, canvas.height);
    const data_ = image_data.data;
    for (let i = 0; i < data_.length; i += 4)
    {
        if (spectre === 'red')
        {
            data_[i + 1] = 0;
            data_[i + 2] = 0;
        }
        else if (spectre === 'green')
        {
            data_[i] = 0;
            data_[i + 2] = 0;
        }
        else if (spectre === 'blue')
        {
            data_[i] = 0;
            data_[i + 1] = 0;
        }
    }
    context.putImageData(image_data, 0, 0);
    return canvas.toDataURL();
}
function drawHistogram(canvas, image, color) {
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const histogram = {
        red: new Array(256).fill(0),
        green: new Array(256).fill(0),
        blue: new Array(256).fill(0)
    };

    for (let i = 0; i < data.length; i += 4) {
        histogram.red[data[i]]++;
        histogram.green[data[i + 1]]++;
        histogram.blue[data[i + 2]]++;
    }

    const maxCount = Math.max(...histogram.red, ...histogram.green, ...histogram.blue);
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (color === 'red') 
    {
        context.fillStyle = 'red';
        for (let i = 0; i < 256; i++) {
            const height = (histogram.red[i] / maxCount) * canvas.height;
            context.fillRect(i, canvas.height - height, 1, height);
        }
    }
    if (color === 'green') 
    {
        context.fillStyle = 'green';
        for (let i = 0; i < 256; i++) {
            const height = (histogram.green[i] / maxCount) * canvas.height;
            context.fillRect(i, canvas.height - height, 1, height);
        }
    }
    if (color === 'blue')
    {
        context.fillStyle = 'blue';
        for (let i = 0; i < 256; i++) {
            const height = (histogram.blue[i] / maxCount) * canvas.height;
            context.fillRect(i, canvas.height - height, 1, height);
            
        }
    }
}
const red_histogram = document.getElementById('red_histogram');
const blue_histogram = document.getElementById('blue_histogram');
const green_histogram = document.getElementById('green_histogram');
const original_image_ = document.getElementById('original_image');
const red_image = document.getElementById('red_spectrum');
const blue_image = document.getElementById('blue_spectrum');
const green_image = document.getElementById('green_spectrum');

original_image_.onload = function() 
{
    red_image.src = split_spectrum(original_image_, 'red');
    blue_image.src = split_spectrum(original_image_, 'blue');
    green_image.src = split_spectrum(original_image_, 'green');
    red_histogram.width = original_image_.width;
    red_histogram.height = original_image_.height;
    drawHistogram(red_histogram, original_image_, 'red');
    green_histogram.width = original_image_.width;
    green_histogram.height = original_image_.height;
    drawHistogram(green_histogram, original_image_, 'green');
    blue_histogram.width = original_image_.width;
    blue_histogram.height = original_image_.height;
    drawHistogram(blue_histogram, original_image_, 'blue');
};