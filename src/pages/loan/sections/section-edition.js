import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Row, Col, Modal } from 'react-bootstrap';

import { itemStatus } from '../../../config/loan';

import ModalAddItem from '../modals/modal-add-item';
import ModalEditItem from '../modals/modal-edit-item';
import MyDatatable from '../../../components/datatable/MyDatatable';
import EditionCustomSearch from '../components/edition-custom-search';
import Actions from '../../../components/actions-dropdown';

import { useSession } from '../../../hooks/Session';
import { useMall } from '../../../hooks/Mall';

import ApiClient from '../../../services/api';
import PopUp from '../../../utils/PopUp';

const api = new ApiClient();
const popUp = new PopUp();

const actions = ['Editar', 'Excluir'];

const SectionEdition = () => {
  const { malls } = useSession();
  const { mallId, setMallId } = useMall();

  const [datatableData, setDatatableData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showModalAddItem, setShowModalAddItem] = useState(false);
  const [showModalEditItem, setShowModalEditItem] = useState(false);

  const [loanItem, setLoanItem] = useState();

  const loadLoanItens = useCallback(async () => {
    if (mallId) {
      try {
        setLoading(true);
        const data = await api.getLoanItems(mallId);
        const transformedData = data.map(item => {
          const rowArray = [];

          rowArray.push(item.tag);
          rowArray.push(item.inventoryNumber);
          rowArray.push(item.typeName);
          rowArray.push(item.model);
          rowArray.push(itemStatus[item.status]);
          rowArray.push([item.id, item.typeId]);
          return rowArray;
        });
        setDatatableData(transformedData);
      } catch {
        setDatatableData([]);
      } finally {
        setLoading(false);
      }
    }
  }, [mallId]);

  useEffect(() => {
    loadLoanItens();
  }, [loadLoanItens]);

  const handleMallChange = useCallback(
    id => {
      setDatatableData([]);
      setMallId(id);
    },
    [setMallId]
  );

  const customSearchComponent = useCallback(
    (searchText, handleSearch, hideSearch) => (
      <EditionCustomSearch
        malls={malls}
        searchText={searchText}
        onSearch={handleSearch}
        onHide={hideSearch}
        renderType="loanControl"
        onMallChange={handleMallChange}
        currentMallId={mallId}
      />
    ),
    [malls, handleMallChange, mallId]
  );

  const handleActionClick = useCallback(
    async ([id, typeId], action) => {
      if (action === 'Excluir') {
        popUp.showConfirmation('Deseja excluir o item?', () => {
          popUp.processPromises(
            'Excluindo item...',
            api.deleteLoanItem(mallId, id, typeId),
            {
              successCallback: () => {
                const newDatatableData = datatableData.filter(
                  row =>
                    row[row.length - 1][0] !== id ||
                    row[row.length - 1][1] !== typeId
                );
                setDatatableData(newDatatableData);
              },
              successMsg: 'Item excluído com sucesso!',
            }
          );
        });
      }
      if (action === 'Editar') {
        api.getLoanItem(mallId, id).then(data => {
          setLoanItem(data);
          setShowModalEditItem(true);
        });
      }
    },
    [datatableData, mallId]
  );

  const handleModalAddItemSubmit = useCallback(() => {
    loadLoanItens();
    setShowModalAddItem(false);
  }, [loadLoanItens]);

  const handleModalEditItemSubmit = useCallback(() => {
    loadLoanItens();
    setShowModalEditItem(false);
  }, [loadLoanItens]);

  const datatableOptions = useMemo(() => {
    const options = {
      print: false,
      filter: true,
      download: false,
      textLabels: {
        body: {
          noMatch: loading
            ? 'Carregando'
            : 'Desculpe, nenhum registro encontrado',
        },
      },
      customSearchRender: customSearchComponent,
    };
    return options;
  }, [customSearchComponent, loading]);

  const datatableColumns = useMemo(
    () => [
      {
        name: 'Id',
        options: {
          filter: true,
        },
      },
      {
        name: 'N° do Patrimonio',
        options: {
          filter: true,
        },
      },
      {
        name: 'Item',
        options: {
          filter: true,
        },
      },
      {
        name: 'Modelo do item',
        options: {
          filter: true,
        },
      },
      {
        name: 'Status',
        options: {
          filter: true,
        },
      },
      {
        name: 'Ação',
        options: {
          filter: false,
          customBodyRender: value => {
            return (
              <Actions
                value={value}
                onActionClick={handleActionClick}
                actions={actions}
              />
            );
          },
        },
      },
    ],
    [handleActionClick]
  );

  const customTableTheme = useMemo(
    () => ({
      overrides: {
        MUIDataTableToolbar: {
          icon: {
            display: 'none',
          },
        },
        MUIDataTableHeadCell: {
          root: {
            '&:nth-child(1)': {
              width: '100px',
            },
            '&:nth-child(2)': {
              textAlign: 'left',
            },
            '&:nth-child(3)': {
              textAlign: 'left',
              width: '250px',
            },
            '&:nth-child(4)': {
              textAlign: 'left',
            },
            '&:nth-child(5)': {
              width: '180px',
            },
            '&:nth-child(6)': {
              width: '140px',
            },
          },
        },
        MUIDataTableBodyCell: {
          root: {
            '&:nth-child(2)': {
              width: '100px',
            },
            '&:nth-child(4)': {
              textAlign: 'left',
            },
            '&:nth-child(6)': {
              textAlign: 'left',
              width: '250px',
            },
            '&:nth-child(8)': {
              textAlign: 'left',
            },
            '&:nth-child(10)': {
              width: '180px',
            },
            '&:nth-child(12)': {
              width: '140px',
            },
          },
        },
      },
    }),
    []
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
      <Row className="button-add-new-data-row">
        <Col>
          <button
            className="button-default -action -small align-center"
            onClick={() => {
              setShowModalAddItem(true);
            }}
            style={{ marginTop: '10px' }}
          >
            ADICIONAR ITEM
          </button>
        </Col>
      </Row>
      <Modal
        show={showModalAddItem}
        size="xl"
        aria-labelledby="example-custom-modal-styling-title"
        centered
        onHide={() => {}}
      >
        <button
          type="button"
          onClick={() => setShowModalAddItem(false)}
          className="modal-close-button"
        >
          <img src="/icons/action-icons/close.svg" alt="Close" />
        </button>

        <ModalAddItem onSubmit={handleModalAddItemSubmit} />
      </Modal>
      <Modal
        show={showModalEditItem}
        size="xl"
        aria-labelledby="example-custom-modal-styling-title"
        centered
        onHide={() => {}}
      >
        <button
          type="button"
          onClick={() => setShowModalEditItem(false)}
          className="modal-close-button"
        >
          <img src="/icons/action-icons/close.svg" alt="Close" />
        </button>

        <ModalEditItem
          onSubmit={handleModalEditItemSubmit}
          loanItem={loanItem}
        />
      </Modal>
    </>
  );
};

export default SectionEdition;
