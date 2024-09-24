const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const hueInput = document.getElementById('hue');
const saturationInput = document.getElementById('saturation');
const brightnessInput = document.getElementById('brightness');
const downloadButton = document.getElementById('download');

let imageData;

upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            applyChanges();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, v * 100];
}

function hsvToRgb(h, s, v) {
    let r, g, b;
    const i = Math.floor(h / 60) % 6;
    const f = h / 60 - Math.floor(h / 60);
    const p = v * (1 - s / 100);
    const q = v * (1 - f * s / 100);
    const t = v * (1 - (1 - f) * s / 100);

    switch (i) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [Math.round(r), Math.round(g), Math.round(b)];
}

function applyChanges() {
    const hue = parseInt(hueInput.value);
    const saturation = parseInt(saturationInput.value);
    const brightness = parseInt(brightnessInput.value);

    const outputData = ctx.createImageData(imageData.width, imageData.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];

        const [h, s, v] = rgbToHsv(r, g, b);

        // Update HSV values
        const newH = (h + hue) % 360;
        const newS = Math.min(100, s * (saturation / 100));
        const newV = Math.min(100, v * (brightness / 100));

        const [newR, newG, newB] = hsvToRgb(newH, newS, newV);

        outputData.data[i] = newR;
        outputData.data[i + 1] = newG;
        outputData.data[i + 2] = newB;
        outputData.data[i + 3] = imageData.data[i + 3]; // Alpha
    }

    ctx.putImageData(outputData, 0, 0);
}

hueInput.addEventListener('input', applyChanges);
saturationInput.addEventListener('input', applyChanges);
brightnessInput.addEventListener('input', applyChanges);

downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'modified_image.png';
    link.href = canvas.toDataURL();
    link.click();
});
