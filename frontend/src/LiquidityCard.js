import React from 'react';
import './LiquidityCard.css';

const LiquidityCard = ({ loading, onMigrate }) => {
  return (
    <div className="card" style={{ borderRadius: '20px' }}>
      <div className="title">
        <div className="icon-text">
          <img className="icon" src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" alt="USDC" />
          <img className="icon" src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" />
          <div>USDC/ETH</div>
        </div>
        <div className="manage-text">Manage</div>
      </div>
      <div className="pool-info">
        <div className="label">Your total pool tokens</div>
        <div className="value">0.00925</div>
      </div>
      <div className="pool-info">
        <div className="label">Pooled USDC:</div>
        <div className="value">0.428154</div>
      </div>
      <div className="pool-info">
        <div className="label">Pooled ETH:</div>
        <div className="value">0.00107106</div>
      </div>
      <div className="pool-info">
        <div className="label">Your pool share:</div>
        <div className="value">&lt;0.01%</div>
      </div>
      <div className="button-container">
        <button
          className="migrate-button"
          type="button"
          onClick={onMigrate}
          disabled={loading}
        >
          {loading ? 'Migrating...' : 'Migrate Liquidity to Uniswap v4'}
        </button>
      </div>
    </div>
  );
};

export default LiquidityCard;
