import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Row, Col, Modal } from 'react-bootstrap';
import { format } from 'date-fns';

import { ReactComponent as Check } from '../../../img/prod-icons/check.svg';

import { convertUTCtoTimeZone } from '../../../utils/functions';

import MyDatatable from '../../../components/datatable/MyDatatable';
import MyCustomsearch from '../components/control-custom-search';
import Actions from '../../../components/actions-dropdown';

import ModalGiveBack from '../modals/modal-give-back';
import ModalLostFoundDetail from '../modals/modal-lostfound-details';

import { useSession } from '../../../hooks/Session';
import { useMall } from '../../../hooks/Mall';

import ApiClient from '../../../services/api';
import PopUp from '../../../utils/PopUp';

const api = new ApiClient();
const popUp = new PopUp();

const actions = ['Ver mais', 'Imprimir'];

const SectionControl = () => {
  const { sessionSpot } = useSession();
  const { mallId, setMallId } = useMall();

  const [showModalGiveBack, setShowModalGiveBack] = useState(false);
  const [showModalLostFoundDetail, setShowModalLostFoundDetail] = useState(
    false
  );
  const [lostFound, setLostFound] = useState();
  const [whoFound, setWhoFound] = useState();
  const [whoLost, setWhoLost] = useState();
  const [lostFoundId, setLostFoundId] = useState();

  const [datatableData, setDatatableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLostFound = useCallback(() => {
    setLoading(true);
    setDatatableData([]);
    if (mallId) {
      api
        .getLostFounds(mallId)
        .then(result => {
          const transformedData = result.map(data => {
            const rowArray = [];
            rowArray.push(data.dateTime);
            rowArray.push(data.item);
            rowArray.push(data.description);
            rowArray.push(data.location);
            rowArray.push([data.id, data.returned]);
            rowArray.push(data.id);
            return rowArray;
          });
          setDatatableData(transformedData);
        })
        .catch(() => {
          setDatatableData([]);
        })
        .finally(() => setLoading(false));
    }
  }, [mallId]);

  useEffect(() => loadLostFound(), [loadLostFound]);

  const handleMallChange = useCallback(id => setMallId(id), [setMallId]);

  const customSearchComponent = useCallback(
    (searchText, handleSearch, hideSearch) => {
      return (
        <MyCustomsearch
          malls={sessionSpot.malls}
          searchText={searchText}
          onSearch={handleSearch}
          onHide={hideSearch}
          onMallChange={handleMallChange}
          currentMallId={mallId}
        />
      );
    },
    [sessionSpot.malls, handleMallChange, mallId]
  );

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

  const handleActionClick = useCallback(
    async (id, action) => {
      if (action === 'Ver mais') {
        const {
          lostFound: lostFoundGiveBack,
          input: whoFoundGiveBack,
          output: whoLostGiveBack,
        } = await api.getLostFound(id, mallId);

        setLostFoundId(id);
        setLostFound(lostFoundGiveBack);
        setWhoFound(whoFoundGiveBack);
        whoLostGiveBack && setWhoLost(whoLostGiveBack.customer);
        setShowModalLostFoundDetail(true);
      }
      if (action === 'Imprimir') {
        popUp.processPromises(
          'Imprimindo ...',
          api.exportLostFound(mallId, id),
          {
            successCallback: result => {
              const retrievedPDF = new Blob([result], {
                type: 'application/pdf',
              });
              const url = window.URL.createObjectURL(retrievedPDF);
              window.open(url);
            },
          }
        );
      }
    },
    [mallId]
  );

  const handleGiveBackButtonClick = useCallback(
    async id => {
      const {
        lostFound: lostFoundGiveBack,
        input: whoFoundGiveBack,
      } = await api.getLostFound(id, mallId);

      setLostFoundId(id);
      setLostFound(lostFoundGiveBack);
      setWhoFound(whoFoundGiveBack);
      setShowModalGiveBack(true);
    },
    [mallId]
  );

  const handleModalGiveBackSubmit = useCallback(() => {
    loadLostFound();
    setShowModalGiveBack(false);
  }, [loadLostFound]);

  const datatableColumns = useMemo(
    () => [
      {
        name: 'Data/Hora',
        options: {
          filter: false,
          customBodyRender: value => {
            return (
              <p style={{ margin: '0' }}>
                {format(convertUTCtoTimeZone(value), `dd/MM/yyyy 'às' HH:mm`)}
              </p>
            );
          },
        },
      },
      {
        name: 'Item',
        options: {
          filter: false,
        },
      },
      {
        name: 'Descrição',
        options: {
          filter: false,
        },
      },
      {
        name: 'Local',
        options: {
          filter: false,
        },
      },
      {
        name: 'Devolução',
        options: {
          filter: false,
          customBodyRender: ([id, returned]) => {
            if (mallId && returned === true) {
              return (
                <div className="returned">
                  <Check className="returned-image" alt="Returned" />
                  DEVOLVIDO
                </div>
              );
            }
            return (
              <button
                className="button-give-back"
                type="button"
                onClick={() => handleGiveBackButtonClick(id)}
              >
                DEVOLVER
              </button>
            );
          },
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
    [handleActionClick, handleGiveBackButtonClick, mallId]
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
              textAlign: 'left',
              width: '180px',
            },
            '&:nth-child(2)': {
              textAlign: 'left',
            },
            '&:nth-child(3)': {
              textAlign: 'left',
            },
            '&:nth-child(4)': {
              textAlign: 'left',
              width: '250px',
            },
            '&:nth-child(5)': {
              width: '140px',
            },
            '&:nth-child(6)': {
              width: '120px',
            },
          },
        },
        MUIDataTableBodyCell: {
          root: {
            '&:nth-child(2)': {
              textAlign: 'left',
              width: '180px',
            },
            '&:nth-child(4)': {
              textAlign: 'left',
            },
            '&:nth-child(6)': {
              textAlign: 'left',
            },
            '&:nth-child(8)': {
              textAlign: 'left',
              width: '250px',
            },
            '&:nth-child(10)': {
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
      <Row>
        <Modal
          show={showModalGiveBack}
          size="lg"
          aria-labelledby="example-custom-modal-styling-title"
          centered
          onHide={() => {}}
        >
          <button
            type="button"
            onClick={() => setShowModalGiveBack(false)}
            className="modal-close-button"
          >
            <img src="/icons/action-icons/close.svg" alt="Close" />
          </button>

          <ModalGiveBack
            onSubmit={handleModalGiveBackSubmit}
            lostFound={lostFound}
            lostFoundId={lostFoundId}
            whoFound={whoFound}
          />
        </Modal>
        <Modal
          show={showModalLostFoundDetail}
          size="xl"
          aria-labelledby="example-custom-modal-styling-title"
          centered
          onHide={() => {}}
        >
          <button
            type="button"
            onClick={() => setShowModalLostFoundDetail(false)}
            className="modal-close-button"
          >
            <img src="/icons/action-icons/close.svg" alt="Close" />
          </button>

          <ModalLostFoundDetail
            lostFound={lostFound}
            lostFoundId={lostFoundId}
            whoLost={whoLost}
            whoFound={whoFound}
          />
        </Modal>
      </Row>
    </>
  );
};

export default SectionControl;
