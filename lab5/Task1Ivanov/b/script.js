const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('fileInput');

var grammar = {
    atom: '',
    angle: 0,
    direction: 90,
    rules: {},
    depth: 4,
    length: 10,
    randomness: 66,
};

var points = [];
var thickness = 5;

fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    const fgets = new FileReader();

    fgets.onload = function (e) {
        const data = e.target.result;
        parser(data);
        fractal();
        renderer();
    };

    fgets.readAsText(file);
});

function parser(content) {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // <атом> <угол поворота> <начальное направление> <глубина>
    const [atom, angle = '25', direction = '0', depth = '5'] = lines[0].split(' ');
    grammar.atom = atom;
    grammar.angle = parseFloat(angle);
    grammar.direction = parseFloat(direction);
    grammar.depth = parseInt(depth);

    grammar.rules = {};
    for (var i = 1; i < lines.length; i++) {
        const [key, value] = lines[i].split('->').map(str => str.trim());
        grammar.rules[key] = value;
    }
}

function composer(axiom, rules, iterations) {
    var cur = axiom;
    for (var i = 0; i < iterations; i++) {
        var next = '';
        for (var char of cur) {
            next += rules[char] || char;
        }
        cur = next;
    }
    return cur;
}

function fractal() {
    points = [];
    var x = 0;
    var y = 0;
    var ang = -grammar.direction * (Math.PI / 180);
    var stack = [];
    var th = thickness;
    var col = { r: 128, g: 64, b: 48 };


    const instructions = composer(grammar.atom, grammar.rules, grammar.depth);
    points.push({ x, y, thickness: th, color: { ...col } });

    for (var char of instructions) {
        switch (char) {
            case 'F':
                const newX = x + grammar.length * Math.cos(ang);
                const newY = y + grammar.length * Math.sin(ang);
                points.push({ x: newX, y: newY, thickness: th, color: { ...col } });
                x = newX;
                y = newY;
                break;

            case '+':
                ang += (grammar.angle + Math.random() * grammar.randomness - grammar.randomness / 2) * (Math.PI / 180);
                break;

            case '-':
                ang -= (grammar.angle + Math.random() * grammar.randomness - grammar.randomness / 2) * (Math.PI / 180);
                break;

            case '[':
                stack.push({ x, y, currentAngle: ang, thickness: th, color: { ...col } });
                th *= 0.76;
                if (col.r > 12) {
                    col.r = Math.max(34, col.r - 10);   
                }
                if (col.g < 124) {
                    col.g = Math.min(139, col.g + 10);  
                }
                if (col.b < 12) {
                    col.b = Math.min(34, col.b + 10);  
                }
                break;

            case ']':
                const restoredState = stack.pop();
                x = restoredState.x;
                y = restoredState.y;
                ang = restoredState.currentAngle;
                th = restoredState.thickness;
                col = restoredState.color;
                points.push({ x: null, y: null });  // gap
                points.push({ x, y, thickness: th, color: { ...col } });
                break;
        }
    }
}


function renderer() {
    if (points.length === 0) return;

    const xValues = points.map((p) => p.x).filter((x) => x !== null);
    const yValues = points.map((p) => p.y).filter((y) => y !== null);

    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    const scaleX = (canvas.width - 20) / (maxX - minX);
    const scaleY = (canvas.height - 20) / (maxY - minY);
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (canvas.width - (maxX - minX) * scale) / 2 - minX * scale;
    const offsetY = (canvas.height - (maxY - minY) * scale) / 2 - minY * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";

    for (var i = 1; i < points.length; i++) {

        const cur = points[i];
        const prev = points[i - 1];

        if (cur.x === null && cur.y === null) {
            if (i + 1 < points.length && points[i + 1].x !== null && points[i + 1].y !== null) {
                ctx.moveTo(points[i + 1].x * scale + offsetX, points[i + 1].y * scale + offsetY);
            }
            // gap
            continue;
        }

        if (prev.x !== null && prev.y !== null) {
            ctx.beginPath();
            ctx.moveTo(prev.x * scale + offsetX, prev.y * scale + offsetY);
            ctx.lineTo(cur.x * scale + offsetX, cur.y * scale + offsetY);
            ctx.lineWidth = cur.thickness * scale;
            ctx.strokeStyle = `rgb(${cur.color.r},${cur.color.g},${cur.color.b})`;
            ctx.stroke();
        }
    }
}
