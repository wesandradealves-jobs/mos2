import React, { useState, useCallback } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

const AcceptTransaction = ({ onSubmit, transactionId }) => {
  const [controlNumber, setControlNumber] = useState('');

  const handleControleNumberChange = useCallback(event => {
    setControlNumber(event.target.value);
  }, []);

  const handleAccept = useCallback(() => {
    onSubmit(transactionId, controlNumber);
  }, [controlNumber, onSubmit, transactionId]);

  return (
    <Container className="modal-acceptTransaction">
      <Row className="title">
        <Col>
          <h5>INSIRA O NÚMERO DE CONTROLE</h5>
        </Col>
      </Row>
      <Row className="subtitle">
        <Col>
          <p>Insira o número de controle para aceitar essa transação.</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <label className="label-input form-input">NÚMERO DE CONTROLE</label>
          <input
            type="text"
            onChange={handleControleNumberChange}
            value={controlNumber}
            required
          />
        </Col>
      </Row>

      <Row className="row-btn-save">
        <Col>
          <button
            className="button-default -action -small align-center"
            disabled={!controlNumber}
            onClick={handleAccept}
          >
            ACEITAR
          </button>
        </Col>
      </Row>
    </Container>
  );
};

export default AcceptTransaction;
