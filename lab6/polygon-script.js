class Polygon {
    constructor(vertices) {
        this.vertices = vertices; // массив объектов Point
    }

    draw(ctx, projection) {
        ctx.beginPath();
        let projectedVertices = this.vertices.map(v => this.project(ctx, v, projection));
        ctx.moveTo(...projectedVertices[0]);
        for (let i = 1; i < projectedVertices.length; i++) {
            ctx.lineTo(...projectedVertices[i]);
        }
        ctx.closePath();
        ctx.stroke();
    }

    project(ctx,vertex, projection) {
        const [x, y, z] = vertex.coordinates;
        const d = 500; // расстояние от камеры
        if (projection === 'perspective') {
            const newX = (x + ctx.canvas.width / 2) * d / (z + d);
            const newY = (y + ctx.canvas.height / 2) * d / (z + d);
            return [newX, newY];
        } else {
            // Аксонометрическая проекция
            const cos30 = Math.sqrt(3) / 2;
            const sin30 = 0.5;

            // Вычисляем новые координаты x' и y'
            let xPrime = (x + ctx.canvas.width / 4) * cos30 + (y + ctx.canvas.height / 4) * cos30;
            let yPrime = (z + d/2) + (y + ctx.canvas.height / 4) * sin30 - (x + ctx.canvas.width / 4) * sin30;

            return [xPrime, yPrime ];
        }

    }
}