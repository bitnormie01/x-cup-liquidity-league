export const xcupHookAbi = [
  {
    type: 'function',
    name: 'contributions',
    stateMutability: 'view',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'teamId', type: 'bytes32' },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'swapPoints', type: 'uint256' },
          { name: 'lpPoints', type: 'uint256' },
          { name: 'totalPoints', type: 'uint256' },
          { name: 'lastActionAt', type: 'uint64' },
        ],
      },
    ],
  },
] as const;
