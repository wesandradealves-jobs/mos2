import React, { useCallback } from 'react';
import Select from 'react-select';
import { Row, Col, Container } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import MaskedInput from 'react-text-mask';
import { format } from 'date-fns';

import {
  currency as currencyMask,
  cnpj as cnpjMask,
} from '../../../utils/masks';
import PopUp from '../../../utils/PopUp';

const popUp = new PopUp();

const banks = [
  { id: 'bb', name: 'Banco do Brasil' },
  { id: 'san', name: 'Santander' },
  { id: 'bra', name: 'Bradesco' },
  { id: 'cef', name: 'Caixa Econômica' },
];

const ValidationSchema = Yup.object().shape({
  value: Yup.string().required(),
  bank: Yup.object().required(),
  agency: Yup.number().required(),
  agencyDigit: Yup.number().required(),
  account: Yup.number().required(),
  accountDigit: Yup.number().required(),
  corporateName: Yup.string().required(),
  cnpj: Yup.string().test('min cnpj', '', cnpj => {
    if (cnpj) {
      const cnpjNumbers = cnpj
        .replace(/_/g, '')
        .replace(/\./g, '')
        .replace(/\//g, '')
        .replace(/-/g, '');
      return cnpjNumbers.length === 14;
    }
    return false;
  }),
});

const AcceptTransaction = ({ onSubmit, balance }) => {
  const { register, handleSubmit, control, watch, errors } = useForm({
    validationSchema: ValidationSchema,
    mode: 'onBlur',
  });

  const handleTransferSubmit = useCallback(
    data => {
      const parsedValue = parseFloat(
        data.value
          .replace('R$ ', '')
          .replace('.', '')
          .replace(',', '.')
      );
      if (parsedValue >= balance) {
        popUp.showWarning('Saldo insuficiente.');
        return;
      }
      popUp.showConfirmation('Deseja confirmar a transferência?', () => {
        const newTransference = {
          id: Math.random()
            .toString(36)
            .substring(7),
          date: format(Date.now(), `dd/MM/yyyy 'às' HH:mm`),
          bank: data.bank.name,
          account: `${data.account}-${data.accountDigit}`,
          value: parsedValue,
        };
        onSubmit(newTransference);
      });
    },
    [balance, onSubmit]
  );

  return (
    <Container className="modal-newTransfer">
      <Row className="title">
        <Col>
          <h5>TRANSFERIR</h5>
        </Col>
      </Row>
      <Row className="subtitle">
        <Col>
          <p>{`Saldo ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(balance)}`}</p>
        </Col>
      </Row>
      <Row className="transferValue">
        <Col>
          <label className="label-input form-input">Informe o valor</label>
          <Controller
            as={MaskedInput}
            mask={currencyMask}
            control={control}
            type="text"
            name="value"
            placeholder="R$ 0,00"
            required
            className={`${errors.value ? 'coaliton-form-error' : ''}`}
          />
        </Col>
      </Row>
      <Row className="details">
        <Col sm={12} lg={8}>
          <Row className="bank">
            <Col sm={12} lg={6} className="name">
              <label className="label-input form-input">NOME DO BANCO</label>
              <Controller
                as={Select}
                control={control}
                name="bank"
                className="basic-multi-select"
                options={banks}
                getOptionLabel={option => option.name}
                getOptionValue={option => option}
                styles={{
                  control: base => ({
                    ...base,
                    borderColor: errors.bank
                      ? '#c53030 !important'
                      : watch('bank') && '#54bbab !important',
                  }),
                }}
              />
            </Col>
            <Col sm={12} lg={6} className="pl-0 pl-lg-3 agency">
              <div className="number">
                <label className="label-input form-input">AGENCIA</label>
                <input
                  ref={register}
                  type="number"
                  name="agency"
                  required
                  className={`${errors.agency ? 'coaliton-form-error' : ''}`}
                />
              </div>
              <div className="digit">
                <label className="label-input form-input">DIG</label>
                <input
                  ref={register}
                  type="text"
                  name="agencyDigit"
                  maxLength="1"
                  required
                  className={`${
                    errors.agencyDigit ? 'coaliton-form-error' : ''
                  }`}
                />
              </div>
            </Col>
          </Row>
        </Col>
        <Col className="account" sm={12} lg={4}>
          <div className="number">
            <label className="label-input form-input">CONTA</label>
            <input
              ref={register}
              type="number"
              name="account"
              required
              className={`${errors.account ? 'coaliton-form-error' : ''}`}
            />
          </div>
          <div className="digit">
            <label className="label-input form-input">DIG</label>
            <input
              ref={register}
              type="text"
              name="accountDigit"
              maxLength="1"
              required
              className={`${errors.accountDigit ? 'coaliton-form-error' : ''}`}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm={12} lg={8}>
          <label className="label-input form-input">RAZAO SOCIAL</label>
          <input
            ref={register}
            type="text"
            name="corporateName"
            required
            className={`${errors.corporateName ? 'coaliton-form-error' : ''}`}
          />
        </Col>
        <Col sm={12} lg={4}>
          <label className="label-input form-input">CNPJ</label>
          <Controller
            as={MaskedInput}
            mask={cnpjMask}
            control={control}
            type="text"
            name="cnpj"
            required
            className={`${errors.cnpj ? 'coaliton-form-error' : ''}`}
          />
        </Col>
      </Row>
      <Row className="row-btn-save">
        <Col>
          <button
            className="button-default -action align-center"
            onClick={handleSubmit(handleTransferSubmit)}
          >
            TRANSFERIR
          </button>
        </Col>
      </Row>
    </Container>
  );
};

export default AcceptTransaction;
