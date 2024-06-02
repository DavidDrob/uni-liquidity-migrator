import React from 'react';
import './SushiPoolCard.css';

const SushiPoolCard = ({ onApprove }) => {
  return (
    <div className="sushi-card">
      <div className="sushi-title">
        <div className="sushi-icon-text">
          <img className="sushi-icon" src="https://cryptologos.cc/logos/sushiswap-sushi-logo.png" alt="SushiSwap" />
          <div>SushiSwap Current Position</div>
        </div>
      </div>
      <div className="sushi-pool-info">
        <div className="sushi-label">Your total pool tokens</div>
        <div className="sushi-value">0.00925</div>
      </div>
      <div className="sushi-pool-info">
        <div className="sushi-label">Pooled USDC:</div>
        <div className="sushi-value">0.428154</div>
      </div>
      <div className="sushi-pool-info">
        <div className="sushi-label">Pooled ETH:</div>
        <div className="sushi-value">0.00107106</div>
      </div>
      <div className="sushi-pool-info">
        <div className="sushi-label">Your pool share:</div>
        <div className="sushi-value">&lt;0.01%</div>
      </div>
      <div className="button-container">
        <button
          style={{
            display: 'inline-block',
            padding: '20px 40px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#fff',
            backgroundColor: '#000',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            textDecoration: 'none',
            transition: 'transform 0.2s, boxShadow 0.2s',
            cursor: 'pointer',
            margin: '10px'
          }}
          onClick={onApprove}
        >
          Approve
        </button>
      </div>
    </div>
  );
};

export default SushiPoolCard;
