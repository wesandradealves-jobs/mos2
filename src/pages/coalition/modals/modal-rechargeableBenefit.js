import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useClient } from '../../../hooks/Client';
import { useMall } from '../../../hooks/Mall';

import ApiClient from '../../../services/api';

const api = new ApiClient();

const RechargeableBenefit = ({ onSubmit, benefitId }) => {
  const { mallId } = useMall();
  const { clientCpf } = useClient();

  const [cards, setCards] = useState([]);
  const [rechargeCode, setRechargeCode] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await api.getRechargeableBenefitHistoricalData(
        benefitId,
        clientCpf,
        mallId
      );
      setCards(data);
      if (data.length > 0) setRechargeCode(data[0].rechargeCode);
    };
    load();
  }, [benefitId, clientCpf, mallId]);

  const handleRechardCodeChange = useCallback(event => {
    setRechargeCode(event.target.value);
  }, []);

  const handleRedeemBenefitClick = useCallback(() => {
    onSubmit(benefitId, rechargeCode);
  }, [benefitId, onSubmit, rechargeCode]);

  return (
    <Container className="modal-rechargeableBenefit">
      <Row className="title">
        <Col>
          <h5>ESTACIONAMENTO</h5>
        </Col>
      </Row>
      <Row>
        <Col>
          <label className="label-input form-input">NÚMERO DO CARTÃO</label>
          <input
            type="text"
            onChange={handleRechardCodeChange}
            value={rechargeCode}
            required
          />
        </Col>
      </Row>
      <Row>
        <Col className="cards">
          {cards.length > 0 &&
            cards.map(card => (
              <div className="card" key={card.rechargeCode}>
                <div className="left">
                  <img src="/icons/prod-icons/cartao_icon.svg" alt="Card" />
                  <h6>{card.rechargeCode}</h6>
                </div>
              </div>
            ))}
        </Col>
      </Row>
      <Row className="row-btn-save">
        <Col>
          <button
            className="button-default -action -small align-center"
            disabled={!rechargeCode}
            onClick={handleRedeemBenefitClick}
          >
            RESGATAR
          </button>
        </Col>
      </Row>
    </Container>
  );
};

export default RechargeableBenefit;
