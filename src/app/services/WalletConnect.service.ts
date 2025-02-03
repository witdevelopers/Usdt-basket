// wallet-connect.service.ts
import { Injectable } from '@angular/core';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';  // Updated import

@Injectable({
  providedIn: 'root',
})
export class WalletConnectService {
  private web3: Web3 | null = null;
  private provider: any;

  constructor() {}

  // Initialize Web3Modal
  private web3Modal = new Web3Modal({
    cacheProvider: true, // Keep the selected wallet after page reload
    providerOptions: {
      walletconnect: {
        display: {
          logo: 'https://avatars.githubusercontent.com/u/37784859?v=4',
          name: 'WalletConnect',
          description: 'Connect with WalletConnect',
        },
        package: WalletConnectProvider,
        options: {
          // No Infura needed, WalletConnect will use its own RPC
        },
      },
      coinbase: {
        display: {
          logo: 'https://assets.coinbase.com/favicon/favicon-16x16.png',
          name: 'Coinbase Wallet',
          description: 'Connect with Coinbase Wallet',
        },
        package: createCoinbaseWalletSDK,  // Use the updated method
        options: {
          appName: 'YourAppName', // Replace with your app's name
        },
      },
    },
  });

  // Connect to the selected wallet
  async connectWallet(): Promise<string[]> {
    try {
      const instance = await this.web3Modal.connect();
      this.provider = instance;
      this.web3 = new Web3(instance);
      const accounts = await this.web3.eth.getAccounts();
      console.log('Connected Accounts:', accounts);
      return accounts;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return [];
    }
  }

  getWeb3() {
    return this.web3;
  }

  async recoverAddress(signedMessage: string, message: string): Promise<string> {
    if (this.web3) {
      const address = await this.web3.eth.personal.ecRecover(message, signedMessage);
      return address;
    }
    throw new Error('Web3 instance is not available');
  }

  // Disconnect wallet
  async disconnectWallet() {
    if (this.provider && this.provider.close) {
      await this.provider.close();
      this.web3 = null;
      this.provider = null;
      this.web3Modal.clearCachedProvider();
    }
  }
}
