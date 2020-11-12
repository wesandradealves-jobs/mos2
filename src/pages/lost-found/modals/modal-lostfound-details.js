import React, { useCallback, useMemo } from 'react';
import MaskedInput from 'react-text-mask';
import { Row, Col, Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as Yup from 'yup';

import { itemStatus } from '../../../config/loan';
import MyFileSelector from '../../../components/my-fileselector';

import {
  convertUTCtoTimeZone,
  fillCpfMask,
  fillCepMask,
  fillMobileMask,
} from '../../../utils/functions';
import {
  cpf as cpfMask,
  phone as phoneMask,
  cep as cepMask,
} from '../../../utils/masks';
import {
  validateCpf,
  validateMobileNumber,
  validateCep,
} from '../../../utils/validators';

const ValidationSchema = Yup.object().shape({
  cpf: Yup.string().test('validate cpf', '', validateCpf),
  zipCode: Yup.string().test('min cep', '', validateCep),
  sex: Yup.string()
    .required()
    .oneOf(['F', 'M', 'O']),
  birthday: Yup.string().required(),
  fullName: Yup.string().required(),
  email: Yup.string()
    .email()
    .required(),
  mobileNumber: Yup.string().test('validate mobile', '', validateMobileNumber),
  dataUsageAcceptanceChannel: Yup.string().oneOf(['email', 'sms', 'print']),
});

const ModalLostFoundDetails = ({
  lostFoundId,
  lostFound,
  whoFound,
  whoLost = null,
}) => {
  const { register } = useForm({
    validationSchema: ValidationSchema,
    mode: 'onBlur',
    defaultValues: {
      status: lostFound.status,
      item: lostFound.itemName,
      location: lostFound.locationName,
      description: lostFound.description,
      ...(whoLost &&
        whoLost && {
          cpf: fillCpfMask(whoLost.cpf),
          fullName: whoLost.fullName,
          sex: whoLost.sex,
          zipCode: fillCepMask(whoLost.zipCode),
          birthday: whoLost.birthday,
          mobileNumber: fillMobileMask(whoLost.mobileNumber),
          email: whoLost.email,
        }),
      ...(whoFound &&
        whoFound.customer && {
          whoFound_customerName: whoFound.customer.fullName,
          whoFound_email: whoFound.customer.email,
          whoFound_mobileNumber: fillMobileMask(whoFound.customer.mobileNumber),
        }),
      ...(whoFound &&
        whoFound.employee && {
          whoFound_employeeName: whoFound.employee.fullName,
          whoFound_companyName: whoFound.employee.companyName,
        }),
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

  const ClubChoice = useMemo(() => {
    let text;
    let src;

    if (
      whoLost &&
      whoLost.customer &&
      (whoLost.clubCategory || whoLost.cluster)
    ) {
      if (whoLost.cluster) {
        switch (whoLost.cluster) {
          case 'suspect':
            src = '/icons/customer-category-icons/suspect.svg';
            text = 'Cliste Suspect';
            break;
          case 'prospect':
            src = '/icons/customer-category-icons/prospect.svg';
            text = 'Cliente Prospect';
            break;
          case 'active':
            src = '/icons/customer-category-icons/active.svg';
            text = 'Cliente Ativo';
            break;
          default:
            src = '';
            text = '';
        }
      }
      if (whoLost.clubCategory) {
        src = whoLost.clubCategory.uri;
        text = `Cliente ${whoLost.clubCategory.name}`;
      }

      return (
        <div className="form-input already-client">
          <div>
            <img src={src} alt="Category" />
            <label className="label-input">{text}</label>
          </div>
        </div>
      );
    }
    return <></>;
  }, [whoLost]);

  const WhoFoundComponent = useMemo(() => {
    if (whoFound && whoFound.customer) {
      return (
        <>
          <Row>
            <Col md={6} xs={12}>
              <label className="label-input form-input">NOME</label>
              <input
                type="text"
                name="whoFound_customerName"
                ref={register}
                disabled
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} xs={12}>
              <label className="label-input form-input">E-MAIL</label>
              <input
                type="text"
                name="whoFound_email"
                ref={register}
                disabled
              />
            </Col>
            <Col md={6} xs={12}>
              <label className="label-input form-input">TELEFONE</label>
              <input
                type="text"
                name="whoFound_mobileNumber"
                ref={register}
                disabled
              />
            </Col>
          </Row>
        </>
      );
    }
    if (whoFound && whoFound.employee) {
      return (
        <>
          <Row>
            <Col md={6} xs={12}>
              <label className="label-input form-input">
                NOME DO FUNCIONÁRIO
              </label>
              <input
                type="text"
                name="whoFound_employeeName"
                ref={register}
                disabled
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <label className="label-input form-input">EMPRESA</label>
              <input
                type="text"
                name="whoFound_companyName"
                ref={register}
                disabled
              />
            </Col>
          </Row>
        </>
      );
    }
    return (
      <Row className="whoFound-unidentified">Cliente não identificado</Row>
    );
  }, [whoFound, register]);

  return (
    <Container className="modal-giveBack-lostFound">
      <Row className="title">
        <Col>
          <h5>DADOS DO ACHADOS E PERDIDOS</h5>
        </Col>
      </Row>
      <Row className="subtitle">
        <Col>
          <p>{`Nº ${lostFoundId}`}</p>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} xs={12}>
          <label className="label-input form-input -subtitle">
            PROPRIETARIO
          </label>
        </Col>
      </Row>
      <Row>
        <Col lg={6} xs={12}>
          <label className="label-input form-input">CPF</label>
          <MaskedInput
            name="cpf"
            mask={cpfMask}
            type="text"
            ref={t => t && register(t.inputElement)}
            disabled
          />
        </Col>
        <Col>
          <label className="label-input form-input">CEP</label>
          <MaskedInput
            ref={t => t && register(t.inputElement)}
            mask={cepMask}
            type="text"
            name="zipCode"
            disabled
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} xs={12}>
          <label className="label-input form-input">NOME</label>
          <input type="text" name="fullName" ref={register} disabled />
        </Col>
      </Row>
      <Row lg={12} md={12}>
        <Col lg={6} xs={12}>
          <label className="label-input form-input">Gênero</label>
          <select name="sex" ref={register} defaultValue="DEFAULT" disabled>
            <option value="DEFAULT" disabled>
              -- Selecione --
            </option>
            <option value="F">Feminino</option>
            <option value="M">Masculino</option>
            <option value="O">Outros</option>
          </select>
        </Col>
        <Col lg={6} xs={12}>
          <label className="label-input form-input">Data de Nascimento</label>
          <input type="date" name="birthday" ref={register} disabled />
        </Col>
      </Row>
      <Row lg={12} md={12}>
        <Col lg={6} xs={12}>
          <label className="label-input form-input">E-mail</label>
          <input type="text" name="email" ref={register} disabled />
        </Col>
        <Col lg={6} xs={12}>
          <label className="label-input form-input">Telefone</label>
          <MaskedInput
            ref={t => t && register(t.inputElement)}
            mask={phoneMask}
            type="text"
            name="mobileNumber"
            disabled
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6} xs={12}>
          {ClubChoice}
        </Col>
      </Row>
      <Row className="border-turquoise" />
      <Row>
        <Col xs={12}>
          <label className="label-input form-input -subtitle">
            QUEM ENCONTROU
          </label>
        </Col>
      </Row>
      <>{WhoFoundComponent}</>
      <Row className="border-turquoise" />
      <Row>
        <Col xs={12}>
          <label className="label-input form-input -subtitle">
            SOBRE O ITEM
          </label>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={4}>
          <label className="label-input form-input">ITEM</label>
          <input name="item" ref={register} type="text" required disabled />
        </Col>
        <Col md={4}>
          <label className="label-input form-input">STATUS DO ITEM</label>
          <select
            name="status"
            ref={register({
              validate: value => value !== 'DEFAULT',
            })}
            disabled
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
        <Col xs={12} md={4}>
          <label className="label-input form-input">LOCAL ACHADO</label>
          <input name="location" ref={register} type="text" disabled />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <label className="label-input form-input">DESCRIÇÃO DO ITEM</label>
          <textarea ref={register} name="description" disabled />
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <label className="label-input form-input">FOTOS DO ITEM</label>
        </Col>
        <Col lg={12} md={12}>
          <MyFileSelector disabled defaultFiles={lostFound.photos} />
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="observation">
            <h5>OBSERVAÇÕES</h5>
            {lostFound.observations &&
              lostFound.observations.map(observation => (
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
              ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ModalLostFoundDetails;
