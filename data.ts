export interface RendererNode {
	name: string;
	type: 'outgoing' | 'incoming' | 'wallet';
	x?: number;
	y?: number;
	radius?: number; // these will be set automatically, and then calculated if the user has moved a node with mouse
	transactionValue?: number;
}

export interface RendererData {
	nodes: RendererNode[];
}

export const data: RendererData = {
	nodes: [
		{
			name: 'wallet',
			type: 'wallet',
		},
		{
			name: 'outgoing txhash1',
			type: 'outgoing',
			transactionValue: 100,
		},
		{
			name: 'outgoing thxhash2',
			type: 'outgoing',
			transactionValue: 400,
		},
		{
			name: 'incoming txhash1',
			type: 'incoming',
			transactionValue: 1500,
		},
		{
			name: 'incoming thxhash2',
			type: 'incoming',
			transactionValue: 1200,
		},
		{
			name: 'incoming thxhash2',
			type: 'incoming',
			transactionValue: 1200,
		},
		{
			name: 'incoming thxhash2',
			type: 'incoming',
			transactionValue: 1200,
		},
		{
			name: 'incoming thxhash3',
			type: 'incoming',
			transactionValue: 2000,
		},

		{
			name: 'incoming thxhash4',
			type: 'incoming',
			transactionValue: 1000,
		},
		{
			name: 'incoming thxhash5',
			type: 'incoming',
			transactionValue: 330,
		},
		{
			name: 'incoming thxhash6',
			type: 'incoming',
			transactionValue: 1150,
		},
		{
			name: 'incoming thxhash7',
			type: 'incoming',
			transactionValue: 340,
		},
		{
			name: 'incoming thxhash8',
			type: 'incoming',
			transactionValue: 890,
		},
	],
};

export function getIncomingNodes(data: RendererData) {
	return data.nodes.filter((x) => x.type === 'incoming');
}

export function getOutgoingNodes(data: RendererData) {
	return data.nodes.filter((x) => x.type === 'outgoing');
}

export function getWalletNodeIndex(data: RendererData) {
	for (let i = 0; i < data.nodes.length; i++) {
		if (data.nodes[i].type === 'wallet') return i;
	}

	return -1;
}
