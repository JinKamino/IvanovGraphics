const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function drawBresenham(x0, y0, x1, y1) {
    if (x0>x1){
        let t=x0;
        x0=x1;
        x1=t;
    }
    if (y0 > y1) {
        let t = y0;
        y0 = y1;
        y1 = t;
    }
    const dx = x1 - x0;
    const dy = y1 - y0;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const sx = (dx > 0) ? 1 : -1;
    const sy = (dy > 0) ? 1 : -1;
    let err = 0;
    let deltaErr=absDy+1;
    y=y0; 
    while (x0<=x1 && y0<=y1) {
        ctx.fillRect(x0, y0, 1, 1);
        
        if (x0 === x1 && y0 === y1) break;
        const e2 = err * 2;
        if (e2 > -absDy) {
            err -= absDy;
            x0 += sx;
        }
        if (e2 < absDx) {
            err += absDx;
            y0 += sy;
        }
    }
}

function drawWu(x0, y0, x1, y1) {
    if (x0 > x1) {
        let t = x0;
        x0 = x1;
        x1 = t;
    }
    if (y0 > y1) {
        let t = y0;
        y0 = y1;
        y1 = t;
    }
    const dx = x1 - x0;
    const dy = y1 - y0;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const sx = (dx > 0) ? 1 : -1;
    const sy = (dy > 0) ? 1 : -1;
    let err = 0;
    let deltaErr = absDy + 1;
    y = y0;
    while (x0 <= x1 && y0 <= y1) {
        ctx.fillRect(x0, y0, 1, 1);
        if (Math.abs(dx/dy)<0.5){
         ctx.fillRect(x0, y0+1, 1, 1);
        }
        else {ctx.fillRect(x0+1, y0, 1, 1);}
        if (x0 === x1 && y0 === y1) break;
        const e2 = err * 2;
        if (e2 > -absDy) {
            err -= absDy;
            x0 += sx;
        }
        if (e2 < absDx) {
            err += absDx;
            y0 += sy;
        }
    }
}

// Пример использования алгоритмов:
drawBresenham(150, 50, 150, 250); // Рисуем отрезок Брезенхема
drawWu(250, 50, 300, 250); // Рисуем отрезок ВУ