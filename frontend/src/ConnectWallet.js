import React from "react";
import "./ConnectWallet.css";
import { NetworkErrorMessage } from "./NetworkErrorMessage";

export function ConnectWallet({ connectWallet, networkError, dismiss }) {
  return (
    <div className="container">
      <img 
        className="uniswap-logo" 
        src="https://cryptologos.cc/logos/uniswap-uni-logo.png" 
        alt="Uniswap Logo"
      />
      <div className="heading">Uniswap Liquidity Migrator</div>
      <div className="row justify-content-md-center">
        <div className="col-12 text-center">
          {networkError && (
            <NetworkErrorMessage 
              message={networkError} 
              dismiss={dismiss} 
            />
          )}
        </div>
        <div className="col-12 p-4 text-center">
          <p className="text-large">Migrate liquidity from Sushiswap to Uniswap v4 in one click</p>
          <button
            className="btn-uniswap"
            type="button"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
