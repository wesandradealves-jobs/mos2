import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { Row, Col } from 'react-bootstrap';
import MaskedInput from 'react-text-mask';

import loanTerm from '../../../assets/docs/LoanTerm.pdf';

import {
  cpf as cpfMask,
  cep as cepMask,
  phone as phoneMask,
} from '../../../utils/masks';

import AvailableProducts from '../components/available-products';

import { useSession } from '../../../hooks/Session';
import { useMall } from '../../../hooks/Mall';

import {
  validateCpf,
  validateMobileNumber,
  validateCep,
} from '../../../utils/validators';
import {
  getCpfNumbers,
  getMobileNumbers,
  getCepNumbers,
  fillCepMask,
  fillMobileMask,
} from '../../../utils/functions';

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
  zipCode: Yup.string().test('min cep', '', validateCep),
  loanAcceptanceChannel: Yup.string()
    .required()
    .oneOf(['email', 'sms', 'print']),
});

const NewOccurrence = () => {
  const {
    register,
    handleSubmit,
    control,
    errors,
    watch,
    setValue,
    getValues,
    setError,
    clearError,
    reset,
  } = useForm({
    validationSchema: ValidationSchema,
    mode: 'onBlur',
  });

  const { malls, employee } = useSession();
  const { mallId, setMallId, isMallWithClub } = useMall();

  const [updateItems, setUpdateItems] = useState(false);

  const [customerFoundCpf, setCustomerFoundCpf] = useState('');
  const [newCustomer, setNewCustomer] = useState('');

  const [clubCategory, setClubCategory] = useState(false);
  const [cluster, setCluster] = useState(false);

  const [itemTypeSelectedId, setItemTypeSelectedId] = useState('');
  const [itemTypeSelectedName, setItemTypeSelectedName] = useState('');
  const [itemSelected, setItemSelected] = useState(null);

  const [acceptanceTermId, setAcceptanceTermId] = useState('');

  const [childClasses, setChildClasses] = useState({
    childSex: '',
    childBirthday: '',
    childRelationship: '',
  });
  const [childData, setChildData] = useState({
    childSex: '',
    childBirthday: '',
    childRelationship: '',
  });

  const handleCpfChange = useCallback(
    event => setCustomerFoundCpf(getCpfNumbers(event.target.value)),
    []
  );

  const handleCpfLostFocus = useCallback(
    event => {
      if (watch('fullName') === '') {
        setCustomerFoundCpf(getCpfNumbers(event.target.value));
      }
    },
    [watch]
  );

  const clearCustomerInputs = useCallback(() => {
    setValue('zipCode', '');
    setValue('fullName', '');
    setValue('sex', 'DEFAULT');
    setValue('birthday', '');
    setValue('email', '');
    setValue('mobileNumber', '');

    setClubCategory(false);
    setCluster(false);
  }, [setValue]);

  useEffect(() => {
    const loadCustomer = async () => {
      clearCustomerInputs();

      if (!customerFoundCpf || customerFoundCpf.length !== 11) {
        return;
      }

      let customerFound;
      try {
        customerFound = await api.getCustomer(mallId, customerFoundCpf);
        setNewCustomer(false);
      } catch {
        setNewCustomer(true);
        return;
      }

      clearError();

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
    clearError,
    clearCustomerInputs,
    customerFoundCpf,
    isMallWithClub,
    mallId,
    setValue,
  ]);

  const handleMallChange = useCallback(event => setMallId(event.target.value), [
    setMallId,
  ]);

  const handleChildInputChange = useCallback(
    event => {
      if (event.target.value && event.target.value !== 'DEFAULT') {
        setChildClasses({ ...childClasses, [event.target.name]: '-selected' });
      } else {
        setChildClasses({
          ...childClasses,
          [event.target.name]: 'coaliton-form-error',
        });
      }
      setChildData({ ...childData, [event.target.name]: event.target.value });
    },
    [childClasses, childData]
  );

  const checkChildData = useCallback(() => {
    let checked = true;
    const newClasses = {};

    Object.entries(childData).forEach(([key, value]) => {
      if (!value) {
        newClasses[key] = 'coaliton-form-error';
        checked = false;
      } else {
        newClasses[key] = '-selected';
      }
    });

    setChildClasses(newClasses);
    return checked;
  }, [childData]);

  const handleSendLoanAcceptanceTermClick = useCallback(async () => {
    const channel = watch('loanAcceptanceChannel');
    const email = watch('email') || '';
    const mobileNumber = watch('mobileNumber') || '';

    if (channel === 'email' && email === '') {
      setError('email', 'required');
      return;
    }
    if (channel === 'sms' && mobileNumber === '') {
      setError('mobileNumber', 'required');
      return;
    }

    popUp.processPromises(
      'Enviando termo de empréstimo...',
      api.sendLoanAcceptanceTerm(mallId, {
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
        successMsg: `Termo enviado com sucesso. Aguarde o aceite do cliente para liberar o empréstimo.`,
        successMsgTime: 3000,
      }
    );
  }, [watch, mallId, setError]);

  const saveLoan = useCallback(
    (formData, termId, loanChannel) => {
      const newLoan = {
        loanItem: {
          id: parseInt(itemSelected, 10),
          typeId: parseInt(itemTypeSelectedId, 10),
        },
        acceptanceTermId: termId,
        ...(formData.observation && { observation: formData.observation }),
        employeeId: employee.id,
        ...(itemTypeSelectedName === 'Carrinho de Bebê' && {
          child: {
            relationship: childData.childRelationship,
            birthday: childData.childBirthday,
            sex: childData.childSex,
          },
        }),
      };
      const loanCustomer = {
        cpf: getCpfNumbers(formData.cpf),
        mobileNumber: getMobileNumbers(formData.mobileNumber),
        fullName: formData.fullName,
        sex: formData.sex,
        birthday: formData.birthday,
        zipCode: getCepNumbers(formData.zipCode),
        email: formData.email,
        ...(formData.clubDesire === 'yes' && {
          clubAcceptanceChannel:
            loanChannel === 'print' ? 'email' : loanChannel,
        }),
      };

      popUp.processPromises(
        'Salvando empréstimo...',
        api.createLoan(mallId, { loan: newLoan, customer: loanCustomer }),
        {
          successCallback: () => {
            reset({
              cpf: '',
              zipCode: '',
              fullName: '',
              birthday: '',
              email: '',
              mobileNumber: '',
              sex: 'DEFAULT',
              loanAcceptanceChannel: 'DEFAULT',
              clubDesire: 'yes',
              observation: '',
            });
            setItemSelected(null);
            setUpdateItems(true);
            setChildData({
              childSex: '',
              childBirthday: '',
              childRelationship: '',
            });
            setChildClasses({
              childSex: '',
              childBirthday: '',
              childRelationship: '',
            });
          },
          successMsg: 'REGISTRO DE EMPRÉSTIMO CONCLUÍDO COM SUCESSO',
        }
      );
    },
    [
      childData.childBirthday,
      childData.childRelationship,
      childData.childSex,
      employee,
      itemSelected,
      itemTypeSelectedId,
      itemTypeSelectedName,
      mallId,
      reset,
    ]
  );

  const handleSaveLoanClick = useCallback(
    async formData => {
      if (!itemSelected) {
        popUp.showWarning('Selecione um item do produto');
        return;
      }
      if (itemTypeSelectedName === 'Carrinho de Bebê' && !checkChildData()) {
        return;
      }

      if (formData.loanAcceptanceChannel === 'print') {
        const { id } = await api.sendLoanAcceptanceTerm(mallId, {
          channel: 'print',
        });
        saveLoan(formData, id, 'print');
        return;
      }

      let termId = acceptanceTermId;
      let accepted = false;

      if (termId) {
        ({ accepted } = await api.checkLoanAcceptanceTerm(mallId, termId));
      }

      if (accepted || !newCustomer) {
        saveLoan(formData, termId, formData.loanAcceptanceChannel);
      } else {
        popUp.showConfirmation(
          'Cliente não aceitou os termos. Aguarde sua aceitação via E-mail/SMS ou imprima para uma aprovação manual.',
          async () => {
            ({ id: termId } = await api.sendLoanAcceptanceTerm(mallId, {
              channel: 'print',
            }));
            window.open(loanTerm);
            saveLoan(formData, termId, 'print');
          },
          'IMPRIMIR',
          'AGUARDAR'
        );
      }
    },
    [
      acceptanceTermId,
      checkChildData,
      itemSelected,
      itemTypeSelectedName,
      mallId,
      newCustomer,
      saveLoan,
    ]
  );

  const handleLoanAcceptanceChannelChange = useCallback(event => {
    if (event.target.value === 'print') {
      window.open(loanTerm);
    }
  }, []);

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

  const handleObservationChange = useCallback(element => {
    element.target.style.height = '45px';
    element.target.style.height = `${element.target.scrollHeight}px`;
  }, []);

  const labelResponsableComponent = useMemo(() => {
    if (itemTypeSelectedName === 'Carrinho de Bebê') {
      return (
        <div>
          <label
            id="relative-data"
            className="label-input label-dados"
            style={{ marginBottom: '10px' }}
          >
            DADOS DO RESPONSÁVEL
          </label>
        </div>
      );
    }
    return null;
  }, [itemTypeSelectedName]);

  const childComponents = useMemo(() => {
    if (itemTypeSelectedName === 'Carrinho de Bebê') {
      return (
        <div className="kids-form">
          <label
            className="label-input label-dados"
            style={{ marginBottom: '10px' }}
          >
            DADOS DA CRIANÇA
          </label>
          <Row>
            <Col xs={12} lg={4}>
              <label className="label-input form-input">PARENTESCO*</label>
              <select
                name="childRelationship"
                onChange={handleChildInputChange}
                onBlur={handleChildInputChange}
                className={childClasses.childRelationship}
                value={childData.childRelationship || 'DEFAULT'}
              >
                <option value="DEFAULT" disabled>
                  -- Selecione --
                </option>
                <option value="son">Filho(a)</option>
                <option value="stepson">Enteado(a)</option>
                <option value="nephew">Sobrinho(a)</option>
                <option value="grandchild">Neto(a)</option>
                <option value="brother">Irmão(a)</option>
                <option value="other">Outros</option>
              </select>
            </Col>
            <Col xs={12} lg={4}>
              <label className="label-input form-input">
                DATA DE NASCIMENTO*
              </label>

              <input
                type="date"
                name="childBirthday"
                onBlur={handleChildInputChange}
                onChange={handleChildInputChange}
                className={childClasses.childBirthday}
                required
                value={childData.childBirthday}
              />
            </Col>
            <Col xs={12} lg={4}>
              <label className="label-input form-input">Gênero*</label>
              <select
                name="childSex"
                value={childData.childSex || 'DEFAULT'}
                onChange={handleChildInputChange}
                onBlur={handleChildInputChange}
                className={childClasses.childSex}
              >
                <option value="DEFAULT" disabled>
                  -- Selecione --
                </option>
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
                <option value="O">Outros</option>
              </select>
            </Col>
          </Row>
        </div>
      );
    }
    return null;
  }, [
    childClasses.childBirthday,
    childClasses.childRelationship,
    childClasses.childSex,
    childData.childBirthday,
    childData.childRelationship,
    childData.childSex,
    handleChildInputChange,
    itemTypeSelectedName,
  ]);

  const clubChoice = useMemo(() => {
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

  return (
    <div className="loan-new-occurrence">
      <Row className="columns">
        <Col md={6} style={{ marginBottom: '15px' }}>
          <Row lg={12} md={12}>
            <Col lg={6} md={6} xs={12}>
              <label className="label-input form-input">Shopping*</label>
              <select
                name="mall"
                ref={register}
                defaultValue={mallId || 'DEFAULT'}
                className={`${
                  errors.mall
                    ? 'coaliton-form-error'
                    : watch('mall') !== 'DEFAULT' &&
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
          </Row>
          {labelResponsableComponent && (
            <Row style={{ marginTop: '25px' }}>
              <Col>{labelResponsableComponent}</Col>
            </Row>
          )}
          <Row lg={12} md={12}>
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

            <Col lg={6} xs={12}>
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
          <Row>
            <Col lg={12} md={12} xs={12}>
              <label className="label-input form-input">Nome*</label>
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
              <Controller
                as={MaskedInput}
                control={control}
                mask={phoneMask}
                type="text"
                name="mobileNumber"
                className={`${
                  errors.mobileNumber ? 'coaliton-form-error' : ''
                }`}
                required
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6} xs={12} className="club-choice">
              {clubChoice}
            </Col>
            <Col lg={6} xs={12}>
              <label className="label-input form-input">
                ENVIAR TERMO DE EMPRÉSTIMO*
              </label>
              <div className="loan-acceptance-channel">
                <select
                  name="loanAcceptanceChannel"
                  ref={register}
                  defaultValue="DEFAULT"
                  className={`${
                    errors.loanAcceptanceChannel
                      ? 'coaliton-form-error'
                      : watch('loanAcceptanceChannel') &&
                        watch('loanAcceptanceChannel') !== 'DEFAULT' &&
                        ' -selected'
                  }`}
                  onChange={handleLoanAcceptanceChannelChange}
                >
                  <option value="DEFAULT" disabled>
                    -- Selecione --
                  </option>
                  <option value="email">E-mail</option>
                  <option value="sms">SMS</option>
                  <option value="print">Impresso</option>
                </select>
                {['sms', 'email'].indexOf(
                  getValues('loanAcceptanceChannel')
                ) !== -1 && (
                  <button
                    className="button-default -small"
                    onClick={handleSendLoanAcceptanceTermClick}
                  >
                    ENVIAR
                  </button>
                )}
              </div>
            </Col>
          </Row>

          {childComponents && (
            <Row style={{ marginTop: '25px' }}>
              <Col>{childComponents}</Col>
            </Row>
          )}
        </Col>
        <Col md={6}>
          <AvailableProducts
            itemSelectedChange={item => setItemSelected(item)}
            itemTypeChange={(id, name) => {
              setItemTypeSelectedId(id);
              setItemTypeSelectedName(name);
            }}
            reset={updateItems}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="observation">
            <h2>OBSERVAÇÕES</h2>
            <div className="comment">
              <div className="avatar">
                {employee && getAvatar(employee.name)}
              </div>
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
      <Row className="button-disclaimer-row">
        <Col className="input-fields-container">
          <span className="span-fields-required">*Campos obrigatórios</span>
          <button
            className="button-default -action -small align-center "
            onClick={event => {
              itemTypeSelectedName === 'Carrinho de Bebê' && checkChildData();
              handleSubmit(handleSaveLoanClick)(event);
            }}
          >
            SALVAR
          </button>
        </Col>
      </Row>
    </div>
  );
};

export default NewOccurrence;
