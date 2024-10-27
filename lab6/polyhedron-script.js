class Polyhedron {
    constructor(polygons) {
        this.polygons = polygons; // массив объектов Polygon
    }

    draw(ctx, projection) {
        this.polygons.forEach(polygon => polygon.draw(ctx, projection));
    }

    reflect(axis) {
        const c = 0;//90
        const s = 1;
        let matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        if (axis === 'x') matrix = [[1, 0, 0], [0, c, -s], [0, s, c]];
        else if (axis === 'y') matrix = [[c, 0, s], [0, 1, 0], [-s, 0, c]];
        else if (axis === 'z') matrix = [[c, -s, 0], [s, c, 0], [0, 0, 1]];
        this.polygons.forEach(polygon => {
            polygon.vertices=this.multiplyMatrices(polygon.vertices,matrix);
        });
    }

    scale(factor) {
        const center = this.getCenter();
        this.polygons.forEach(polygon => {
            polygon.vertices.forEach(vertex => {
                vertex.coordinates = vertex.coordinates.map((coord, idx) => center[idx] + (coord - center[idx]) * factor);
            });
        });
    }

    getCenter() {
        const allVertices = this.polygons.flatMap(polygon => polygon.vertices);
        const sum = allVertices.reduce((acc, vertex) => {
            acc[0] += vertex.coordinates[0];
            acc[1] += vertex.coordinates[1];
            acc[2] += vertex.coordinates[2];
            return acc;
        }, [0, 0, 0]);
        return sum.map(coord => coord / allVertices.length);
    }

    multiplyMatrices(vertices, matrix) {
        // Проверка совместимости размеров матриц
        const result = [];
        let buf;
        for (let i = 0; i < vertices.length; i++) {
            buf=[];
    
            for (let j = 0; j < vertices[0].coordinates.length; j++) {
                let sum = 0;
    
                for (let k = 0; k < matrix[0].length; k++) {
                    sum += vertices[i].coordinates[k] * matrix[k][j];
                }
    
                buf[j] = sum;
            }
            result[i]=new Point(buf[0],buf[1],buf[2]);
        }
    
        return result;
    }
}
