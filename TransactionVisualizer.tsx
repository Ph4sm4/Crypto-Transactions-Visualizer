'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
	RendererData,
	RendererNode,
	getIncomingNodes,
	getOutgoingNodes,
	getWalletNodeIndex,
} from './data';
import { TransactionRenderer } from './TransactionRenderer';

type Props = {
	width: number;
	height: number;
	data: RendererData;
};

export default function TransactionVisualizer({ width, height, data }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Variables for managing view (panning)
	const [viewOffset, setViewOffset] = useState<TransactionRenderer.Point>({
		x: 0,
		y: 0,
	});

	const throttledRender = throttle(renderGraphData, 10);

	const [throttleTimeout, setThrottleTimeout] = useState<NodeJS.Timeout | null>(null);

	function throttle(cb: Function, delay: number) {
		return (...args: any) => {
			if (throttleTimeout == null) {
				cb(...args);
				setThrottleTimeout(
					setTimeout(() => {
						setThrottleTimeout(null);
					}, delay)
				);
			}
		};
	}

	useEffect(() => {
		renderGraphData();
	}, []);

	function renderGraphData() {
		const outgoingNodes = getOutgoingNodes(data);
		const incomingNodes = getIncomingNodes(data);
		const walletNode: RendererNode = data.nodes[getWalletNodeIndex(data)];

		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const circleRadius: number = 10;

		// set the coords in order to enable mouse movements
		if (!walletNode.x) walletNode.x = width / 2 - 10;
		if (!walletNode.y) walletNode.y = height / 2 - 10;
		if (!walletNode.radius) walletNode.radius = circleRadius;

		const incomingLen: number = incomingNodes.length;
		const outgoingLen: number = outgoingNodes.length;
		const nodeSpacing: number = 80;

		const numberOfVerticalLines: number = 25;
		const numberOfHorizontalLines: number = 10;
		const gridLineColor: string = 'rgba(255, 255, 255, 0.2)';

		for (let i = 0; i < numberOfVerticalLines; i++) {
			// draw vertical lines for the background grid
			TransactionRenderer.paintStraightLine(
				ctx,
				{
					x: 0 + (width / numberOfVerticalLines) * i,
					y: 0,
				},
				{
					x: 0 + (width / numberOfVerticalLines) * i,
					y: height,
				},
				gridLineColor,
				1
			);
		}
		for (let i = 0; i < numberOfHorizontalLines; i++) {
			// draw horizontal lines for the background grid
			TransactionRenderer.paintStraightLine(
				ctx,
				{
					x: 0,
					y: 0 + (height / numberOfHorizontalLines) * i,
				},
				{
					x: width,
					y: 0 + (height / numberOfHorizontalLines) * i,
				},
				gridLineColor,
				1
			);
		}

		// render each of the nodes and the corresponding line to the wallet node
		incomingNodes.forEach((node: RendererNode, index: number) => {
			const pointX: number = walletNode.x - 200; // incoming nodes are initially 200 px to the left
			const pointY: number = walletNode.y + (incomingLen / 2) * nodeSpacing - index * nodeSpacing;

			/* y point calculation

      lets say incomingNodes are of length 7
      then it will display half of the nodes above the wallet node
      and half of them below

      everything with a proper node spacing

      */

			// we dont want to override them after the first render - cause movement will not work
			if (!node.x) node.x = pointX;
			if (!node.y) node.y = pointY;
			if (!node.radius) node.radius = circleRadius;

			/* line drawing is split into 2 parts, as it is needed to have 2 'bumps' one at the start of the line and one at the end
        in order to achieve this effect we need to have an additional point halfway through the main line to and from which
        we are gonna be connecting our splitted lines

        so the structure is: startNode -> halfwayInvisiblePoint -> endNode


        ! IMPORTANT
        * RENDERING MUST BE DONE IN ORDER:
          1) THE LINES
          2) THE CIRCLES
          3) THE TEXT

          as the stacking order is being determined based on whichever element is rendered first
          and we do not want any lines appearing on top of the circles

      */

			// draw the first curve line to create the 'bump effect', startNode -> halfwayInvisiblePoint
			TransactionRenderer.paintCurveBetweenPoints(
				ctx,
				{ x: node.x, y: node.y },
				{ x: walletNode.x, y: walletNode.y },
				viewOffset,
				'up',
				node.transactionValue || 2
			);

			// draw the second curve line to create the 'bump effect', halfwayInvisiblePoint -> endNode
			// TransactionRenderer.paintCurveBetweenPoints(
			//   ctx,
			//   {
			//     x: (node.x + walletNode.x) / 2,
			//     y: (node.y + walletNode.y) / 2,
			//   },
			//   { x: walletNode.x, y: walletNode.y },
			//   viewOffset,
			//   "down",
			//   node.transactionValue || 2
			// );

			// render the circle for the node
			TransactionRenderer.paintCircle(
				ctx,
				{
					x: node.x,
					y: node.y,
					radius: circleRadius,
				},
				viewOffset,
				0,
				node.type
			);

			// render the label for the node, underneath it
			TransactionRenderer.paintText(
				ctx,
				node.name,
				{ x: node.x, y: node.y + 30 },
				'white',
				viewOffset
			);
		});

		// render each of the nodes and the corresponding line to the wallet node
		outgoingNodes.forEach((node: RendererNode, index: number) => {
			const pointX: number = walletNode.x + 200; // incoming nodes are initially 200 px to the left
			const pointY: number = walletNode.y + (outgoingLen / 2) * nodeSpacing - index * nodeSpacing;

			/* y point calculation

      lets say incomingNodes are of length 7
      then it will display half of the nodes above the wallet node
      and half of them below

      everything with a proper node spacing

      */

			// we dont want to override them after the first render - cause movement will not work
			if (!node.x) node.x = pointX;
			if (!node.y) node.y = pointY;
			if (!node.radius) node.radius = circleRadius;

			/* line drawing is split into 2 parts, as it is needed to have 2 'bumps' one at the start of the line and one at the end
        in order to achieve this effect we need to have an additional point halfway through the main line to and from which
        we are gonna be connecting our splitted lines

        so the structure is: startNode -> halfwayInvisiblePoint -> endNode


        ! IMPORTANT
        * RENDERING MUST BE DONE IN ORDER:
          1) THE LINES
          2) THE CIRCLES
          3) THE TEXT

          as the stacking order is being determined based on whichever element is rendered first
          and we do not want any lines appearing on top of the circles

      */

			// draw the first curve line to create the 'bump effect', startNode -> halfwayInvisiblePoint
			TransactionRenderer.paintCurveBetweenPoints(
				ctx,
				{ x: node.x, y: node.y },
				{ x: walletNode.x, y: walletNode.y },
				viewOffset,
				'up',
				node.transactionValue || 2
			);

			// draw the second curve line to create the 'bump effect', halfwayInvisiblePoint -> endNode
			// TransactionRenderer.paintCurveBetweenPoints(
			//   ctx,
			//   {
			//     x: (node.x + walletNode.x) / 2,
			//     y: (node.y + walletNode.y) / 2,
			//   },
			//   { x: walletNode.x, y: walletNode.y },
			//   viewOffset,
			//   "down",
			//   node.transactionValue || 2
			// );

			// render the circle for the node
			TransactionRenderer.paintCircle(
				ctx,
				{
					x: node.x,
					y: node.y,
					radius: circleRadius,
				},
				viewOffset,
				0,
				node.type
			);

			// render the label for the node, underneath it
			TransactionRenderer.paintText(
				ctx,
				node.name,
				{ x: node.x, y: node.y + 30 },
				'white',
				viewOffset
			);
		});
		// render the wallet node at last in order to avoid line overlapping
		TransactionRenderer.paintCircle(
			ctx,
			{ ...{ x: walletNode.x, y: walletNode.y }, radius: circleRadius },
			viewOffset,
			15,
			walletNode.type
		);

		// render the label for the wallet
		TransactionRenderer.paintText(
			ctx,
			walletNode.name,
			{ x: walletNode.x, y: walletNode.y + 30 },
			'lightgreen',
			viewOffset,
			16
		);
	}

	// Variables for tracking mouse movement
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [isNodeMoving, setIsNodeMoving] = useState<boolean>(false);
	const [movingNodeIndex, setMovingNodeIndex] = useState<number | null>(null);
	const [dragStart, setDragStart] = useState<TransactionRenderer.Point>({
		x: 0,
		y: 0,
	});

	// Function to handle mouse up event
	const handleMouseUp = () => {
		setIsDragging(false);
		setIsNodeMoving(false);
		setMovingNodeIndex(null);
	};

	// Function to handle mouse down event
	const handleMouseDown = (event) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const mouseX = event.clientX - canvas.getBoundingClientRect().left;
		const mouseY = event.clientY - canvas.getBoundingClientRect().top;

		// Check if the mouse is inside any of the circles
		let clickedOnNode: boolean = false;
		for (let i = 0; i < data.nodes.length; i++) {
			const node = data.nodes[i];
			if (!node.x) continue;
			if (
				/* @ts-ignore */
				/* @ts-ignore */ mouseX >= node.x - node.radius - viewOffset.x &&
				/* @ts-ignore */ mouseX <= node.x + node.radius - viewOffset.x &&
				/* @ts-ignore */ mouseY >= node.y - node.radius - viewOffset.y &&
				/* @ts-ignore */ mouseY <= node.y + node.radius - viewOffset.y
			) {
				clickedOnNode = true;
				setMovingNodeIndex(i);
				break;
			}
		}

		if (clickedOnNode) {
			setIsNodeMoving(true);
		} else {
			setIsDragging(true);
			setDragStart({ x: event.clientX, y: event.clientY });
		}
	};

	const handleCanvasMove = (event) => {
		if (isDragging && isNodeMoving === false) {
			const offsetX = event.clientX - dragStart.x;
			const offsetY = event.clientY - dragStart.y;

			// Update view offset based on mouse movement
			setViewOffset((prevOffset) => ({
				x: prevOffset.x + offsetX,
				y: prevOffset.y + offsetY,
			}));

			// Update drag start position
			setDragStart({ x: event.clientX, y: event.clientY });
			throttledRender();
		} else if (isNodeMoving && movingNodeIndex !== null) {
			console.log('trying to move');

			const canvas = canvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const mouseX = event.clientX - canvas.getBoundingClientRect().left;
			const mouseY = event.clientY - canvas.getBoundingClientRect().top;

			data.nodes[movingNodeIndex].x = mouseX + viewOffset.x;
			data.nodes[movingNodeIndex].y = mouseY + viewOffset.y;

			throttledRender();
		}
	};

	return (
		<canvas
			ref={canvasRef}
			width={width}
			height={height}
			style={{ border: '1px solid #000' }}
			onMouseDown={handleMouseDown}
			onMouseMove={handleCanvasMove}
			onMouseUp={handleMouseUp}
		/>
	);
}
