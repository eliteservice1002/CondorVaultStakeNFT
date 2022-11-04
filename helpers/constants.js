import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletLink from "walletlink";

export const BSC_MAINNET_PROVIDER = 'https://bsc-dataseed1.binance.org'

export const NFT_KEY = '0000000000000000000000000000000000000000000000000000000000000500'

export const PROVIDER_OPTIONS = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: process.env.INFURA_ID, // required
      },
    },
    'custom-walletlink': {
      display: {
        logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
        name: 'Coinbase',
        description: 'Connect to Coinbase Wallet (not Coinbase App)',
      },
      options: {
        appName: 'Coinbase', // Your app name
        networkUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
        chainId: 1,
      },
      package: WalletLink,
      connector: async (_, options) => {
        const { appName, networkUrl, chainId } = options
        const walletLink = new WalletLink({
          appName,
        })
        const provider = walletLink.makeWeb3Provider(networkUrl, chainId)
        await provider.enable()
        return provider
      },
    },
}

export const MAINNET_PROVIDERS = [
  "https://bsc-dataseed1.binance.org",
  "https://bsc-dataseed2.binance.org",
  "https://bsc-dataseed3.binance.org",
  "https://bsc-dataseed4.binance.org",
  "https://bsc-dataseed1.defibit.io",
  "https://bsc-dataseed2.defibit.io",
  "https://bsc-dataseed3.defibit.io",
  "https://bsc-dataseed4.defibit.io",
  "https://bsc-dataseed1.ninicoin.io",
  "https://bsc-dataseed2.ninicoin.io",
  "https://bsc-dataseed3.ninicoin.io",
  "https://bsc-dataseed4.ninicoin.io"
]

export const TESTNET_PROVIDERS = [
  "https://data-seed-prebsc-1-s1.binance.org:8545",
  "https://data-seed-prebsc-2-s1.binance.org:8545",
  "https://data-seed-prebsc-1-s3.binance.org:8545",
  "https://data-seed-prebsc-2-s3.binance.org:8545"
]