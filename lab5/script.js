const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let polygons = [];
let currentPoints = [];
canvas.height = 600;
canvas.width = window.innerWidth - 20;

let pointChecker = document.getElementById('check');
pointChecker.disabled = true;
let interChecker = document.getElementById("intersect");
interChecker.disabled = true;

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    document.getElementById("res").innerHTML = `${x} ${y}`;
})
canvas.addEventListener('click', (event) => {
    if (polygons.length < 2) {
        pointChecker.disabled = true;
        interChecker.disabled = true;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        // document.getElementById("res").innerHTML = `${x} ${y}`;

        currentPoints.push({ x, y });
        if (polygons.length != 0 && currentPoints.length === 1) {
            pointChecker.disabled = false;
            CheckX = x;
            CheckY = y;

        }

        if (polygons.length != 0 && currentPoints.length === 2) {
            interChecker.disabled = false;
            InterX1 = CheckX;
            InterY1 = CheckY;
            InterX2 = x;
            InterY2 = y;
        }
        drawPolygons();
    }

});

canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    if (currentPoints.length > 2) {
        polygons.push(currentPoints);
        currentPoints = [];
    }
    drawPolygons();
});

function drawPolygons() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    polygons.forEach(polygon => {
        ctx.beginPath();
        drawPoint(polygon[0].x, polygon[0].y);
        ctx.moveTo(polygon[0].x, polygon[0].y);
        for (let j = 1; j < polygon.length; j++) {
            ctx.lineTo(polygon[j].x, polygon[j].y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'blue';
        ctx.fillStyle = 'rgba(0, 0, 255, 0.4)';
        ctx.stroke();
        ctx.fill();
    });
    currentPoints.forEach(point => drawPoint(point.x, point.y));
    for (let i = 1; i < currentPoints.length; i += 1) {
        drawLine(currentPoints[i - 1], currentPoints[i]);
    }
}


function drawPoint(x, y) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fill();
}

function drawLine(point1, point2) {
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.strokeStyle = 'green';
    ctx.stroke();
}

document.getElementById('clear').addEventListener('click', () => {
    polygons = [];
    currentPoints = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});


function checkPoly() {
    document.getElementById("res").innerHTML = "";
    lastPoly = polygons[polygons.length - 1];
    for (i = 1; i <= lastPoly.length - 1; i++) {
        var curX = lastPoly[i].x - lastPoly[i - 1].x;
        var curY = lastPoly[i].y - lastPoly[i - 1].y;
        var curChechX = CheckX - lastPoly[i - 1].x;
        var curChechY = CheckY - lastPoly[i - 1].y;
        formula = curChechY * curX - curChechX * curY;
        formula2 = CheckY * lastPoly[i].x - CheckX * lastPoly[i].y;
        // console.log(`${formula}`);
        if (formula > 0) {
            console.log("r");
            document.getElementById("res").innerHTML += `ребро${i}:справа<br/>`;
        }
        else {
            console.log("l");
            document.getElementById("res").innerHTML += `ребро${i}: слева<br/>`;
        }

    }
    lastX = lastPoly[0].x - lastPoly[lastPoly.length - 1].x;
    lastY = lastPoly[0].y - lastPoly[lastPoly.length - 1].y;
    lastCheckX = CheckX - lastPoly[lastPoly.length - 1].x;
    lastCheckY = CheckY - lastPoly[lastPoly.length - 1].y;

    formula3 = lastCheckY * lastX - lastCheckX * lastY;
    // console.log(`${formula3}`);
    if (formula3 > 0) {
        console.log("r");
        document.getElementById("res").innerHTML += `ребро${i}:справа<br/>`;
    }
    else {
        console.log("l");
        document.getElementById("res").innerHTML += `ребро${i}: слева<br/>`;
    }


}


function isPointInPolygon(poly, point) {
    let x = point[0], y = point[1];
    polygon = poly;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i].x, yi = polygon[i].y;
        let xj = polygon[j].x, yj = polygon[j].y;

        let intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}
function intersectionDrawer() {
    polygon = polygons[polygons.length - 1];
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i].x, yi = polygon[i].y;
        let xj = polygon[j].x, yj = polygon[j].y;

        interInfo = find_intersection(InterX1, InterY1, InterX2, InterY2, xi, yi, xj, yj);

        if (interInfo != null) {
            x = interInfo[0];
            y = interInfo[1];
            drawPoint(x, y);
        }


    }
}

function find_intersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    const a1 = y2 - y1;
    const b1 = x1 - x2;
    const c1 = a1 * x1 + b1 * y1;

    const a2 = y4 - y3;
    const b2 = x3 - x4;
    const c2 = a2 * x3 + b2 * y3;

    const determinant = a1 * b2 - a2 * b1;

    if (determinant === 0) {
        return null;
    } else {
        const x = (b2 * c1 - b1 * c2) / determinant;
        const y = (a1 * c2 - a2 * c1) / determinant;

        if (isPointOnSegment(x, y, x1, y1, x2, y2) && isPointOnSegment(x, y, x3, y3, x4, y4)) {
            return [x, y];
        } else {
            return null;
        }
    }
}

function isPointOnSegment(x, y, x1, y1, x2, y2) {
    if (
        Math.min(x1, x2) <= x &&
        x <= Math.max(x1, x2) &&
        Math.min(y1, y2) <= y &&
        y <= Math.max(y1, y2)
    ) {
        return true;
    } else {
        return false;
    }
}

function findPolygonsIntersection() {
    var newpoly1 = new Map();
    var newpoly2 = new Map();
    var firstPoly = polygons[0];
    var secondPoly = polygons[1];
    var intersections = new Map();
    var check = [];
    var inner1 = [];
    var inner2 = [];
    inner1.x = 0;
    inner1.y = 0;
    inner2.x = 0;
    inner2.y = 0;
    for (let i = 1, j = 0, cnt = 0; cnt < firstPoly.length; j = i++, i = i % firstPoly.length, cnt++) {
        let xi = firstPoly[i].x, yi = firstPoly[i].y;
        let xj = firstPoly[j].x, yj = firstPoly[j].y;
        if (isPointInPolygon(secondPoly, [xj, yj])) {
            x = xj;
            y = yj;
            inner1.push({ x, y });
        }
        newpoly1.set(xj, yj);
        // console.log({ xj, yj });
        for (let k = 1, l = 0, cnt = 0; cnt < secondPoly.length; l = k++, k = k % secondPoly.length, cnt++) {
            let xk = secondPoly[k].x, yk = secondPoly[k].y;
            let xl = secondPoly[l].x, yl = secondPoly[l].y;
            interInfo = find_intersection(xi, yi, xj, yj, xl, yl, xk, yk);

            if (interInfo != null) {
                x = interInfo[0];
                y = interInfo[1];
                newpoly1.set(x, y);

                intersections.set(Math.round(x), Math.round(y));
                // console.log(`${Math.round(x)},${Math.round(y)}`);
                drawPoint(x, y);
            }

        }
    }
    for (let i = 1, j = 0, cnt = 0; cnt < secondPoly.length; j = i++, i = i % secondPoly.length, cnt++) {
        let xi = secondPoly[i].x, yi = secondPoly[i].y;
        let xj = secondPoly[j].x, yj = secondPoly[j].y;
        if (isPointInPolygon(firstPoly, [xj, yj])) {
            x = xj;
            y = yj;
            inner2.push({ x, y });
        }
        newpoly2.set(xj, yj);
        // console.log({ xj, yj });
        for (let k = 1, l = 0, cnt = 0; cnt < firstPoly.length; l = k++, k = k % firstPoly.length, cnt++) {
            let xk = firstPoly[k].x, yk = firstPoly[k].y;
            let xl = firstPoly[l].x, yl = firstPoly[l].y;
            interInfo = find_intersection(xi, yi, xj, yj, xl, yl, xk, yk);

            if (interInfo != null) {
                x = interInfo[0];
                y = interInfo[1];
                newpoly2.set(x, y);
                intersections.set(Math.round(x), Math.round(y));
                // console.log(`${Math.round(x)},${Math.round(y)}`);
                drawPoint(x, y);
            }

        }
    }

    // console.log(firstPoly);
    // console.log(secondPoly);

    firstPoly = [];
    secondPoly = [];

    // console.log(newpoly1);
    // console.log(newpoly2);

    newpoly1.forEach((value, key, map) => {
        x = Math.round(key);
        y = Math.round(value);
        firstPoly.push({ x, y })
    });

    newpoly2.forEach((value, key, map) => {
        x = Math.round(key);
        y = Math.round(value);
        secondPoly.push({ x, y });
    });
    console.log(firstPoly);
    console.log(secondPoly);

    intersections.forEach((y, x, map) => {
        check.push({ x, y });
    })

    // console.log(check);
    // console.log(inner1);
    // console.log(inner2);

    f = false;
    // if (inner1.length !== 0) {
    //     x = inner1[0].x;
    //     y = inner1[0].y;
    //     // ctx.moveTo(x, y);
    //     console.log(`${x},${y}`);
    //     cnt = 0;
    //     i = firstPoly.findIndex(el => el.x === x && el.y === y);
    //     j = 0;
    //     while (true) {
    //         i++;
    //         cnt++;
    //         fx = firstPoly[i].x;
    //         fy = firstPoly[i].y;
    //         console.log(`${fx},${fy}`);
    //         if (check.some(el => el.x === fx && el.y === fy)) {
    //             j = secondPoly.findIndex(el => el.x === fx && el.y === fy);
    //             while (true) {
    //                 j++;
    //                 cnt++;
    //                 sx = secondPoly[j].x;
    //                 sy = secondPoly[j].y;
    //                 console.log(`${sx},${sy}`);
    //                 if (check.some(el => el.x === sx && el.y === sy)) {
    //                     i = firstPoly.findIndex(el => el.x === sx && el.y === sy);

    //                     break;
    //                 }

    //             }
    //         }
    //         if (cnt === Math.max(firstPoly.length, secondPoly.length)) {
    //             break;
    //         }
    //     }
    // } else {
    //     if (inner2.length !== 0) {
    //         ctx.moveTo(inner2[0].x, inner2[0].y);
    //     }
    //     else {
    //         ctx.moveTo(firstPoly[0].x, firstPoly[0].y);
    //     }
    // }

    ctx.beginPath();
    ctx.moveTo(firstPoly[0].x, firstPoly[0].y);
    firstPoly.forEach(element => {
        ctx.lineTo(element.x, element.y);
    });
    ctx.closePath();
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'rgba(255, 255, 0 , 0.4)';
    ctx.stroke();
    ctx.fill();
}


pointChecker.addEventListener('click', () => {
    checkPoly();
    document.getElementById("res").innerHTML += `<br>Точка внутри последнего полигона:${isPointInPolygon([CheckX, CheckY])}<br>`;


})
interChecker.addEventListener('click', () => {
    intersectionDrawer();
})

document.getElementById("polys").addEventListener("click", () => {
    findPolygonsIntersection();
})
