import React, { useCallback, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { Row, Col } from 'react-bootstrap';
import MaskedInput from 'react-text-mask';
import _ from 'lodash';

import ComponentWithTooltip from '../../../components/withTooltip';
import { currency } from '../../../utils/masks';
import { useMall } from '../../../hooks/Mall';
import { useClient } from '../../../hooks/Client';

import { useSession } from '../../../hooks/Session';

import ApiClient from '../../../services/api';
import PopUp from '../../../utils/PopUp';
import { getMoneyFloat } from '../../../utils/functions';

const api = new ApiClient();

const popUp = new PopUp();

const ValidationSchema = Yup.object().shape({
  mall: Yup.string().required(),
  store: Yup.object().required(),
  issueDate: Yup.string().required(),
  invoiceNumber: Yup.string().required(),
  value: Yup.string().required(),
});

const SectionNewNote = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    errors,
    setValue,
    watch,
  } = useForm({
    validationSchema: ValidationSchema,
    defaultValues: {
      store: null,
      tags: [],
      value: '',
    },
    mode: 'onBlur',
  });

  const { malls, employee } = useSession();
  const { mallId, setMallId } = useMall();
  const { clientCpf } = useClient();

  const [tagsCacheOption, setTagsCacheOption] = useState(true);
  const [storesCacheOption, setStoresCacheOption] = useState(true);

  const handleMallChange = useCallback(
    event => {
      setMallId(event.target.value);
      setValue('store', '');
      setValue('tags', '');
      setTagsCacheOption(false);
      setStoresCacheOption(false);
    },
    [setValue, setMallId]
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

  const tagsOptions = useCallback(
    (inputValue, callback) => {
      if (mallId && inputValue.length >= 3) {
        api
          .getTags(mallId, {
            search: inputValue,
            isEnabled: true,
            isExpired: false,
          })
          .then(response => {
            const { data } = response;
            callback(data);
          });
        return true;
      }
      callback([]);
      return true;
    },
    [mallId]
  );

  const saveNote = useCallback(
    data => {
      popUp.processPromises(
        'Inserindo nota...',
        api.createTransactions(mallId, clientCpf, {
          storeId: data.store.id,
          value: getMoneyFloat(data.value),
          date: data.issueDate,
          invoiceNumber: data.invoiceNumber,
          ...(data.tags &&
            data.tags.length > 0 && {
              tags: data.tags.map(tag => tag.id),
            }),
          employeeId: employee.id,
        }),
        {
          successCallback: () => {
            setTimeout(() => onSubmit(), 2000);
            reset({
              store: {},
              tags: [],
              value: '',
            });
          },
          successMsg: 'NOTA INSERIDA COM SUCESSO!',
        }
      );
    },

    [clientCpf, mallId, onSubmit, reset, employee.id]
  );

  const handleInputInteger = useCallback(event => {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      charCode === 46 ||
      (charCode > 31 && (charCode < 48 || charCode > 57))
    ) {
      event.preventDefault();
      return false;
    }
    return true;
  }, []);

  return (
    <form className="form-coalition-note">
      <Row lg={12} md={12}>
        <Col lg={12} md={12} xs={12}>
          <h5>INFORMAÇÕES DA NOTA</h5>
        </Col>
      </Row>
      <Row lg={12} md={12} style={{ marginTop: '50px' }}>
        <Col lg={6} md={6} xs={12}>
          <label className="label-input form-input">SHOPPING*</label>
          <select
            name="mall"
            ref={register}
            defaultValue={mallId || 'DEFAULT'}
            onChange={handleMallChange}
            className={`${
              errors.mall
                ? 'coaliton-form-error'
                : malls.length > 1 && ' -selected'
            }`}
            disabled={malls.length === 1}
            required
          >
            <option value="DEFAULT" disabled>
              -- Selecione --
            </option>
            {malls ? (
              malls.map(mall => (
                <option value={mall.id} key={mall.id}>
                  {mall.name}
                </option>
              ))
            ) : (
              <option>Loading</option>
            )}
          </select>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <label className="label-input form-input">LOJA*</label>
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
            cacheOptions={storesCacheOption}
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
      </Row>
      <Row lg={12} md={12}>
        <Col lg={6} md={6} xs={12}>
          <label className="label-input form-input">DATA DE EMISSÃO*</label>
          <input
            type="date"
            name="issueDate"
            ref={register}
            className={`${errors.issueDate ? 'coaliton-form-error' : ''}`}
            required
          />
        </Col>
        <Col lg={6} md={6} xs={12}>
          <label className="label-input form-input">VALOR DA NOTA*</label>
          <Controller
            as={MaskedInput}
            control={control}
            mask={currency}
            name="value"
            type="text"
            className={`${errors.value ? 'coaliton-form-error' : ''}`}
            required
          />
        </Col>
      </Row>
      <Row lg={12} md={12}>
        <Col lg={6} md={6} xs={12}>
          <div className="tool-tip">
            <label className="label-input form-input">NÚMERO DA NOTA*</label>
            <ComponentWithTooltip
              title="Insira o número da NFC-e localizado na nota fiscal emitida"
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
            ref={register}
            onKeyPress={handleInputInteger}
            maxLength="9"
            type="text"
            name="invoiceNumber"
            className={`${errors.invoiceNumber ? 'coaliton-form-error' : ''}`}
            required
          />
        </Col>
        <Col lg={6} md={6} xs={12}>
          <div className="tool-tip">
            <label
              className="label-input form-input"
              style={{ marginBottom: '7px' }}
            >
              MULTIPLICADOR DE PONTOS
            </label>
            <ComponentWithTooltip
              title="Multiplicadores são tags criadas para conceder um valor de pontos maior que a nota fornece. Digite o multiplicador adequado para a nota inserida"
              styles={{
                span: {
                  position: 'absolute',
                  bottom: '90%',
                  left: '60%',
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
            name="tags"
            className="basic-multi-select"
            loadOptions={_.debounce(tagsOptions, 500)}
            getOptionLabel={option => option.name}
            getOptionValue={option => option.name}
            loadingMessage={() => 'Carregando'}
            noOptionsMessage={() => 'Sem opção'}
            cacheOptions={tagsCacheOption}
            isMulti
            styles={{
              control: base => ({
                ...base,
                borderColor:
                  watch('tags') &&
                  watch('tags').length > 0 &&
                  '#54bbab !important',
              }),
            }}
          />
        </Col>
      </Row>

      <Row className="button-disclaimer-row">
        <Col className="input-fields-container">
          <span className="span-fields-required">*Campos obrigatórios</span>
          <button
            className="button-default -action -small align-center"
            onClick={handleSubmit(saveNote)}
            disabled={!clientCpf}
          >
            INSERIR
          </button>
        </Col>
      </Row>
    </form>
  );
};

export default SectionNewNote;
