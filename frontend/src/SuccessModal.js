import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const SuccessModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Transaction Successful</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Your liquidity has been successfully migrated to Uniswap v4!</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuccessModal;
