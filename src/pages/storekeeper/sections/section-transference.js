import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Row, Col, Modal } from 'react-bootstrap';
import { format, getMonth, getYear, parseISO } from 'date-fns';

import MyDatatable from '../../../components/datatable/MyDatatable';
import TransferenceCustomSearch from '../components/transference-custom-search';
import ModalNewTransference from '../modals/modal-new-transference';

import PopUp from '../../../utils/PopUp';

const popUp = new PopUp();

const SectionTransference = ({ mock }) => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );

  const [datatableOptions, setDatatableOption] = useState([]);

  const [datatableData, setDatatableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const limit = 10;

  const customTableTheme = {
    overrides: {
      MUIDataTableHeadCell: {
        root: {
          '&:nth-child(1)': {
            textAlign: 'left',
          },
        },
      },
      MUIDataTableBodyCell: {
        root: {
          '&:nth-child(2)': {
            textAlign: 'left',
          },
        },
      },
    },
  };

  const loadTranferences = useCallback(async () => {
    try {
      const chooseDate = parseISO(selectedDate);

      const data = mock.transferences.filter(t => {
        const month = parseInt(t.date.split('/')[1], 10) - 1;
        const year = parseInt(t.date.split('/')[2], 10);

        return year === getYear(chooseDate) && month === getMonth(chooseDate);
      });
      const transformedData = data.map(transference => {
        const row = [];
        row.push(transference.bank);
        row.push(transference.account);
        row.push(transference.value);
        row.push(transference.date);
        return row;
      });
      setDatatableData(transformedData);
    } catch {
      setDatatableData([]);
    } finally {
      setLoading(false);
    }
  }, [mock.transferences, selectedDate]);

  useEffect(() => {
    loadTranferences();
  }, [loadTranferences, selectedDate]);

  const datatableColumns = useMemo(
    () => [
      {
        name: 'NOME DO BANCO',
        options: {
          filter: true,
        },
      },
      {
        name: 'CONTA',
        options: {
          filter: true,
        },
      },
      {
        name: 'Valor',
        options: {
          filter: true,
          customBodyRender: value => {
            return (
              <p style={{ margin: '0' }}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(value)}
              </p>
            );
          },
        },
      },
      {
        name: 'DATA DA TRANSFERÊNCIA',
        options: {
          filter: true,
        },
      },
    ],
    []
  );

  const handleDatesChange = useCallback(
    date => {
      setSelectedDate(date);
      loadTranferences();
    },
    [loadTranferences]
  );

  const customSearchComponent = useCallback(
    (searchText, handleSearch) => {
      return (
        <TransferenceCustomSearch
          searchText={searchText}
          onSearch={handleSearch}
          onDateChange={handleDatesChange}
        />
      );
    },
    [handleDatesChange]
  );

  useEffect(() => {
    const options = {
      print: false,
      filter: true,
      download: false,
      rowsPerPage: limit,
      textLabels: {
        body: {
          noMatch: loading
            ? 'Carregando'
            : 'Desculpe, nenhum registro encontrado',
        },
      },
      customSearchRender: customSearchComponent,
    };
    setDatatableOption(options);
  }, [customSearchComponent, loading]);

  const handleDeleteAccount = useCallback(
    id => {
      popUp.showConfirmation('Deseja excluir esta conta?', () => {
        mock.accounts = mock.accounts.filter(acc => acc.id !== id);
        loadTranferences(selectedDate);
        popUp.showSuccess('Conta excluída com sucesso.');
      });
    },
    [loadTranferences, mock.accounts, selectedDate]
  );

  const handleModalNewTransferenceSubmit = useCallback(
    newTransference => {
      mock.transferences.push(newTransference);
      mock.balance -= newTransference.value;
      loadTranferences();
      setShowModal(false);
      popUp.showSuccess('Transferência realizada com sucesso.');
    },
    [loadTranferences, mock.balance, mock.transferences]
  );

  return (
    <>
      <Row>
        <Col xs={12} md={3}>
          <div className="transfer-side-header">
            <div className="balance">
              <h5>Saldo</h5>
              <h1>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(mock.balance)}
              </h1>
              <button
                className="button-default -action -small"
                onClick={() => setShowModal(true)}
              >
                TRANSFERIR
              </button>
            </div>
            <div className="accounts">
              <h5>CONTAS</h5>
              {mock.accounts.map(account => (
                <div className="account" key={account.id}>
                  <div className="bank">
                    <div className="avatar">{account.id}</div>
                    <div className="bankDetails">
                      <strong>{account.name}</strong>
                      <p>{`Ag ${account.agency}`}</p>
                      <p>{`Conta ${account.account}`}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteAccount(account.id)}>
                    <img src="/icons/action-icons/close1.svg" alt="Excluir" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Col>
        <Col xs={12} md={8}>
          <MyDatatable
            data={datatableData}
            columns={datatableColumns}
            options={datatableOptions}
            customTheme={customTableTheme}
          />
        </Col>
      </Row>
      <Row>
        <Col>
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
            <ModalNewTransference
              onSubmit={newTransference =>
                handleModalNewTransferenceSubmit(newTransference)
              }
              balance={mock.balance}
            />
          </Modal>
        </Col>
      </Row>
    </>
  );
};

export default SectionTransference;
