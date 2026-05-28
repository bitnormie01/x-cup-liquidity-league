export const xcupRegistryAbi = [
  {
    type: 'function',
    name: 'controller',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'owner',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'setMatchState',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'teamId', type: 'bytes32' },
      { name: 'state', type: 'uint8' },
      { name: 'reason', type: 'string' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'matchStateOfTeam',
    stateMutability: 'view',
    inputs: [{ name: 'teamId', type: 'bytes32' }],
    outputs: [
      { name: 'state', type: 'uint8' },
      { name: 'reason', type: 'string' },
      { name: 'updatedAt', type: 'uint64' },
      { name: 'exists', type: 'bool' },
    ],
  },
  {
    type: 'event',
    name: 'MatchStateUpdated',
    inputs: [
      { name: 'teamId', type: 'bytes32', indexed: true },
      { name: 'state', type: 'uint8', indexed: false },
      { name: 'reason', type: 'string', indexed: false },
      { name: 'updatedAt', type: 'uint64', indexed: false },
    ],
  },
] as const;
