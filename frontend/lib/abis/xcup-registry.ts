export const xcupRegistryAbi = [
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
] as const;
