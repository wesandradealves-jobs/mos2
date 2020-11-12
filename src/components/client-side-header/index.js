import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { FiSearch } from 'react-icons/fi';
import { Modal } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import _ from 'lodash';
import { format, parseISO } from 'date-fns';

import ApiClient from '../../services/api';
import ClientForm from '../client-form';

import { useClient } from '../../hooks/Client';

const api = new ApiClient();

const ClientSideHeader = forwardRef(({ mallId }, ref) => {
  const { clientCpf, setClientCpf, fetchClient, client } = useClient();

  const inputClientRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [dataToggled, setDataToggled] = useState(false);
  const [engagementToggled, setEngagementToggled] = useState(false);

  const loadClient = useCallback(async () => {
    if (mallId && clientCpf) {
      try {
        await fetchClient(clientCpf, mallId);
      } catch {
        if (inputClientRef.current && inputClientRef.current.select) {
          inputClientRef.current.select.select.clearValue();
        }
        if (inputClientRef.current && inputClientRef.current.optionsCache) {
          inputClientRef.current.optionsCache = {};
        }
      }
    }
  }, [clientCpf, mallId, fetchClient]);

  useEffect(() => {
    loadClient();
  }, [loadClient]);

  useImperativeHandle(ref, () => ({
    loadClient: () => loadClient(),
  }));

  const handleClientFormSubmit = useCallback(() => {
    loadClient();
    setShowModal(false);
  }, [loadClient]);

  const clientsOptions = useCallback(
    (inputValue, callback) => {
      if (
        (/\d/.test(inputValue) && inputValue.length === 11) ||
        (!/\d/.test(inputValue) && inputValue.length >= 3)
      ) {
        api.searchCustomers(mallId, inputValue).then(response => {
          callback(response);
        });
        return true;
      }
      callback([]);
      return true;
    },
    [mallId]
  );

  const handleClientChange = useCallback(
    clientSelected => {
      if (clientSelected) {
        setClientCpf(clientSelected.cpf);
      } else {
        setClientCpf('');
      }
    },
    [setClientCpf]
  );

  const clienteCategory = useMemo(() => {
    let src;
    let text;
    if (client.category) {
      src = client.category.uri;
      text = `Cliente ${client.category.name}`;
    }
    if (client.cluster) {
      switch (client.cluster) {
        case 'suspect':
          src = '/icons/customer-category-icons/suspect.svg';
          text = 'Suspect';
          break;
        case 'prospect':
          src = '/icons/customer-category-icons/prospect.svg';
          text = 'Prospect';
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
    return { src, text };
  }, [client.category, client.cluster]);

  const avatar = useMemo(() => {
    if (client.fullName) {
      const fullNameSplitted = client.fullName.split(' ');
      const firstLetter = fullNameSplitted[0].charAt(0);
      const secontLetter = fullNameSplitted[fullNameSplitted.length - 1].charAt(
        0
      );
      return firstLetter + secontLetter;
    }
    return '--';
  }, [client.fullName]);

  const accumulatedPoints = useMemo(() => {
    if (client.pointsData) {
      if (
        client.pointsData.accumulatedPoints ||
        client.pointsData.accumulatedPoints === 0
      ) {
        return (
          <span>
            <strong>{client.pointsData.accumulatedPoints}</strong>
            {` pontos acumulados`}
          </span>
        );
      }
      return <></>;
    }
    return <span>-- pontos acumulados</span>;
  }, [client.pointsData]);

  const validPoints = useMemo(() => {
    if (client.pointsData) {
      if (
        client.pointsData.validPoints ||
        client.pointsData.validPoints === 0
      ) {
        return (
          <span>
            {` Saldo de Pontos `}
            <strong>{client.pointsData.validPoints}</strong>
          </span>
        );
      }
      return <></>;
    }
    return <span>-- pontos válidos</span>;
  }, [client.pointsData]);

  const pointsToExpire = useMemo(() => {
    if (client.pointsData) {
      if (
        client.pointsData.pointsToExpire &&
        client.pointsData.pointsToExpire.points &&
        client.pointsData.pointsToExpire.expireDate
      ) {
        return (
          <span>
            <strong>{client.pointsData.pointsToExpire.points}</strong>
            {' pontos a expirar em '}
            <strong>
              {format(
                parseISO(client.pointsData.pointsToExpire.expireDate),
                'dd/MM/yyyy'
              )}
            </strong>
          </span>
        );
      }
      return <span>sem pontos a expirar</span>;
    }
    return <span>-- pontos a expirar em --/--/--</span>;
  }, [client.pointsData]);

  const categoryDowngrade = useMemo(() => {
    if (client.pointsData) {
      if (
        client.pointsData.categoryDowngrade &&
        client.pointsData.categoryDowngrade.points &&
        client.pointsData.categoryDowngrade.downgradeDate
      ) {
        return (
          <span>
            {`Cliente precisa de `}
            <strong>{client.pointsData.categoryDowngrade.points}</strong>
            {` pontos até `}
            <strong>
              {format(
                parseISO(client.pointsData.categoryDowngrade.downgradeDate),
                'dd/MM/yyyy'
              )}
            </strong>
            {` para se manter na categoria`}
          </span>
        );
      }
      return <></>;
    }
    return (
      <span>
        Cliente precisa de -- pontos até --/--/-- para se manter na categoria
      </span>
    );
  }, [client.pointsData]);

  return (
    <aside className="client-side-header">
      <div className="search">
        <FiSearch size={20} />
        <AsyncSelect
          name="customer"
          ref={inputClientRef}
          className="basic-multi-select"
          loadOptions={_.debounce(clientsOptions, 500)}
          getOptionLabel={option => option.fullName}
          getOptionValue={option => option}
          loadingMessage={() => 'Carregando'}
          noOptionsMessage={() => 'Sem opção'}
          onChange={handleClientChange}
          cacheOptions
          isClearable
          placeholder="Pesquisar cliente por nome ou cpf"
        />
      </div>
      {client.fullName && (
        <div className="top">
          <div className="client">
            {clienteCategory.src && (
              <img src={clienteCategory.src} alt="Category" />
            )}
            <div className="header">
              <h6 className="title">
                <strong>
                  {client.fullName && client.fullName.split(' ')[0]}
                </strong>
                {client.fullName &&
                  `
                ${client.fullName
                  .split(' ')
                  .slice(1)
                  .join(' ')}`}
              </h6>
              {clienteCategory.text && (
                <span className="title -small">{clienteCategory.text}</span>
              )}
            </div>
          </div>
          <button type="button" onClick={() => setShowModal(true)}>
            <img src="/icons/rascunho.svg" alt="Edit" />
          </button>
        </div>
      )}
      <div className="main">
        <div className="customer-avatar">
          <div id="border">
            <div className="avatar">{avatar}</div>
          </div>
        </div>
        <div className="customer-info">
          <div className="info">
            <span>Dados Cadastrais</span>
            <button type="button" onClick={() => setDataToggled(!dataToggled)}>
              <img src="/icons/function-icons/add.svg" alt="Cliente" />
            </button>
            <div className={`tooltip -top -${dataToggled ? 'show' : 'hide'}`}>
              <div className="item">CPF: {client.cpf}</div>
              <div className="item">{`Nascimento: ${
                client.birthday
                  ? format(parseISO(client.birthday), 'dd/MM/yyyy')
                  : ''
              }`}</div>
              <div className="item">
                {`Cadastro: ${
                  client.registerDate
                    ? format(parseISO(client.registerDate), 'dd/MM/yyyy')
                    : ''
                }`}
              </div>
              <div className="item">CEP: {client.zipCode}</div>
              <div className="item">Celular: {client.mobileNumber}</div>
              <div className="item">E-mail: {client.email}</div>
            </div>
          </div>
          <div className="info">
            <span>Engajamento</span>
            <button
              type="button"
              onClick={() => setEngagementToggled(!engagementToggled)}
            >
              <img src="/icons/function-icons/add.svg" alt="Cliente" />
            </button>
            <div
              className={`tooltip -top -${engagementToggled ? 'show' : 'hide'}`}
            >
              <div className="item">{`${
                client.engagementData ? client.engagementData.monthlyVisits : ''
              } visitas/mês:`}</div>
              <div className="item">{`uso app / mês: ${
                client.engagementData
                  ? client.engagementData.monthlyAppInteractions
                  : ''
              }`}</div>
              <div className="item">{`última visita: ${
                client.engagementData && client.engagementData.lastVisit
                  ? format(
                      parseISO(client.engagementData.lastVisit),
                      'dd/MM/yyyy'
                    )
                  : ''
              }`}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <h5>Pontuação</h5>
        <p>{accumulatedPoints}</p>
        <p>{validPoints}</p>
        <p>{pointsToExpire}</p>
        <p>{categoryDowngrade}</p>
      </div>
      <Modal
        show={showModal}
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
        centered
        onHide={() => {
          setShowModal(false);
        }}
      >
        <button
          type="button"
          onClick={() => setShowModal(false)}
          className="modal-close-button"
        >
          <img src="/icons/action-icons/close.svg" alt="Close" />
        </button>
        <ClientForm
          mallId={mallId}
          client={client}
          onSubmit={handleClientFormSubmit}
        />
      </Modal>
    </aside>
  );
});

export default ClientSideHeader;
