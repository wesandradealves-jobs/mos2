import React, { useCallback } from 'react';
import MaskedInput from 'react-text-mask';
import * as Yup from 'yup';
import { Row, Col } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import {
  cpf as cpfMask,
  cep as cepMask,
  phone as phoneMask,
} from '../../utils/masks';

import {
  validateCpf,
  validateMobileNumber,
  validateCep,
} from '../../utils/validators';
import { getMobileNumbers, getCepNumbers } from '../../utils/functions';

import ApiClient from '../../services/api';
import { useSession } from '../../hooks/Session';
import PopUp from '../../utils/PopUp';

const api = new ApiClient();
const popUp = new PopUp();

const ValidationSchema = Yup.object().shape({
  cpf: Yup.string().test('min cpf', '', validateCpf),
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
});

const ClientForm = ({ mallId, client, onSubmit }) => {
  const { employee } = useSession();

  const { register, handleSubmit, control, errors, watch } = useForm({
    defaultValues: {
      fullName: client.fullName,
      cpf: client.cpf,
      birthday: client.birthday,
      sex: client.sex,
      email: client.email,
      mobileNumber: client.mobileNumber,
      zipCode: client.zipCode,
    },
    validationSchema: ValidationSchema,
    mode: 'onBlur',
  });

  const handleFormSubmit = useCallback(
    data => {
      popUp.processPromises(
        'Salvando cliente...',
        api.updateCustomer(mallId, data.cpf, {
          fullName: data.fullName,
          sex: data.sex,
          birthday: data.birthday,
          email: data.email,
          mobileNumber: getMobileNumbers(data.mobileNumber),
          zipCode: getCepNumbers(data.zipCode),
          employeeId: employee.id,
        }),
        {
          successCallback: () => {
            onSubmit();
          },
          successMsg: 'CLIENTE ATUALIZADO COM SUCESSO!',
        }
      );
    },
    [mallId, onSubmit, employee.id]
  );

  return (
    <div className="modal-coalition">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Row>
          <Col>
            <h5>EDITAR CLIENTE</h5>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <label className="label-input form-input">NOME COMPLETO*</label>
            <input
              type="text"
              name="fullName"
              ref={register}
              className={`${errors.fullName ? 'coaliton-form-error' : ''}`}
              required
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6} xs={12}>
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
          <Col sm={6} xs={12}>
            <label className="label-input form-input">Gênero*</label>
            <select
              name="sex"
              ref={register}
              className={`${
                errors.sex
                  ? 'coaliton-form-error'
                  : watch('sex') && ' -selected'
              }`}
            >
              <option value="F">Feminino</option>
              <option value="M">Masculino</option>
              <option value="O">Outros</option>
            </select>
          </Col>
        </Row>
        <Row>
          <Col sm={6} xs={12}>
            <label className="label-input form-input">
              Data de Nascimento*
            </label>
            <input
              type="date"
              name="birthday"
              ref={register}
              className={`${errors.birthday ? 'coaliton-form-error' : ''}`}
              required
            />
          </Col>
          <Col sm={6} xs={12}>
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
        <Row>
          <Col sm={6} xs={12}>
            <label className="label-input form-input">E-mail*</label>
            <input
              type="text"
              name="email"
              ref={register}
              className={`${errors.email ? 'coaliton-form-error' : ''}`}
              required
            />
          </Col>
          <Col sm={6} xs={12}>
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

export default ClientForm;
