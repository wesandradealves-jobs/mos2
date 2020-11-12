import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Row, Col, Modal } from 'react-bootstrap';

import MyDatatable from '../../../components/datatable/MyDatatable';
import ExtractCustomSearch from '../components/extract-custom-search';
import ModalAcceptTransaction from '../modals/modal-accept-transaction';

import PopUp from '../../../utils/PopUp';

const popUp = new PopUp();

const SectionExtract = ({ mock }) => {
  const [datatableOptions, setDatatableOption] = useState([]);

  const [datatableData, setDatatableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [transactionId, setTransactionId] = useState();

  const limit = 10;

  const customTableTheme = {
    overrides: {
      MUIDataTableHeadCell: {
        root: {
          '&:nth-child(1)': {
            textAlign: 'left',
            width: '175px',
          },
          '&:nth-child(2)': {
            textAlign: 'left',
          },
          '&:nth-child(3)': {
            textAlign: 'left',
          },
          '&:nth-child(6)': {
            textAlign: 'left',
            width: '200px',
          },
        },
      },
      MUIDataTableBodyCell: {
        root: {
          '&:nth-child(2)': {
            textAlign: 'left',
            width: '175px',
          },
          '&:nth-child(4)': {
            textAlign: 'left',
          },
          '&:nth-child(6)': {
            textAlign: 'left',
          },
          '&:nth-child(12)': {
            textAlign: 'left',
            width: '200px',
          },
        },
      },
    },
  };

  const loadTransactions = useCallback(async () => {
    try {
      const data = mock.transactions;
      const transformedData = data.map(transaction => {
        const row = [];
        row.push(transaction.date);
        row.push(transaction.name);
        row.push(transaction.description);
        row.push(transaction.installment);
        row.push(transaction.value);
        row.push([transaction.id, transaction.status]);
        return row;
      });
      setDatatableData(transformedData);
    } catch {
      setDatatableData([]);
    } finally {
      setLoading(false);
    }
  }, [mock.transactions]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleAccept = useCallback(async (event, id) => {
    event.preventDefault();
    setShowModal(true);
    setTransactionId(id);
  }, []);

  const handleReverse = useCallback(
    async (event, id) => {
      event.preventDefault();
      popUp.showConfirmation('Deseja confirmar o estorno?', () => {
        const transactionIndex = mock.transactions.findIndex(t => t.id === id);
        if (transactionIndex >= 0) {
          mock.transactions[transactionIndex].status = 'rejected';
        }
        loadTransactions();
        popUp.showSuccess('Estorno realizado com sucesso.');
      });
    },
    [loadTransactions, mock.transactions]
  );

  const datatableColumns = useMemo(
    () => [
      {
        name: 'Data/Hora',
        options: {
          filter: true,
        },
      },
      {
        name: 'Nome do Cliente',
        options: {
          filter: true,
        },
      },
      {
        name: 'Descrição',
        options: {
          filter: true,
        },
      },
      {
        name: 'Parcelas',
        options: {
          filter: true,
          customBodyRender: value => {
            return <p style={{ margin: '0' }}>{`${value.toString()}x`}</p>;
          },
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
        name: 'Ação',
        options: {
          filter: false,
          customBodyRender: ([id, status]) => {
            switch (status) {
              case 'pending':
                return (
                  <div className="extract-actions">
                    <button
                      className="button-accept"
                      type="button"
                      onClick={event => handleAccept(event, id)}
                    >
                      ACEITAR
                    </button>
                    <button
                      className="button-reverse"
                      type="button"
                      onClick={event => handleReverse(event, id)}
                    >
                      ESTORNAR
                    </button>
                  </div>
                );
              case 'accepted':
                return (
                  <div className="extract-processed">
                    <img src="/icons/prod-icons/check.svg" alt="Aceite" />
                    <p>Compra aceita</p>
                  </div>
                );
              case 'rejected':
                return (
                  <div className="extract-processed">
                    <img src="/icons/prod-icons/left-arrow.svg" alt="Estorno" />
                    <p>Compra estornada</p>
                  </div>
                );
              default:
                return <></>;
            }
          },
        },
      },
    ],
    [handleAccept, handleReverse]
  );

  const customSearchComponent = useCallback((searchText, handleSearch) => {
    return (
      <ExtractCustomSearch searchText={searchText} onSearch={handleSearch} />
    );
  }, []);

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

  const handleModalAcceptTransactionSubmit = useCallback(
    (id, controlNumber) => {
      const transactionIndex = mock.transactions.findIndex(t => t.id === id);
      if (transactionIndex >= 0) {
        mock.transactions[transactionIndex].status = 'accepted';
        mock.transactions[transactionIndex].controlNumber = controlNumber;
      }
      loadTransactions();
      setShowModal(false);
      popUp.showSuccess('Transação aceita com sucesso.');
    },
    [loadTransactions, mock.transactions]
  );

  return (
    <>
      <Row>
        <Col xs={12}>
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
            <ModalAcceptTransaction
              onSubmit={(id, controlNumber) =>
                handleModalAcceptTransactionSubmit(id, controlNumber)
              }
              transactionId={transactionId}
            />
          </Modal>
        </Col>
      </Row>
    </>
  );
};

export default SectionExtract;
