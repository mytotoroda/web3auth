'use client';

import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { SolanaWalletConnectors } from '@dynamic-labs/solana';

const ENVIRONMENT_ID = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID;

interface DynamicProviderProps {
  children: React.ReactNode;
}

export default function DynamicProvider({ children }: DynamicProviderProps) {
  if (!ENVIRONMENT_ID) {
    throw new Error('NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID is not defined');
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId: ENVIRONMENT_ID,
        walletConnectors: [SolanaWalletConnectors], // walletConnectorExtensions를 walletConnectors로 변경
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}