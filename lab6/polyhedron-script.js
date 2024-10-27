class Polyhedron {
    constructor(polygons) {
        this.polygons = polygons; // массив объектов Polygon
    }

    draw(ctx, projection) {
        this.polygons.forEach(polygon => polygon.draw(ctx, projection));
    }

    reflect(axis) {
        this.polygons.forEach(polygon => {
            polygon.vertices.forEach(vertex => {
                if (axis === 'x') vertex.coordinates[0] = -vertex.coordinates[0];
                else if (axis === 'y') vertex.coordinates[1] = -vertex.coordinates[1];
                else if (axis === 'z') vertex.coordinates[2] = -vertex.coordinates[2];
            });
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
}
