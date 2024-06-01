import React from "react";
  // Correct import

import LiquidityCard from './LiquidityCard';  // Adjust the path as necessary
import SushiPoolCard from './SushiPoolCard';  // Adjust the path as necessary
import Arrow from './Arrow';  // Import the Arrow component

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import MigratorArtifact from "./contracts/Migrator.json";
import contractAddress from "./contracts/contract-address.json";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { ethers } from "ethers";
import { createWalletClient, custom, getContract } from 'viem'
import { mainnet } from 'viem/chains'
import { walletClient } from './contracts/config'



// This is the default id used by the Hardhat Network
const HARDHAT_NETWORK_ID = '1';

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

const ERC20_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sync","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]


export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      selectedAddress: undefined,
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
      loading: false,
      successMessage: '',  // Add success message state
      isApproved: false, 
    };

    this.state = this.initialState;
  }

  render() {
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet 
          connectWallet={() => this._connectWallet()} 
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }

    return (
      <div className="container p-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center' }}>
          <div>
            <img 
              style={{
                width: "70px",
                height: '70px',
                borderRadius: '40px',
              }} 
              src="https://cryptologos.cc/logos/uniswap-uni-logo.png" 
              alt="Uniswap Logo"
            />
          </div>
          <h1>Uniswap Liquidity Migrator</h1>
          <hr/>
          <button onClick={() => this._approveTokens()}>Approve</button>
          <SushiPoolCard />
          <Arrow />
         
          <LiquidityCard
            loading={this.state.loading}
            onMigrate={() => this._migrateLiquidity()}
          />
          {this.state.txBeingSent && (
            <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
          )}
          {this.state.transactionError && (
            <TransactionErrorMessage
              message={this._getRpcErrorMessage(this.state.transactionError)}
              dismiss={() => this._dismissTransactionError()}
            />
          )}
          {this.state.successMessage && (
            <div style={{ marginTop: '20px', color: 'green', fontWeight: 'bold' }}>
              {this.state.successMessage}
            </div>
          )}
        </div>
      </div>
    );
  }

  async _connectWallet() {
    try {

      
      const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Selected Address:', selectedAddress);  // Debugging  

     
 
      this._checkNetwork();

      this._initialize(selectedAddress);

      window.ethereum.on("accountsChanged", ([newAddress]) => {
        if (newAddress === undefined) {
          return this._resetState();
        }
        this._initialize(newAddress);
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);  // Debugging
      this.setState({ networkError: error });
    }
  }

  _initialize(userAddress) {
    this.setState({ selectedAddress: userAddress });
    this._initializeEthers(userAddress);
  }


  async _initializeEthers(address) {
    try {
      if (!window.ethereum) {
        throw new Error("Ethereum object not found. Please install MetaMask.");
      }
      else{
        console.log('window:', window.ethereum);
      }

      const client = createWalletClient({
        account: address, 
        chain: mainnet,
        transport
      
      : custom(window.ethereum)
      })

      const contract = getContract({
        address: contractAddress.Migrator,
        abi: MigratorArtifact.abi,
        client
      })

      this._migrateContract = contract

      // this._provider = new ethers.providers.Web3Provider(window.ethereum);
      // debugger
      // this._migrateContract = new ethers.Contract(
      //   contractAddress.Migrator,
      //   MigratorArtifact.abi,
      //   this._provider.getSigner(0)
      // );
      // console.log('Contract Initialized:', this._migrateContract);  // Debugging
    } catch (error) {

      console.error('Error initializing ethers:', error);  // Debugging
      console.error('Migrator adress:', contractAddress.Migrator); // Debugging
      console.error('ABI:', MigratorArtifact.abi)
    }
  }

  async _approveTokens() {
    try {
      this._dismissTransactionError();
      this.setState({ loading: true, successMessage: '' });
  
      const tokenAddress = '0x397FF1542f962076d0BFE58eA045FfA2d347ACa0'; // Set your token address here
      const spenderAddress = contractAddress.Migrator;
      const amount = '1000000000000000000000'; // Adjust the amount and decimals as necessary (1000 * 10^18)
  
      const client = createWalletClient({
        account: this.state.selectedAddress,
        chain: mainnet,
        transport: custom(window.ethereum),
      });
  
      const tokenContract = getContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        client,
      });
  
      const tx = await tokenContract.write.approve([spenderAddress, amount]);
      this.setState({ txBeingSent: tx.hash });
  
      // Poll for the transaction receipt
      let receipt = null;
      while (receipt === null) {
        receipt = await client.getTransactionReceipt({ hash: tx.hash });
        if (receipt && receipt.status === 0) {
          throw new Error("Approval transaction failed");
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second
      }
  
      this.setState({ isApproved: true, successMessage: 'Tokens approved successfully' });
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
  
      console.error('Error approving tokens:', error);  // Debugging
      this.setState({ transactionError: error });
    } finally {
      this.setState({ txBeingSent: undefined, loading: false });
    }
  }

  async _migrateLiquidity() {
    try {
      this._dismissTransactionError();
      this.setState({ loading: true, successMessage: '' });

      const poolAddress = '0x397FF1542f962076d0BFE58eA045FfA2d347ACa0';
      const liquidity = '1'; // or appropriate liquidity value

      // debugger
      const tx = await this._migrateContract.write.migrate([poolAddress, liquidity]);
      this.setState({ txBeingSent: tx.hash });

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      this.setState({ successMessage: 'Liquidity migrated successfully' });
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error('Error migrating liquidity:', error);  // Debugging
      this.setState({ transactionError: error });
    } finally {
      this.setState({ txBeingSent: undefined, loading: false });
    }
  }

  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  _resetState() {
    this.setState(this.initialState);
  }

  async _switchChain() {
    const chainIdHex = `0x${HARDHAT_NETWORK_ID.toString(16)}`
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
    await this._initialize(this.state.selectedAddress);
  }

  _checkNetwork() {
    if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID) {
      this._switchChain();
    }
  }
}

export default Dapp;
