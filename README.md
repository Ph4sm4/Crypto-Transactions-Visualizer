# Crypto Transactions Visualizer

It is an easily usable crypto-transactions graphing tool written in vanilla javascript.

![image](https://github.com/Ph4sm4/Crypto-Transactions-Visualizer/assets/78483172/e626f8d2-1750-48bc-bdda-52a63f948b77)

### _'transactionValue'_ property
- This field controls the color and thickness of the lines.
- Colors of the lines and the nodes are easily changeable in _TransactionRenderer.ts_.
- Determining how fast the lines get thick is also customizable in _TransactionRenderer.ts_.
  
### Functionalities:
- Moving the _wallet_ and _incoming/outgoing_ nodes by click-dragging. All linking lines are going to be updated accordingly.
- Moving the entire graph/canvas by click-dragging somewhere else than on a node.

### In-code usage:
```tsx
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
```

### How to structure data

Structuring is done using these 2 interfaces:

```ts
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
```

### Sample data object would look like this:

```ts
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
```

