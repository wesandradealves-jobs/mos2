import React, { useCallback, useState, useEffect, useMemo } from 'react';
import MaskedInput from 'react-text-mask';
import { Row, Col, Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as Yup from 'yup';

import MyFileSelector from '../../../components/my-fileselector';

import loanTerm from '../../../assets/docs/LoanTerm.pdf';
import { itemStatus } from '../../../config/loan';

import { useMall } from '../../../hooks/Mall';
import { useSession } from '../../../hooks/Session';

import {
  convertUTCtoTimeZone,
  getCpfNumbers,
  getMobileNumbers,
  getCepNumbers,
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

import ApiClient from '../../../services/api';
import PopUp from '../../../utils/PopUp';

const api = new ApiClient();
const popUp = new PopUp();

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

const ModalGiveBack = ({ onSubmit, lostFoundId, lostFound, whoFound }) => {
  const {
    register,
    handleSubmit,
    errors,
    watch,
    getValues,
    setError,
    setValue,
    clearError,
  } = useForm({
    validationSchema: ValidationSchema,
    mode: 'onBlur',
    defaultValues: {
      status: lostFound.status,
      item: lostFound.itemName,
      location: lostFound.locationName,
      description: lostFound.description,
      sex: 'DEFAULT',
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

  const { employee } = useSession();
  const { isMallWithClub, mallId } = useMall();

  const [customerSearch, setCustomerSearch] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [clubCategory, setClubCategory] = useState(false);
  const [cluster, setCluster] = useState(false);

  const [acceptanceTermId, setAcceptanceTermId] = useState('');

  const clearCustomerInputs = useCallback(() => {
    setValue('zipCode', '');
    setValue('fullName', '');
    setValue('sex', 'DEFAULT');
    setValue('birthday', '');
    setValue('email', '');
    setValue('mobileNumber', '');

    setClubCategory(false);
    setCluster(false);
    setValue('dataUsageAcceptanceChannel', 'DEFAULT');
  }, [setValue]);

  useEffect(() => {
    const loadCustomer = async () => {
      clearCustomerInputs();
      clearError();

      if (!customerSearch || customerSearch.length !== 11) {
        return;
      }

      let customerFound;
      try {
        customerFound = await api.getCustomer(mallId, customerSearch);
        setNewCustomer(false);
      } catch {
        setNewCustomer(true);
        return;
      }

      customerFound.zipCode &&
        setValue('zipCode', fillCepMask(customerFound.zipCode));
      setValue('fullName', customerFound.fullName);
      setValue('sex', customerFound.sex);
      setValue('birthday', customerFound.birthday);
      setValue('email', customerFound.email);
      customerFound.mobileNumber &&
        setValue('mobileNumber', fillMobileMask(customerFound.mobileNumber));

      isMallWithClub
        ? setClubCategory(customerFound.category)
        : setCluster(customerFound.cluster);
    };
    loadCustomer();
  }, [
    clearCustomerInputs,
    clearError,
    customerSearch,
    isMallWithClub,
    mallId,
    setValue,
  ]);

  const handleCpfChange = useCallback(
    event => setCustomerSearch(getCpfNumbers(event.target.value)),
    []
  );

  const handleCpfLostFocus = useCallback(
    event => {
      if (watch('fullName') === '') {
        setCustomerSearch(getCpfNumbers(event.target.value));
      }
    },
    [watch]
  );

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

  const giveBack = useCallback(
    (formData, termId, dataUsageChannel) => {
      const lostFoundGiveBack = {
        return: true,
        observation: formData.observation,
        employeeId: employee.id,
      };

      const output = {
        customer: {
          cpf: getCpfNumbers(formData.cpf),
          mobileNumber: getMobileNumbers(formData.mobileNumber),
          fullName: formData.fullName,
          sex: formData.sex,
          birthday: formData.birthday,
          zipCode: getCepNumbers(formData.zipCode),
          email: formData.email,
          ...(formData.clubDesire === 'yes' && {
            clubAcceptanceChannel:
              dataUsageChannel === 'print' ? 'email' : dataUsageChannel,
          }),
          ...(termId && { dataAcceptanceTermId: termId }),
        },
      };

      const updatedLostFound = {
        lostFound: lostFoundGiveBack,
        output,
      };

      popUp.processPromises(
        'Devolvendo item...',
        api.updateLostFound(lostFoundId, mallId, updatedLostFound),
        {
          successCallback: () => {
            onSubmit();
          },
          successMsg: 'Item devolvido com sucesso!',
        }
      );
    },
    [employee.id, lostFoundId, mallId, onSubmit]
  );

  const handleGiveBackClick = useCallback(
    async formData => {
      if (formData.dataUsageAcceptanceChannel === 'print') {
        const { id } = await api.sendDataUsageAcceptanceTerm(mallId, {
          channel: 'print',
        });
        giveBack(formData, id, 'print');
        return;
      }

      let termId = acceptanceTermId;
      let accepted = false;

      if (termId) {
        ({ accepted } = await api.checkDataUsageAcceptanceTerm(mallId, termId));
      }

      if (accepted || !newCustomer) {
        giveBack(formData, termId, formData.dataUsageAcceptanceChannel);
      } else {
        popUp.showConfirmation(
          'Cliente não aceitou os termos. Aguarde sua aceitação via E-mail/SMS ou imprima para uma aprovação manual.',
          async () => {
            ({ id: termId } = await api.sendDataUsageAcceptanceTerm(mallId, {
              channel: 'print',
            }));
            window.open(loanTerm);
            giveBack(formData, termId, 'print');
          },
          'IMPRIMIR',
          'AGUARDAR'
        );
      }
    },
    [acceptanceTermId, giveBack, mallId, newCustomer]
  );

  const handleObservationChange = useCallback(element => {
    element.target.style.height = '40px';
    element.target.style.height = `${element.target.scrollHeight}px`;
  }, []);

  const handleDataUsageAcceptanceChannelChange = useCallback(event => {
    if (event.target.value === 'print') {
      window.open(loanTerm);
    }
  }, []);

  const handleSendDataUsageAcceptanceTermClick = useCallback(() => {
    const channel = getValues('dataUsageAcceptanceChannel');
    const email = getValues('email') || '';
    const mobileNumber = getValues('mobileNumber') || '';

    if (channel === 'email' && email === '') {
      setError('email', 'required');
      return;
    }
    if (channel === 'sms' && mobileNumber === '') {
      setError('mobileNumber', 'required');
      return;
    }

    popUp.processPromises(
      'Enviando termo de...',
      api.sendLostFoundAcceptanceTerm(mallId, {
        channel,
        ...(channel === 'email' && { email }),
        ...(channel === 'sms' && {
          mobileNumber: getMobileNumbers(mobileNumber),
        }),
      }),
      {
        successCallback: ({ id }) => {
          setAcceptanceTermId(id);
        },
        successMsg: `Termo enviado com sucesso. Aguarde o aceite do cliente para liberar a devolução do item.`,
        successMsgTime: 3000,
      }
    );
  }, [getValues, mallId, setError]);

  const ClubChoice = useMemo(() => {
    let text;
    let src;

    if (clubCategory || cluster) {
      if (cluster) {
        switch (cluster) {
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
      if (clubCategory) {
        src = clubCategory.uri;
        text = `Cliente ${clubCategory.name}`;
      }

      return (
        <div className="form-input already-client">
          {isMallWithClub && (
            <label className="label-input">Cliente já faz parte do clube</label>
          )}
          <div>
            <img src={src} alt="Category" />
            <label className="label-input">{text}</label>
          </div>
        </div>
      );
    }

    if (isMallWithClub) {
      return (
        <>
          <label className="label-input club-desire form-input active">
            Cliente deseja fazer parte do clube?
          </label>
          <Row className="radio-buttons-container">
            <Col
              md={3}
              className="radio-button-container"
              id="club-desire-choice"
            >
              <label className="checkbox">
                <input
                  type="radio"
                  name="clubDesire"
                  ref={register}
                  value="yes"
                  defaultChecked
                />
                <span className="checkmark" />
                <span className="radio-label-text">Sim</span>
              </label>
            </Col>

            <Col md={3} className="radio-button-container">
              <label className="checkbox">
                <input
                  type="radio"
                  name="clubDesire"
                  ref={register}
                  value="no"
                />
                <span className="checkmark" />
                <span className="radio-label-text">Não</span>
              </label>
            </Col>
          </Row>
        </>
      );
    }
    return <></>;
  }, [clubCategory, cluster, isMallWithClub, register]);

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
          <h5>DEVOLVER ITEM</h5>
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
          <label className="label-input form-input">CPF*</label>
          <MaskedInput
            name="cpf"
            mask={cpfMask}
            ref={t => t && register(t.inputElement)}
            onChange={handleCpfChange}
            onBlur={handleCpfLostFocus}
            type="text"
            className={`${errors.cpf ? 'coaliton-form-error' : ''}`}
            required
          />
        </Col>
        <Col>
          <label className="label-input form-input">CEP*</label>
          <MaskedInput
            ref={t => t && register(t.inputElement)}
            defaultValue=""
            mask={cepMask}
            type="text"
            name="zipCode"
            className={`${errors.zipCode ? 'coaliton-form-error' : ''}`}
            required
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} xs={12}>
          <label className="label-input form-input">NOME*</label>
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
        <Col lg={6} xs={12}>
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
        <Col lg={6} xs={12}>
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
      <Row lg={12} md={12}>
        <Col lg={6} xs={12}>
          <label className="label-input form-input">E-mail*</label>
          <input
            type="text"
            name="email"
            ref={register}
            className={`${errors.email ? 'coaliton-form-error' : ''}`}
            required
          />
        </Col>
        <Col lg={6} xs={12}>
          <label className="label-input form-input">Telefone*</label>
          <MaskedInput
            ref={t => t && register(t.inputElement)}
            mask={phoneMask}
            type="text"
            name="mobileNumber"
            className={`${errors.mobileNumber ? 'coaliton-form-error' : ''}`}
            required
          />
        </Col>
      </Row>
      <Row>
        <Col lg={6} xs={12}>
          {ClubChoice}
        </Col>
        <Col lg={6} xs={12}>
          {(newCustomer || (isMallWithClub && !clubCategory)) && (
            <>
              <label className="label-input form-input">ENVIAR TERMOS*</label>
              <div className="lostfound-acceptance-channel">
                <select
                  name="dataUsageAcceptanceChannel"
                  ref={register}
                  defaultValue="DEFAULT"
                  className={`${
                    errors.dataUsageAcceptanceChannel
                      ? 'coaliton-form-error'
                      : watch('dataUsageAcceptanceChannel') &&
                        watch('dataUsageAcceptanceChannel') !== 'DEFAULT' &&
                        ' -selected'
                  }`}
                  onChange={handleDataUsageAcceptanceChannelChange}
                >
                  <option value="DEFAULT" disabled>
                    -- Selecione --
                  </option>
                  <option value="email">E-mail</option>
                  <option value="sms">SMS</option>
                  <option value="print">Impresso</option>
                </select>
                {['sms', 'email'].indexOf(
                  getValues('dataUsageAcceptanceChannel')
                ) !== -1 && (
                  <button
                    className="button-default -small"
                    onClick={handleSendDataUsageAcceptanceTermClick}
                  >
                    ENVIAR
                  </button>
                )}
              </div>
            </>
          )}
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
            className={`${
              errors.status
                ? 'coaliton-form-error'
                : watch('status') !== 'DEFAULT' && ' -selected'
            }`}
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
          <input name="location" ref={register} type="text" required disabled />
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
            <div className="comment">
              <div className="avatar">{getAvatar(employee.name)}</div>
              <textarea
                name="observation"
                ref={register}
                className={`textComment ${watch('observation') && ' -filled'}`}
                placeholder="Adicionar observação..."
                onKeyDown={handleObservationChange}
              />
            </div>
          </div>
        </Col>
      </Row>
      <Row className="footer-modal">
        <button
          className="button-default -action -small"
          onClick={handleSubmit(handleGiveBackClick)}
        >
          Devolver
        </button>
      </Row>
    </Container>
  );
};

export default ModalGiveBack;
