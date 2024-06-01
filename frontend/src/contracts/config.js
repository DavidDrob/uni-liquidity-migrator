import { mainnet } from 'viem/chains'
import { createWalletClient, custom } from 'viem'



export const walletClient = createWalletClient({
    chain: mainnet,
    transport: custom(window.ethereum)
  })
   