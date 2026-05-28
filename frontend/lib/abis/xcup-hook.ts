export const xcupHookAbi = [
  {
    type: 'event',
    name: 'DynamicFeeApplied',
    inputs: [
      { name: 'poolId', type: 'bytes32', indexed: true },
      { name: 'teamId', type: 'bytes32', indexed: true },
      { name: 'user', type: 'address', indexed: true },
      { name: 'state', type: 'uint8', indexed: false },
      { name: 'baseFeeBps', type: 'uint24', indexed: false },
      { name: 'discountBps', type: 'uint24', indexed: false },
      { name: 'penaltyBps', type: 'uint24', indexed: false },
      { name: 'finalFeeBps', type: 'uint24', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'TeamPointsAwarded',
    inputs: [
      { name: 'poolId', type: 'bytes32', indexed: true },
      { name: 'teamId', type: 'bytes32', indexed: true },
      { name: 'user', type: 'address', indexed: true },
      { name: 'source', type: 'uint8', indexed: false },
      { name: 'rawAmount', type: 'uint256', indexed: false },
      { name: 'multiplierBps', type: 'uint256', indexed: false },
      { name: 'points', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'WashPenaltyApplied',
    inputs: [
      { name: 'poolId', type: 'bytes32', indexed: true },
      { name: 'teamId', type: 'bytes32', indexed: true },
      { name: 'user', type: 'address', indexed: true },
      { name: 'reason', type: 'uint8', indexed: false },
      { name: 'feePenaltyBps', type: 'uint24', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'function',
    name: 'getTeamScore',
    stateMutability: 'view',
    inputs: [{ name: 'teamId', type: 'bytes32' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'swapPoints', type: 'uint256' },
          { name: 'lpPoints', type: 'uint256' },
          { name: 'totalPoints', type: 'uint256' },
          { name: 'lastUpdatedAt', type: 'uint64' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'feeForState',
    stateMutability: 'view',
    inputs: [{ name: 'state', type: 'uint8' }],
    outputs: [{ name: '', type: 'uint24' }],
  },
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
