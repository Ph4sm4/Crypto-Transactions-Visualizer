export namespace TransactionRenderer {
	export interface Point {
		x: number;
		y: number;
		radius?: number;
	}

	const colors = [
		'rgba(26, 255, 26, 0.3)', // Green
		'rgba(102, 255, 102, 0.3)', // Light Green
		'rgba(204, 255, 204, 0.3)', // Pale Green
		'rgba(255, 204, 204, 0.3)', // Light Red
		'rgba(255, 102, 102, 0.3)', // Red
		'rgba(255, 26, 26, 0.3)', // Dark Red
	];

	function getTransactionValueColor(transactionValue: number) {
		let color;

		if (transactionValue <= 200) {
			color = colors[0]; // Green
		} else if (transactionValue <= 400) {
			color = colors[1]; // Light Green
		} else if (transactionValue <= 600) {
			color = colors[2]; // Pale Green
		} else if (transactionValue <= 1200) {
			color = colors[3]; // Light Red
		} else if (transactionValue <= 1600) {
			color = colors[4]; // Red
		} else {
			color = colors[5]; // Dark Red
		}

		return color;
	}

	export function paintCurveBetweenPoints(
		ctx: CanvasRenderingContext2D,
		pointA: Point,
		pointB: Point,
		viewOffset: Point,
		curveDirection: 'up' | 'down',
		transactionValue: number
	) {
		if (!ctx) return;
		// Set up the context and style for drawing
		// ctx.setTransform(zoom, 0, 0, zoom, canvas.width, canvas.height);

		ctx.beginPath();
		ctx.strokeStyle = getTransactionValueColor(transactionValue);
		ctx.lineWidth = transactionValue / 100;

		let copyA: Point = { ...pointA };
		let copyB: Point = { ...pointB }; // otherwise the initial coordinates of nodes are gonna change

		copyA.x -= viewOffset.x;
		copyA.y -= viewOffset.y;

		copyB.x -= viewOffset.x;
		copyB.y -= viewOffset.y;

		const controlPointOnLeft: boolean = copyA.x < copyB.x;
		const controlXOffset: number = 200; // how far to left/right is the controlx

		//  control point for the first quadratic Bezier curve
		const controlPointX =
			copyA.x +
			(controlPointOnLeft
				? Math.min(controlXOffset, Math.abs(copyA.x - copyB.x))
				: Math.max(-controlXOffset, -Math.abs(copyA.x - copyB.x)));
		const controlPointY =
			copyA.y +
			(curveDirection == 'down'
				? copyA.y < copyB.y
					? Math.abs(copyA.y - copyB.y)
					: -Math.abs(copyA.y - copyB.y)
				: 0);

		ctx.moveTo(copyA.x, copyA.y);

		ctx.quadraticCurveTo(controlPointX, controlPointY, copyB.x, copyB.y);

		ctx.stroke();

		ctx.lineWidth = 1;
		ctx.strokeStyle = 'black';
	}

	export function paintCircle(
		ctx: CanvasRenderingContext2D,
		pointA: Point,
		viewOffset: Point,
		radius?: number,
		type?: 'incoming' | 'outgoing' | 'wallet'
	) {
		if (!ctx || !pointA.radius) return;

		ctx.beginPath();
		ctx.arc(
			pointA.x - viewOffset.x,
			pointA.y - viewOffset.y,
			radius ? radius : pointA.radius,
			0,
			2 * Math.PI
		);
		// '#FFF933' - yellow

		switch (type) {
			case 'incoming': {
				ctx.fillStyle = '#33E9FF';
				break;
			}
			case 'outgoing': {
				ctx.fillStyle = '#DA33FF';
				break;
			}
			case 'wallet': {
				ctx.fillStyle = '#FFF933';
				break;
			}
		}

		ctx.fill();

		ctx.stroke();

		ctx.strokeStyle = 'black';
		ctx.lineWidth = 1;
	}

	export function paintText(
		ctx: CanvasRenderingContext2D,
		text: string,
		point: Point,
		color: string,
		viewOffset: Point,
		fontSize?: number
	) {
		if (!ctx) return;

		ctx.fillStyle = color;
		ctx.font = `${fontSize}px Arial`;

		ctx.fillText(
			text,
			point.x - viewOffset.x - text.length * 2.5 - ((fontSize || 0) % 12) * 2,
			point.y - viewOffset.y
		);
		// ctx.strokeText(text, x, y) to draw the text outline instead of filling

		ctx.font = '12px Arial';

		ctx.strokeStyle = 'black';
		ctx.lineWidth = 1;
	}

	export function paintStraightLine(
		ctx: CanvasRenderingContext2D,
		pointA: Point,
		pointB: Point,
		color: string,
		lineWidth: number = 1
	) {
		if (!ctx) return;

		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;

		ctx.moveTo(pointA.x, pointA.y);
		ctx.lineTo(pointB.x, pointB.y);

		ctx.stroke();

		// Reset the context to default values
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 1;
	}
}
