import React, { useCallback, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import MaskedInput from 'react-text-mask';
import { Row, Col } from 'react-bootstrap';
import {
  cpf as cpfMask,
  cep as cepMask,
  phone as phoneMask,
} from '../../../utils/masks';

import {
  validateCpf,
  validateMobileNumber,
  validateCep,
} from '../../../utils/validators';
import {
  getCepNumbers,
  getCpfNumbers,
  getMobileNumbers,
  fillCpfMask,
  fillCepMask,
  fillMobileMask,
} from '../../../utils/functions';

import { useSession } from '../../../hooks/Session';
import { useMall } from '../../../hooks/Mall';
import { useClient } from '../../../hooks/Client';

import ApiClient from '../../../services/api';
import PopUp from '../../../utils/PopUp';

const api = new ApiClient();

const popUp = new PopUp();

const ValidationSchema = Yup.object().shape({
  mall: Yup.string().required(),
  cpf: Yup.string().test('validate cpf', '', validateCpf),
  sex: Yup.string()
    .required()
    .oneOf(['F', 'M', 'O']),
  birthday: Yup.string().required(),
  fullName: Yup.string().required(),
  email: Yup.string()
    .email()
    .required(),
  mobileNumber: Yup.string().test('validate mobile', '', validateMobileNumber),
  zipCode: Yup.string().test('validate cep', '', validateCep),
  dataAcceptanceChannel: Yup.string()
    .required()
    .oneOf(['email', 'sms']),
});

const SectionNewClient = () => {
  const { malls, employee } = useSession();
  const { mallId, setMallId } = useMall();
  const { client } = useClient();

  const [cpfFound, setCpfFound] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    errors,
    watch,
    setValue,
  } = useForm({
    validationSchema: ValidationSchema,
    mode: 'onBlur',
    defaultValues: {
      mall: mallId,
    },
  });

  useEffect(() => {
    if (client.cpf) {
      setCpfFound(true);
      setValue('cpf', fillCpfMask(client.cpf));
      setValue('sex', client.sex);
      setValue('birthday', client.birthday);
      setValue('fullName', client.fullName);
      setValue('email', client.email);
      setValue('zipCode', fillCepMask(client.zipCode));
      setValue('mobileNumber', fillMobileMask(client.mobileNumber));
      setValue('dataAcceptanceChannel', client.dataAcceptanceChannel);
    }
  }, [client, setValue]);

  const handleMallChange = useCallback(
    event => {
      setMallId(event.target.value);
    },
    [setMallId]
  );

  const saveClient = useCallback(
    async data => {
      popUp.processPromises(
        'Cadastrando cliente...',
        api.createCustomer(mallId, {
          cpf: getCpfNumbers(data.cpf),
          fullName: data.fullName,
          sex: data.sex,
          birthday: data.birthday,
          email: data.email,
          mobileNumber: getMobileNumbers(data.mobileNumber),
          zipCode: getCepNumbers(data.zipCode),
          dataAcceptanceChannel: data.dataAcceptanceChannel,
          employeeId: employee.id,
        }),
        {
          successCallback: () => {
            reset({
              cpf: '',
              zipCode: '',
              mobileNumber: '',
            });
          },
          successMsg: 'Cliente cadastrado com sucesso!',
        }
      );
    },
    [mallId, reset, employee.id]
  );

  const handleCpfChange = useCallback(
    event => {
      const cpf = getCpfNumbers(event.target.value);
      if (cpf.length === 11) {
        api
          .getCustomer(mallId, cpf)
          .then(() => {
            popUp.showWarning('Cliente já cadastrado');
            setCpfFound(true);
          })
          .catch(() => {
            setCpfFound(false);
          });
      } else {
        setCpfFound(false);
      }
    },
    [mallId]
  );

  const handleCleanButtonClick = useCallback(
    event => {
      event.preventDefault();
      reset({
        cpf: '',
        zipCode: '',
        mobileNumber: '',
      });
      setCpfFound(false);
    },
    [reset]
  );

  return (
    <form>
      <Row>
        <Col>
          <h5>DADOS DO CLIENTE</h5>
        </Col>
      </Row>
      <Row lg={12} md={12} style={{ marginTop: '50px' }}>
        <Col lg={6} md={6} xs={12}>
          <label className="label-input form-input">Shopping*</label>
          <select
            name="mall"
            ref={register}
            defaultValue={mallId || 'DEFAULT'}
            className={`${
              errors.mall
                ? 'coaliton-form-error'
                : watch('mall') &&
                  watch('mall') !== 'DEFAULT' &&
                  malls.length > 1 &&
                  ' -selected'
            }`}
            onChange={handleMallChange}
            disabled={malls.length === 1}
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
          <label className="label-input form-input">CPF*</label>
          <MaskedInput
            name="cpf"
            mask={cpfMask}
            ref={t => t && register(t.inputElement)}
            onChange={handleCpfChange}
            type="text"
            className={`${errors.cpf ? 'coaliton-form-error' : ''}`}
            required
          />
        </Col>
      </Row>
      <Row lg={12} md={12}>
        <Col lg={6} md={6} xs={12}>
          <label className="label-input form-input">Gênero*</label>
          <select
            name="sex"
            ref={register}
            defaultValue="DEFAULT"
            className={`${
              errors.sex
                ? 'coaliton-form-error'
                : watch('sex') && watch('sex') !== 'DEFAULT' && ' -selected'
            }`}
          >
            <option value="DEFAULT" disabled>
              -- Selecione --
            </option>
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
            <option value="O">Outros</option>
          </select>
        </Col>
        <Col lg={6} md={6} xs={12}>
          <label className="label-input form-input">Data de Nascimento*</label>
          <input
            type="date"
            name="birthday"
            ref={register}
            className={`${errors.birthday ? 'coaliton-form-error' : ''}`}
            required
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} xs={12}>
          <label className="label-input form-input">Nome Completo*</label>
          <input
            type="text"
            name="fullName"
            ref={register}
            className={`${errors.fullName ? 'coaliton-form-error' : ''}`}
            required
          />
        </Col>
      </Row>
      <Row lg={12} md={12}>
        <Col lg={6} md={6} xs={12}>
          <label className="label-input form-input">E-mail*</label>
          <input
            type="text"
            name="email"
            ref={register}
            className={`${errors.email ? 'coaliton-form-error' : ''}`}
            required
          />
        </Col>
        <Col lg={6} md={6} xs={12}>
          <label className="label-input form-input">Telefone*</label>
          <Controller
            as={MaskedInput}
            control={control}
            mask={phoneMask}
            type="text"
            name="mobileNumber"
            className={`${errors.mobileNumber ? 'coaliton-form-error' : ''}`}
            required
          />
        </Col>
      </Row>
      <Row lg={12} md={12}>
        <Col lg={6} md={6} xs={12}>
          <label className="label-input form-input">CEP*</label>
          <Controller
            as={MaskedInput}
            control={control}
            mask={cepMask}
            type="text"
            name="zipCode"
            className={`${errors.zipCode ? 'coaliton-form-error' : ''}`}
            required
          />
        </Col>
        <Col lg={6} md={6} xs={12}>
          <label className="label-input form-input">
            ENVIAR TERMO DE ACEITAÇÃO*
          </label>
          <select
            name="dataAcceptanceChannel"
            ref={register}
            defaultValue="DEFAULT"
            className={`${
              errors.dataAcceptanceChannel
                ? 'coaliton-form-error'
                : watch('dataAcceptanceChannel') &&
                  watch('dataAcceptanceChannel') !== 'DEFAULT' &&
                  ' -selected'
            }`}
          >
            <option value="DEFAULT" disabled>
              -- Selecione --
            </option>
            <option value="email">E-mail</option>
            <option value="sms">SMS</option>
          </select>
        </Col>
      </Row>

      <Row className="button-disclaimer-row clean-button">
        <Col className="input-fields-container">
          <span className="span-fields-required">*Campos obrigatórios</span>
          <button
            className="button-default -action -small align-center "
            onClick={handleSubmit(saveClient)}
            disabled={cpfFound}
          >
            CADASTRAR
          </button>
          <button
            type="reset"
            className="button-default -small clean"
            onClick={event => handleCleanButtonClick(event)}
          >
            LIMPAR
          </button>
        </Col>
      </Row>
    </form>
  );
};

export default SectionNewClient;
