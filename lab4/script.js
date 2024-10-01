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

        canvas.addEventListener('click', (event) => {
            pointChecker.disabled = true;
            interChecker.disabled = true;
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

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




        function start_moving_polygon() {
            x = Number(document.getElementById("x_input").value);
            y = Number(document.getElementById("y_input").value);
            move_polygon(x, y);
        }
        function start_moving_polygon_neg() {
            x = -Number(document.getElementById("x_input").value);
            y = -Number(document.getElementById("y_input").value);
            move_polygon(x, y);
        }
        function move_polygon(dx, dy) {
            const translationMatrix = [
                [1, 0, 0],
                [0, 1, 0],
                [dx, dy, 1]
            ];

            polygons = polygons.map(polygon => {
                return polygon.map(point => {
                    const [x, y] = [point.x, point.y];
                    const newPoint = [
                        x * translationMatrix[0][0] + y * translationMatrix[1][0] + translationMatrix[2][0],
                        x * translationMatrix[0][1] + y * translationMatrix[1][1] + translationMatrix[2][1]
                    ];
                    return { x: newPoint[0], y: newPoint[1] };
                });
            });
            drawPolygons();
        }
		function find_center(polygons)
		{
			let sumX = 0, sumY = 0;
			polygons[0].forEach(point => {sumX += point.x; sumY+=point.y;});
			return  [Math.round(sumX / polygons[0].length), Math.round(sumY / polygons[0].length)];
		}
        function start_turning_polygon() {
            angle = Number(document.getElementById("angle_input").value);
			let center_x = find_center(polygons)[0];
			let center_y = find_center(polygons)[1];
            turn_polygon(angle, center_x, center_y);
        }
        function start_turning_polygon_back() {
            angle = Number(document.getElementById("angle_input").value);
			let center_x = find_center(polygons)[0];
			let center_y = find_center(polygons)[1];
            turn_polygon_back(angle, center_x, center_y);
        }
        function start_turning_around_user_dot() {
            x_coord = Number(document.getElementById("x_coord_input").value);
            y_coord = Number(document.getElementById("y_coord_input").value);
            angle = Number(document.getElementById("angle_input").value);
            turn_polygon(angle, x_coord, y_coord);
        }
        function start_turning_back_around_user_dot() {
            x_coord = Number(document.getElementById("x_coord_input").value);
            y_coord = Number(document.getElementById("y_coord_input").value);
            angle = Number(document.getElementById("angle_input").value);
            turn_polygon_back(angle, x_coord, y_coord);
        }
        function start_scaling_polygon() {
            kx = Number(document.getElementById("x_scale_input").value);
            ky = Number(document.getElementById("y_scale_input").value);
			let center_x = find_center(polygons)[0];
			let center_y = find_center(polygons)[1];
            scale_polygon(kx, ky, center_x, center_y);
        }
        function start_scaling_back_polygon() {
            kx = Number(document.getElementById("x_scale_input").value);
            ky = Number(document.getElementById("y_scale_input").value);
			let center_x = find_center(polygons)[0];
			let center_y = find_center(polygons)[1];
            scale_polygon_back(kx, ky, center_x, center_y);
        }
        function start_scaling_polygon_around_user_dot() {
            kx = Number(document.getElementById("x_scale_input").value);
            ky = Number(document.getElementById("y_scale_input").value);
            X = Number(document.getElementById("x_coord_scale_input").value);
            Y = Number(document.getElementById("y_coord_scale_input").value);
            scale_polygon(kx, ky, X, Y);
        }
        function start_scaling_back_polygon_around_user_dot() {
            kx = Number(document.getElementById("x_scale_input").value);
            ky = Number(document.getElementById("y_scale_input").value);
            X = Number(document.getElementById("x_coord_scale_input").value);
            Y = Number(document.getElementById("y_coord_scale_input").value);
            scale_polygon_back(kx, ky, X, Y);
        }
        function turn_polygon(angle, X, Y) {
            const cos = Math.cos(angle * Math.PI / 180);
            const sin = Math.sin(angle * Math.PI / 180);
            const rotationMatrix = [
                [cos, -sin, 0],
                [sin, cos, 0],
                [0, 0, 1]
            ];

            polygons = polygons.map(polygon => {
                return polygon.map(point => {
                    const x = point.x - X;
                    const y = point.y - Y;
                    const newPoint = [
                        x * rotationMatrix[0][0] + y * rotationMatrix[1][0] + rotationMatrix[2][0] + X,
                        x * rotationMatrix[0][1] + y * rotationMatrix[1][1] + rotationMatrix[2][1] + Y
                    ];
                    return { x: newPoint[0], y: newPoint[1] };
                });
            });
            drawPolygons();
			drawPoint(X, Y);
        }
        function turn_polygon_back(angle, X, Y) {
            const cos = Math.cos(angle * Math.PI / 180);
            const sin = Math.sin(angle * Math.PI / 180);
            const rotationMatrix = [
                [cos, sin, 0],
                [-sin, cos, 0],
                [0, 0, 1]
            ];

            polygons = polygons.map(polygon => {
                return polygon.map(point => {
                    const x = point.x - X;
                    const y = point.y - Y;
                    const newPoint = [
                        x * rotationMatrix[0][0] + y * rotationMatrix[1][0] + rotationMatrix[2][0] + X,
                        x * rotationMatrix[0][1] + y * rotationMatrix[1][1] + rotationMatrix[2][1] + Y
                    ];
                    return { x: newPoint[0], y: newPoint[1] };
                });
            });
            drawPolygons();
			drawPoint(X, Y);
        }
        function scale_polygon(kx, ky, X, Y) {
            const scaleMatrix = [
                [1 / kx, 0, 0],
                [0, 1 / ky, 0],
                [0, 0, 1]
            ];

            polygons = polygons.map(polygon => {
                return polygon.map(point => {
                    const x = point.x - X;
                    const y = point.y - Y;
                    const newPoint = [
                        x * scaleMatrix[0][0] + y * scaleMatrix[1][0] + scaleMatrix[2][0] + X,
                        x * scaleMatrix[0][1] + y * scaleMatrix[1][1] + scaleMatrix[2][1] + Y
                    ];
                    return { x: newPoint[0], y: newPoint[1] };
                });
            });
            drawPolygons();
        }
        function scale_polygon_back(kx, ky, X, Y) {
            const scaleMatrix = [
                [kx, 0, 0],
                [0, ky, 0],
                [0, 0, 1]
            ];

            polygons = polygons.map(polygon => {
                return polygon.map(point => {
                    const x = point.x - X;
                    const y = point.y - Y;
                    const newPoint = [
                        x * scaleMatrix[0][0] + y * scaleMatrix[1][0] + scaleMatrix[2][0] + X,
                        x * scaleMatrix[0][1] + y * scaleMatrix[1][1] + scaleMatrix[2][1] + Y
                    ];
                    return { x: newPoint[0], y: newPoint[1] };
                });
            });
            drawPolygons();
        }

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


        function isPointInPolygon(point) {
            let x = point[0], y = point[1];
            polygon = polygons[polygons.length - 1];
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



        pointChecker.addEventListener('click', () => {
            checkPoly();
            document.getElementById("res").innerHTML += `<br>Точка внутри последнего полигона:${isPointInPolygon([CheckX, CheckY])}<br>`;


        })
        interChecker.addEventListener('click', () => {
            intersectionDrawer();
        })
