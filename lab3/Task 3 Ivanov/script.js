function hex_to_rgba(hex_color) {
    // Удаляем символ # из шестнадцатеричного значения цвета
    hex_color = hex_color.replace("#", "");

    // Разбиваем шестнадцатеричное значение на отдельные компоненты цвета
    var r = parseInt(hex_color.substring(0, 2), 16);
    var g = parseInt(hex_color.substring(2, 4), 16);
    var b = parseInt(hex_color.substring(4, 6), 16);

    return [r, g, b];
}

function up() {
    // ctx.beginPath();
    // ctx.moveTo(x1,y1);
    var lx, lr, lg, lb, rx, rr, rg, rb, r, g, b;
    y = y1;

    while (y <= y2) {
        y += 1;
        //две нижние точки на одной высоте
        if (y2 === y3) {
            lx = x1 + (y - y1) / (y2 - y1) * (x2 - x1);
            lr = r1 + (y - y1) / (y2 - y1) * (r2 - r1);
            lg = g1 + (y - y1) / (y2 - y1) * (g2 - g1);
            lb = b1 + (y - y1) / (y2 - y1) * (b2 - b1);

            rx = x1 + (y - y1) / (y3 - y1) * (x3 - x1);
            rr = r1 + (y - y1) / (y3 - y1) * (r3 - r1);
            rg = g1 + (y - y1) / (y3 - y1) * (g3 - g1);
            rb = b1 + (y - y1) / (y3 - y1) * (b3 - b1);

        } else {
            //средняя по высоте точка точка правее самой нижней

            rx = x1 + (y - y1) / (y2 - y1) * (x2 - x1);
            rr = r1 + (y - y1) / (y2 - y1) * (r2 - r1);
            rg = g1 + (y - y1) / (y2 - y1) * (g2 - g1);
            rb = b1 + (y - y1) / (y2 - y1) * (b2 - b1);

            lx = x1 + (y - y1) / (y2 - y1) * (mid   - x1);
            lr = r1 + (y - y1) / (y2 - y1) * (mid_r - r1);
            lg = g1 + (y - y1) / (y2 - y1) * (mid_g - g1);
            lb = b1 + (y - y1) / (y2 - y1) * (mid_b - b1);

            //средняя точка левее самой нижней
            if (x3 > x2) {
                [lx, rx] = [rx, lx];
                [lr, rr] = [rr, lr];
                [lg, rg] = [rg, lg];
                [lb, rb] = [rb, lb];
            }
        }
        // ctx.beginPath();
        // ctx.moveTo(lx, y);
        if (lx > rx) {
            [lx, rx] = [rx, lx];
            [lr, rr] = [rr, lr];
            [lg, rg] = [rg, lg];
            [lb, rb] = [rb, lb];
        }
        for (i = lx; i <= rx; i += 0.1) {
            r = lr + (i - lx) / (rx - lx) * (rr - lr);
            g = lg + (i - lx) / (rx - lx) * (rg - lg);
            b = lb + (i - lx) / (rx - lx) * (rb - lb);
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(i, y, 1, 1);
        }
        // ctx.stroke();
    }
}


function low() {

    var lx, lr, lg, lb, rx, rr, rg, rb, r, g, b;
    y = y2;

    while (y <= y3) {

        y += 1;
        //средняя точка по высоте правее чем нижняя
        if (x2 > x3) {
            lx = mid + (y - y2) / (y3 - y2) * (x3 - mid);
            lr = mid_r + (y - y2) / (y3 - y2) * (r3 - mid_r);
            lg = mid_g + (y - y2) / (y3 - y2) * (g3 - mid_g);
            lb = mid_b + (y - y2) / (y3 - y2) * (b3 - mid_b);

            rx = x2 + (y - y2) / (y3 - y2) * (x3 - x2);
            rr = r2 + (y - y2) / (y3 - y2) * (r3 - r2);
            rg = g2 + (y - y2) / (y3 - y2) * (g3 - g2);
            rb = b2 + (y - y2) / (y3 - y2) * (b3 - b2);
        } else {
            //средняя точка левее чем
            lx = x2 + (y - y2) / (y3 - y2) * (x3 - x2);
            lr = r2 + (y - y2) / (y3 - y2) * (r3 - r2);
            lg = g2 + (y - y2) / (y3 - y2) * (g3 - g2);
            lb = b2 + (y - y2) / (y3 - y2) * (b3 - b2);

            rx = mid + (y - y2) / (y3 - y2) * (x3 - mid);
            rr = mid_r + (y - y2) / (y3 - y2) * (r3 - mid_r);
            rg = mid_g + (y - y2) / (y3 - y2) * (g3 - mid_g);
            rb = mid_b + (y - y2) / (y3 - y2) * (b3 - mid_b);
        }

        if (lx>rx) {
            [lx, rx] = [rx, lx];
            [lr, rr] = [rr, lr];
            [lg, rg] = [rg, lg];
            [lb, rb] = [rb, lb];
        }
        for (i = lx; i <= rx; i += 0.1) {
            r = lr + (i - lx) / (rx - lx) * (rr - lr);
            g = lg + (i - lx) / (rx - lx) * (rg - lg);
            b = lb + (i - lx) / (rx - lx) * (rb - lb);
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(i, y, 1, 1);
        }

    }
}

var triangle = document.getElementById("triangle");
var ctx = triangle.getContext("2d");
var color1 = document.getElementById("P1_color");
var color2 = document.getElementById("P2_color");
var color3 = document.getElementById("P3_color");
var drawButton = document.getElementById("submit");
var clearButton = document.getElementById("clear");

triangle.width = 500;
triangle.height = 500;
// ctx.fillStyle = "black";
// ctx.fillRect(0, 0, triangle.width, triangle.height);
var r1, g1, b1, r2, g2, b2, r3, g3, b3;
var mid, mid_r, mid_g, mid_b;
var x1, x2, x3, y1, y2, y3;

drawButton.onclick = function () {
    r1 = hex_to_rgba(color1.value)[0];
    g1 = hex_to_rgba(color1.value)[1];
    b1 = hex_to_rgba(color1.value)[2];

    r2 = hex_to_rgba(color2.value)[0];
    g2 = hex_to_rgba(color2.value)[1];
    b2 = hex_to_rgba(color2.value)[2];

    r3 = hex_to_rgba(color3.value)[0];
    g3 = hex_to_rgba(color3.value)[1];
    b3 = hex_to_rgba(color3.value)[2];

    x1 = parseInt(document.getElementById("p1x").value);
    y1 = parseInt(document.getElementById("p1y").value);
    x2 = parseInt(document.getElementById("p2x").value);
    y2 = parseInt(document.getElementById("p2y").value);
    x3 = parseInt(document.getElementById("p3x").value);
    y3 = parseInt(document.getElementById("p3y").value);


    if (y1 > y2) {
        [x1, x2] = [x2, x1];
        [y1, y2] = [y2, y1];
        [r1, r2] = [r2, r1];
        [g1, g2] = [g2, g1];
        [b1, b2] = [b2, b1];
    }
    if (y1 > y3) {
        [x1, x3] = [x3, x1];
        [y1, y3] = [y3, y1];
        [r1, r3] = [r3, r1];
        [g1, g3] = [g3, g1];
        [b1, b3] = [b3, b1];
    }
    if (y2 > y3) {
        [x3, x2] = [x2, x3];
        [y3, y2] = [y2, y3];
        [r2, r3] = [r3, r2];
        [g2, g3] = [g3, g2];
        [b2, b3] = [b3, b2];
    }

    mid = x1 + (y2 - y1) / (y3 - y1) * (x3 - x1);
    mid_r = r1 + (y2 - y1) / (y3 - y1) * (r3 - r1);
    mid_g = g1 + (y2 - y1) / (y3 - y1) * (g3 - g1);
    mid_b = b1 + (y2 - y1) / (y3 - y1) * (b3 - b1);

    // ctx.fillStyle = "green";
    // ctx.fillRect(x1, y1, 5, 5);
    // ctx.fillRect(x2, y2, 5, 5);
    // ctx.fillRect(x3, y3, 5, 5);
    // ctx.fillStyle = "red";
    // ctx.fillRect(mid, y2, 5, 5);
    // ctx.fillStyle = "black";
    // ctx.fillRect(0, 0, triangle.width, triangle.height);
    up();
    low();

}
clearButton.onclick = function () {
    ctx.clearRect(0, 0, triangle.width, triangle.height);
}

