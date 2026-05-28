export const teamPassportAbi = [
  {
    type: 'function',
    name: 'mintPassport',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'teamId', type: 'bytes32' }],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'hasPassport',
    stateMutability: 'view',
    inputs: [{ name: 'fan', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'passportOf',
    stateMutability: 'view',
    inputs: [{ name: 'fan', type: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'teamId', type: 'bytes32' },
          { name: 'mintedAt', type: 'uint64' },
          { name: 'exists', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'tokenIdOf',
    stateMutability: 'view',
    inputs: [{ name: 'fan', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'teamOf',
    stateMutability: 'view',
    inputs: [{ name: 'fan', type: 'address' }],
    outputs: [{ name: '', type: 'bytes32' }],
  },
  {
    type: 'function',
    name: 'teamFanCount',
    stateMutability: 'view',
    inputs: [{ name: 'teamId', type: 'bytes32' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;
