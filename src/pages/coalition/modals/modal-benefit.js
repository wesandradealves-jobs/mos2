/* eslint-disable no-restricted-globals */
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { Row, Col } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { useForm, Controller } from 'react-hook-form';
import _ from 'lodash';

import ComponentWithTooltip from '../../../components/withTooltip';
import ApiClient from '../../../services/api';

const api = new ApiClient();

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  points: Yup.number().required(),
  store: Yup.object().nullable(),
  startDate: Yup.string().required(),
  endDate: Yup.string().required(),
  amountTotalIlimitaded: Yup.boolean(),
  amountTotal: Yup.number().when('amountTotalIlimitaded', {
    is: val => {
      return val === true;
    },
    then: Yup.number()
      .transform(v => (isNaN(v) ? null : v))
      .nullable(true),
    otherwise: Yup.number(),
  }),
  limitPerClientIlimitaded: Yup.boolean(),
  limitPerClient: Yup.number().when('limitPerClientIlimitaded', {
    is: val => {
      return val === true;
    },
    then: Yup.number()
      .transform(v => (isNaN(v) ? null : v))
      .nullable(true),
    otherwise: Yup.number(),
  }),
  loyaltyCategories: Yup.array().test('min loyalty', '', loyaltyCategories => {
    return loyaltyCategories.filter(v => Boolean(v)).length >= 1;
  }),
});

const ModalBenefit = ({
  benefit,
  onSubmit,
  actionType,
  categories,
  mallId,
}) => {
  const {
    register,
    control,
    handleSubmit,
    errors,
    clearError,
    setError,
    getValues,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: benefit.name,
      points: benefit.points,
      store: benefit.store,
      startDate: benefit.startDate,
      endDate: benefit.endDate,
      amountTotal: benefit.amountTotal,
      amountTotalIlimitaded:
        actionType === 'new' ? false : !benefit.amountTotal,
      limitPerClient: benefit.limitPerClient,
      limitPerClientIlimitaded:
        actionType === 'new' ? false : !benefit.limitPerClient,
      rechargeable: benefit.rechargeable ? 'true' : 'false',
      loyaltyCategories: benefit.loyaltyCategories
        ? categories.map(category =>
            benefit.loyaltyCategories.find(c => c.id === category.id)
              ? category.id
              : false
          )
        : [],
    },
    validationSchema: ValidationSchema,
    mode: 'onBlur',
  });

  const [amountTotalDisabled, setAmountTotalDisabled] = useState(
    () => !!getValues('amountTotalIlimitaded')
  );
  const [limitPerClientDisabled, setLimitPerClientDisabled] = useState(
    () => !!getValues('limitPerClientIlimitaded')
  );

  const storeOptions = useCallback(
    (inputValue, callback) => {
      if (mallId && inputValue.length >= 3) {
        api.searchStores(mallId, inputValue).then(response => {
          callback(response);
        });
        return true;
      }
      callback([]);
      return true;
    },
    [mallId]
  );

  const handleFormSubmit = useCallback(
    data => {
      Object.assign(data, {
        rechargeable: data.rechargeable === 'true',
        loyaltyCategories: data.loyaltyCategories
          .filter(category => category)
          .map(id => parseInt(id, 10)),
      });

      onSubmit(data, actionType);
    },
    [onSubmit, actionType]
  );

  const handleInputLoyaltyChange = useCallback(() => {
    const { loyaltyCategories } = getValues({ nest: true });

    if (loyaltyCategories.filter(v => Boolean(v)).length >= 1) {
      clearError('loyaltyCategories');
    } else {
      setError('loyaltyCategories', 'min loyalty');
    }
  }, [clearError, getValues, setError]);

  const handleIlimitadedChange = useCallback(
    (event, reference) => {
      if (reference === 'amountTotal') {
        setAmountTotalDisabled(!amountTotalDisabled);
      }
      if (reference === 'limitPerClient') {
        setLimitPerClientDisabled(!limitPerClientDisabled);
      }
      setValue(reference, null);
      clearError(reference);
    },
    [amountTotalDisabled, clearError, limitPerClientDisabled, setValue]
  );

  return (
    <div className="modal-coalition">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Row>
          <Col>
            <h5>{`${
              actionType === 'new' ? 'ADICIONAR ' : 'EDITAR'
            }   BENEFÍCIO`}</h5>
          </Col>
        </Row>
        <Row style={{ marginTop: '53px' }}>
          <Col xs={12}>
            <label className="label-input form-input">NOME DO BENEFÍCIO*</label>
            <input
              type="text"
              name="name"
              ref={register}
              className={`${errors.name ? 'coaliton-form-error' : ''}`}
              required
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6} xs={12}>
            <div className="tool-tip">
              <label className="label-input form-input">
                EXCLUSIVO DA LOJA
              </label>
              <ComponentWithTooltip
                title="Não selecionando uma loja, o benefício passa a ser válido para todo shopping."
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
            <Controller
              as={<AsyncSelect />}
              control={control}
              name="store"
              className="basic-multi-select"
              loadOptions={_.debounce(storeOptions, 500)}
              getOptionLabel={option => option.name}
              getOptionValue={option => option}
              loadingMessage={() => 'Carregando'}
              noOptionsMessage={() => 'Sem opção'}
              cacheOptions
              isClearable
              styles={{
                control: base => ({
                  ...base,
                  borderColor: errors.store
                    ? '#c53030 !important'
                    : watch('store') && '#54bbab !important',
                }),
              }}
            />
          </Col>
          <Col sm={6} xs={12}>
            <label className="label-input form-input">
              QUANTIDADE DE PONTOS*
            </label>
            <input
              type="number"
              name="points"
              ref={register}
              className={`${errors.points ? 'coaliton-form-error' : ''}`}
              required
            />
          </Col>
        </Row>
        <Row>
          <Col lg={6} xs={12}>
            <div className="div-rechargeable">
              <label className="label-input form-input">
                BENEFÍCIO RECARREGÁVEL?*
              </label>
              <div className="radio-rechargeable">
                <label className="radiobox">
                  <input
                    type="radio"
                    name="rechargeable"
                    value="true"
                    ref={register}
                  />
                  <span className="radiomark" />
                  <span>Sim</span>
                </label>
                <label className="radiobox">
                  <input
                    type="radio"
                    name="rechargeable"
                    value="false"
                    ref={register}
                    defaultChecked
                  />
                  <span className="radiomark" />
                  <span>Não</span>
                </label>
              </div>
            </div>
          </Col>
          <Col lg={6} xs={12}>
            <div className="div-loyalties">
              <label className="label-input form-input">
                EXCLUSIVO PARA CLUBE DE VANTAGENS*
              </label>
              <div className="div-checkbox-coalition">
                {categories &&
                  categories.map((category, index) => (
                    <label className="label-coalition" key={category.id}>
                      <input
                        type="checkbox"
                        name={`loyaltyCategories[${index}]`}
                        ref={register}
                        value={category.id}
                        onChange={handleInputLoyaltyChange}
                      />
                      <span
                        className={`checkmark-coalition  ${
                          errors.loyaltyCategories ? 'coaliton-form-error' : ''
                        }`}
                      />
                      {category.name}
                    </label>
                  ))}
              </div>
            </div>
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
        <Row>
          <Col sm={6} xs={12}>
            <label className="label-input form-input">
              QUANTIDADE DISPONÍVEL*
            </label>
            <input
              type="number"
              name="amountTotal"
              ref={register}
              disabled={amountTotalDisabled}
              className={`${errors.amountTotal ? 'coaliton-form-error' : ''}`}
              required
            />
            <div className="div-checkbox-coalition">
              <label className="label-coalition" id="checkbox-ilimitaded">
                <input
                  type="checkbox"
                  name="amountTotalIlimitaded"
                  ref={register}
                  onChange={event =>
                    handleIlimitadedChange(event, 'amountTotal')
                  }
                />
                <span className="checkmark-coalition" /> ILIMITADO
              </label>
            </div>
          </Col>
          <Col sm={6} xs={12}>
            <label className="label-input form-input">
              QUANTIDADE POR CLIENTE*
            </label>
            <input
              type="number"
              name="limitPerClient"
              ref={register}
              disabled={limitPerClientDisabled}
              className={`${
                errors.limitPerClient ? 'coaliton-form-error' : ''
              }`}
              required
            />
            <div className="div-checkbox-coalition">
              <label className="label-coalition" id="checkbox-ilimitaded">
                <input
                  type="checkbox"
                  name="limitPerClientIlimitaded"
                  ref={register}
                  onChange={event =>
                    handleIlimitadedChange(event, 'limitPerClient')
                  }
                />
                <span className="checkmark-coalition" /> ILIMITADO
              </label>
            </div>
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
