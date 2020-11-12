import React, { useCallback } from 'react';
import MaskedInput from 'react-text-mask';
import { Row, Col, Container } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { itemStatus } from '../../../config/loan';

import { convertUTCtoTimeZone } from '../../../utils/functions';

import { cpf as cpfMask, phone as phoneMask } from '../../../utils/masks';

const ModalLoanDetails = ({ loanId, customer, loan }) => {
  const { register, control } = useForm({
    mode: 'onBlur',
    defaultValues: {
      cpf: customer.cpf,
      mobileNumber: customer.mobileNumber,
      email: customer.email,
      fullName: customer.fullName,
      itemTypeName: loan.loanItem.typeName,
      tag: loan.loanItem.tag,
      status: itemStatus[loan.loanItem.status],
    },
  });

  const getAvatar = useCallback(name => {
    if (name) {
      const fullNameSplitted = name.split(' ');
      const firstLetter = fullNameSplitted[0].charAt(0);
      const secontLetter = fullNameSplitted[fullNameSplitted.length - 1].charAt(
        0
      );
      return firstLetter + secontLetter;
    }
    return '--';
  }, []);

  return (
    <Container className="modal-giveBack">
      <Row className="title">
        <Col>
          <h5>DADOS DO EMPRÉSTIMO</h5>
        </Col>
      </Row>
      <Row className="subtitle">
        <Col>
          <p>{`Nº ${loanId}`}</p>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <label className="label-input form-input">NOME DO CLIENTE</label>
          <input name="fullName" ref={register} type="text" required disabled />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
          <label className="label-input form-input">CPF</label>
          <Controller
            as={MaskedInput}
            mask={cpfMask}
            control={control}
            type="text"
            name="cpf"
            disabled
            required
          />
        </Col>
        <Col xs={12} md={6}>
          <label className="label-input form-input">TELEFONE</label>
          <Controller
            as={MaskedInput}
            mask={phoneMask}
            control={control}
            type="text"
            name="mobileNumber"
            disabled
            required
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <label className="label-input form-input">E-mail</label>
          <input name="email" ref={register} type="text" required disabled />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={4}>
          <label className="label-input form-input">ITEM</label>
          <input
            name="itemTypeName"
            ref={register}
            type="text"
            required
            disabled
          />
        </Col>
        <Col xs={12} md={4}>
          <label className="label-input form-input">ID</label>
          <input name="tag" ref={register} type="text" required disabled />
        </Col>
        <Col md={4}>
          <label className="label-input form-input">STATUS DO ITEM</label>
          <input name="status" ref={register} type="text" required disabled />
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="observation">
            <h5>OBSERVAÇÕES</h5>
            {loan.observations.length > 0 ? (
              loan.observations.map(observation => (
                <div
                  className="otherComments"
                  key={Math.random()
                    .toString(20)
                    .substr(2, 5)}
                >
                  <div className="avatar">
                    {getAvatar(observation.employeeName)}
                  </div>
                  <div className="otherObservation">
                    <div>
                      <span className="employee-name">
                        {observation.employeeName}
                      </span>
                      <span className="date">
                        {format(
                          convertUTCtoTimeZone(observation.dateTime),
                          `dd 'de' MMMM 'de' yyyy 'às' HH:mm`,
                          { locale: ptBR }
                        )}
                      </span>
                    </div>
                    <div className="text">{observation.observation}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-observation">
                <span>Não existem observações</span>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ModalLoanDetails;
