import type { Address, Hex } from 'viem';

export type TeamSymbol = 'BRA' | 'ARG' | 'FRA' | 'GER';

export type TeamDeployment = {
  symbol: TeamSymbol;
  name: string;
  token: Address;
  teamId: Hex;
  poolId: Hex;
  currency0: Address;
  currency1: Address;
};

export type FrontendDeployments = {
  chainId: 1952;
  poolManagerMode: 'project-owned';
  tokens: {
    xUSD: Address;
    BRA: Address;
    ARG: Address;
    FRA: Address;
    GER: Address;
  };
  core: {
    poolManager: Address;
    registry: Address;
    teamPassport: Address;
    hook: Address;
    liquiditySeeder: Address;
  };
  pools: Record<TeamSymbol, Hex>;
  teams: TeamDeployment[];
};

export const deployments = {
  chainId: 1952,
  poolManagerMode: 'project-owned',
  tokens: {
    xUSD: '0x89AD049BbeD753E9213970Ea7F0727f85825e262',
    BRA: '0xC03713D4B186A2f762A6b301b8F805739a671bb3',
    ARG: '0x28b1F6d00177F6565310e9849aC1fe27FD6781d4',
    FRA: '0xf6A9f29Cac7F2e4353FE9378807014cCD32841EB',
    GER: '0x8Aaf86dBc2922409F32693290cb7b88D5F3DAA32',
  },
  core: {
    poolManager: '0x89EB7997ec0A7862ae25bAf44302cf2ac1554bD5',
    registry: '0x5a1F521cAbc5b3b84518593C3EE09b7F978c2E50',
    teamPassport: '0xaBf3AB75ac2B8d54E005C97e0f63fbeB82258358',
    hook: '0xea906F6E7D63D96E4D6782b6260a7a11587144c0',
    liquiditySeeder: '0x693c37af40d21c5c0B4b34151a234D69919F1407',
  },
  pools: {
    BRA: '0xac226e1ee3a5d5b56d33dbb8760019d5f2d59635bed752085d705ce2bece4380',
    ARG: '0xc59461cd61690d3b48635a550962c7f9491530eb4c181c435e51ba6c03c8f9cd',
    FRA: '0xa2a46908c90ebf39ed2f12938d0e29b5b3f4a94f09281ea9f99fc860368b65c8',
    GER: '0x1929af06898f12a50752e87f1e7bc370d77754f3006ec8ead85764ef4df808f6',
  },
  teams: [
    {
      symbol: 'BRA',
      name: 'Brazil',
      token: '0xC03713D4B186A2f762A6b301b8F805739a671bb3',
      teamId: '0x9530cfe659b81a1ad7e27fcf63cb7137f7ac9c7f5d9eb011dc41e30833adcfa0',
      poolId: '0xac226e1ee3a5d5b56d33dbb8760019d5f2d59635bed752085d705ce2bece4380',
      currency0: '0x89AD049BbeD753E9213970Ea7F0727f85825e262',
      currency1: '0xC03713D4B186A2f762A6b301b8F805739a671bb3',
    },
    {
      symbol: 'ARG',
      name: 'Argentina',
      token: '0x28b1F6d00177F6565310e9849aC1fe27FD6781d4',
      teamId: '0x73423ff7bbf24f26662f84f1ab3d14334103a5250d07b587eef31eb0516f1f73',
      poolId: '0xc59461cd61690d3b48635a550962c7f9491530eb4c181c435e51ba6c03c8f9cd',
      currency0: '0x28b1F6d00177F6565310e9849aC1fe27FD6781d4',
      currency1: '0x89AD049BbeD753E9213970Ea7F0727f85825e262',
    },
    {
      symbol: 'FRA',
      name: 'France',
      token: '0xf6A9f29Cac7F2e4353FE9378807014cCD32841EB',
      teamId: '0x57f0fc9aebf846ced766a4ca2d7e5dff056963a57812e5527eaa122e70d56445',
      poolId: '0xa2a46908c90ebf39ed2f12938d0e29b5b3f4a94f09281ea9f99fc860368b65c8',
      currency0: '0x89AD049BbeD753E9213970Ea7F0727f85825e262',
      currency1: '0xf6A9f29Cac7F2e4353FE9378807014cCD32841EB',
    },
    {
      symbol: 'GER',
      name: 'Germany',
      token: '0x8Aaf86dBc2922409F32693290cb7b88D5F3DAA32',
      teamId: '0x766d6b724cbc7ec37adf1580586e50a99fe23f025d5ef912b262a03adba7ff34',
      poolId: '0x1929af06898f12a50752e87f1e7bc370d77754f3006ec8ead85764ef4df808f6',
      currency0: '0x89AD049BbeD753E9213970Ea7F0727f85825e262',
      currency1: '0x8Aaf86dBc2922409F32693290cb7b88D5F3DAA32',
    },
  ],
} as const satisfies FrontendDeployments;

export const shortAddress = (value: string) => `${value.slice(0, 6)}...${value.slice(-4)}`;
