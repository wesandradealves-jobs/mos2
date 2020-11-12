import React, { useCallback } from 'react';
import MaskedInput from 'react-text-mask';
import { Row, Col, Container } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { itemStatus } from '../../../config/loan';

import { useMall } from '../../../hooks/Mall';
import { useSession } from '../../../hooks/Session';

import { convertUTCtoTimeZone } from '../../../utils/functions';
import { cpf as cpfMask, phone as phoneMask } from '../../../utils/masks';

import ApiClient from '../../../services/api';
import PopUp from '../../../utils/PopUp';

const api = new ApiClient();
const popUp = new PopUp();

const ModalGiveBack = ({ onSubmit, loanId, customer, loan }) => {
  const { register, handleSubmit, errors, watch, control } = useForm({
    mode: 'onBlur',
    defaultValues: {
      cpf: customer.cpf,
      mobileNumber: customer.mobileNumber,
      email: customer.email,
      fullName: customer.fullName,
      itemTypeName: loan.loanItem.typeName,
      tag: loan.loanItem.tag,
      status: loan.loanItem.status,
    },
  });

  const { mallId } = useMall();
  const { employee } = useSession();

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

  const handleGiveBack = useCallback(
    formData => {
      const promises = [];

      promises.push(
        api
          .updateLoan(loanId, mallId, {
            loan: {
              return: true,
              observation: formData.observation,
              employeeId: employee.id,
            },
          })
          .then(() =>
            api.updateLoanItem(mallId, loan.loanItem.id, {
              status: formData.status,
              inventoryNumber: loan.loanItem.inventoryNumber,
              model: loan.loanItem.model,
            })
          )
      );

      popUp.processPromises('Devolvendo item...', Promise.all(promises), {
        successCallback: () => {
          onSubmit();
        },
        successMsg: 'Item devolvido com sucesso!',
      });
    },
    [
      employee.id,
      loan.loanItem.id,
      loan.loanItem.inventoryNumber,
      loan.loanItem.model,
      loanId,
      mallId,
      onSubmit,
    ]
  );

  const handleObservationChange = useCallback(element => {
    element.target.style.height = '40px';
    element.target.style.height = `${element.target.scrollHeight}px`;
  }, []);

  return (
    <Container className="modal-giveBack">
      <Row className="title">
        <Col>
          <h5>DADOS DO EMPRÉSTIMO</h5>
        </Col>
      </Row>
      <Row className="subtitle">
        <Col>
          <p>{`Nº ${loanId}`}</p>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <label className="label-input form-input">NOME DO CLIENTE</label>
          <input name="fullName" ref={register} type="text" required disabled />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
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
        <Col xs={12} md={6}>
          <label className="label-input form-input">TELEFONE</label>
          <Controller
            as={MaskedInput}
            mask={phoneMask}
            control={control}
            type="text"
            name="mobileNumber"
            disabled
            required
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <label className="label-input form-input">E-mail</label>
          <input name="email" ref={register} type="text" required disabled />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={4}>
          <label className="label-input form-input">ITEM</label>
          <input
            name="itemTypeName"
            ref={register}
            type="text"
            required
            disabled
          />
        </Col>
        <Col xs={12} md={4}>
          <label className="label-input form-input">ID</label>
          <input name="tag" ref={register} type="text" required disabled />
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
      <Row>
        <Col>
          <div className="observation">
            <h5>OBSERVAÇÕES</h5>
            {loan.observations &&
              loan.observations.map(observation => (
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
          onClick={handleSubmit(handleGiveBack)}
        >
          Devolver
        </button>
      </Row>
    </Container>
  );
};

export default ModalGiveBack;
