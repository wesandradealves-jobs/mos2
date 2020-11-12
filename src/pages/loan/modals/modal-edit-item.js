import React, { useCallback } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { itemStatus } from '../../../config/loan';

import { useMall } from '../../../hooks/Mall';

import ApiClient from '../../../services/api';
import PopUp from '../../../utils/PopUp';

const api = new ApiClient();
const popUp = new PopUp();

const ModalEditItem = ({ onSubmit, loanItem }) => {
  const { register, handleSubmit, errors, watch } = useForm({
    mode: 'onBlur',
    defaultValues: {
      model: loanItem.model,
      itemType: loanItem.typeName,
      inventoryNumber: loanItem.inventoryNumber,
      status: loanItem.status,
    },
  });

  const { mallId } = useMall();

  const handleSaveItem = useCallback(
    async formData => {
      const requestBody = {
        inventoryNumber: formData.inventoryNumber,
        model: formData.model,
        status: formData.status,
      };

      popUp.processPromises(
        'Salvando item...',
        api.updateLoanItem(mallId, loanItem.id, requestBody),
        {
          successCallback: () => {
            onSubmit();
          },
          successMsg: 'Item salvo com sucesso!',
        }
      );
    },
    [loanItem, mallId, onSubmit]
  );
  return (
    <div className="modal-coalition">
      <Container style={{ padding: '0px' }}>
        <Row>
          <Col>
            <h5>EDITAR ITEM</h5>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <label className="label-input form-input">ITEM</label>
            <input
              name="itemType"
              ref={register}
              type="text"
              required
              disabled
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={4}>
            <label className="label-input form-input">MODELO</label>
            <input
              name="model"
              ref={register({
                required: true,
              })}
              className={`${errors.model ? 'coaliton-form-error' : ''}`}
              type="text"
              required
            />
          </Col>
          <Col xs={12} md={4}>
            <label className="label-input form-input">N° DE PATRIMÔNIO</label>
            <input
              name="inventoryNumber"
              ref={register({
                required: true,
              })}
              className={`${
                errors.inventoryNumber ? 'coaliton-form-error' : ''
              }`}
              type="text"
              required
            />
          </Col>
          <Col md={4}>
            <label className="label-input form-input">STATUS</label>
            <select
              name="status"
              ref={register({
                validate: value => value !== 'DEFAULT',
              })}
              className={`${
                errors.status
                  ? 'coaliton-form-error'
                  : watch('status') !== 'DEFAULT' && ' -selected'
              }`}
            >
              <option value="DEFAULT" disabled>
                -- Selecione --
              </option>
              {Object.entries(itemStatus).map(([key, value]) => (
                <option value={key} key={key}>
                  {value}
                </option>
              ))}
            </select>
          </Col>
        </Row>
        <Row className="footer-modal">
          <button
            className="button-default -action -small"
            onClick={handleSubmit(handleSaveItem)}
          >
            Salvar
          </button>
        </Row>
      </Container>
    </div>
  );
};

export default ModalEditItem;
