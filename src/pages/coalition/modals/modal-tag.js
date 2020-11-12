import React, { useCallback } from 'react';

import * as Yup from 'yup';

import { Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import ComponentWithTooltip from '../../../components/withTooltip';

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  multiplier: Yup.number().required(),
  startDate: Yup.string().required(),
  endDate: Yup.string().required(),
});

const ModalBenefit = ({ tag, onSubmit, actionType }) => {
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      name: tag.name,
      multiplier: tag.multiplier,
      startDate: tag.startDate,
      endDate: tag.endDate,
    },
    validationSchema: ValidationSchema,
    mode: 'onBlur',
  });

  const handleFormSubmit = useCallback(data => onSubmit(data, actionType), [
    onSubmit,
    actionType,
  ]);

  return (
    <div className="modal-coalition" onSubmit={handleSubmit(handleFormSubmit)}>
      <form>
        <Row>
          <Col>
            <h5>
              {`${
                actionType === 'new' ? 'ADICIONAR ' : 'EDITAR'
              }   MULTIPLICADOR`}
            </h5>
          </Col>
        </Row>
        <Row>
          <Col sm={6} xs={12}>
            <label className="label-input form-input">
              NOME DO MULTIPLICADOR*
            </label>
            <input
              type="text"
              name="name"
              ref={register}
              className={`${errors.name ? 'coaliton-form-error' : ''}`}
              required
            />
          </Col>

          <Col sm={6} xs={12}>
            <div className="tool-tip">
              <label className="label-input form-input">VALOR*</label>
              <ComponentWithTooltip
                title="O valor será multiplicado pelos pontos de cada transação."
                styles={{
                  span: {
                    position: 'absolute',
                    bottom: '90%',
                    left: '51%',
                    transform: 'translateX(-49%)',
                  },
                }}
                className="mytooltip"
              >
                <img
                  src="/icons/action-icons/tooltip.svg"
                  alt="Tooltip"
                  style={{
                    width: '20px',
                    marginLeft: '10px',
                    marginTop: '15px',
                    paddingBottom: '3px',
                  }}
                />
              </ComponentWithTooltip>
            </div>
            <input
              type="number"
              name="multiplier"
              ref={register}
              className={`${errors.multiplier ? 'coaliton-form-error' : ''}`}
              required
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6} xs={12}>
            <label className="label-input form-input">Data Inicial*</label>
            <input
              type="date"
              name="startDate"
              ref={register}
              className={`${errors.startDate ? 'coaliton-form-error' : ''}`}
              required
            />
          </Col>
          <Col sm={6} xs={12}>
            <label className="label-input form-input">Data Final*</label>
            <input
              type="date"
              name="endDate"
              ref={register}
              className={`${errors.endDate ? 'coaliton-form-error' : ''}`}
              required
            />
          </Col>
        </Row>
        <Row className="button-disclaimer-row">
          <Col className="input-fields-container">
            <span className="span-fields-required">*Campos obrigatórios</span>
            <button
              type="submit"
              className="button-default -action -small align-center"
            >
              SALVAR
            </button>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default ModalBenefit;
