'use client';
import React, { useEffect, useState } from 'react';
import { data } from './data';
import TransactionVisualizer from './TransactionVisualizer';

type Props = {};

export default function TransactionGraph({}: Props) {
	const [windowAvailable, setWindowAvailable] = useState<boolean>(false); // to access the 'window' object

	useEffect(() => {
		setWindowAvailable(true);
	}, []);

	return (
		windowAvailable && (
			<main>
				<TransactionVisualizer
					width={window.innerWidth}
					height={window.innerHeight - 250}
					data={data}
				/>
			</main>
		)
	);
}
