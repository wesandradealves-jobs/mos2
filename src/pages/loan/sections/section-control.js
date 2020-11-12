import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Row, Col, Modal } from 'react-bootstrap';
import { format } from 'date-fns';
import _ from 'lodash';

import { ReactComponent as Check } from '../../../img/prod-icons/check.svg';

import { useSession } from '../../../hooks/Session';
import { useMall } from '../../../hooks/Mall';

import MyDatatable from '../../../components/datatable/MyDatatable';
import ControlCustomSearch from '../components/control-custom-search';
import Actions from '../../../components/actions-dropdown';
import ModalGiveBack from '../modals/modal-give-back';
import ModalLoanDetail from '../modals/modal-loan-details';

import { convertUTCtoTimeZone } from '../../../utils/functions';

import ApiClient from '../../../services/api';
import PopUp from '../../../utils/PopUp';

const api = new ApiClient();
const popUp = new PopUp();

const actions = ['Ver mais', 'Imprimir'];

const rowsPerPage = 10;

const SectionControl = () => {
  const { malls } = useSession();
  const { mallId, setMallId } = useMall();

  const [period, setPeriod] = useState(null);
  const [datatableData, setDatatableData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModalGiveBack, setShowModalGiveBack] = useState(false);
  const [showModalLoanDetail, setShowModalLoanDetail] = useState(false);
  const [loan, setLoan] = useState();
  const [customer, setCustomer] = useState();
  const [loanId, setLoanId] = useState();

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [sortOrder, setSortOrder] = useState('');
  const [columnSorted, setColumnSorted] = useState(null);
  const [searchedText, setSearchedText] = useState('');

  const loadLoans = useCallback(() => {
    setLoading(true);
    setDatatableData([]);
    if (mallId) {
      api
        .getLoans(mallId, {
          page,
          limit: rowsPerPage,
          ...(sortOrder &&
            (columnSorted || columnSorted === 0) && {
              order: sortOrder,
              column: columnSorted,
            }),
          ...(searchedText && { search: searchedText }),
          ...(period && {
            startDate: period.startDate,
            endDate: period.endDate,
          }),
        })
        .then(({ data: loans, total }) => {
          const transformedData = loans.map(data => {
            const rowArray = [];
            rowArray.push(data.dateTime);
            rowArray.push(data.id);
            rowArray.push(data.fullName);
            rowArray.push(data.type);
            rowArray.push([data.id, data.loaned]);
            rowArray.push(data.id);
            return rowArray;
          });
          setDatatableData(transformedData);
          setCount(parseInt(total, 10));
        })
        .catch(() => {
          setDatatableData([]);
        })
        .finally(() => setLoading(false));
    }
  }, [columnSorted, mallId, page, period, searchedText, sortOrder]);

  useEffect(() => loadLoans(), [loadLoans]);

  const handleMallChange = useCallback(id => setMallId(id), [setMallId]);

  const handleExtractPeriodChange = useCallback(({ startDate, endDate }) => {
    if (startDate && endDate) {
      setPeriod({
        startDate: format(startDate.toDate(), 'yyyy-MM-dd'),
        endDate: format(endDate.toDate(), 'yyyy-MM-dd'),
      });
    }
  }, []);

  const customSearchComponent = useCallback(
    (searchText, handleSearch, hideSearch) => {
      return (
        <ControlCustomSearch
          malls={malls}
          searchText={searchText}
          onSearch={handleSearch}
          onHide={hideSearch}
          onMallChange={handleMallChange}
          currentMallId={mallId}
          onPeriodChange={handleExtractPeriodChange}
        />
      );
    },
    [malls, handleMallChange, mallId, handleExtractPeriodChange]
  );

  const handleActionClick = useCallback(
    async (id, action) => {
      if (action === 'Ver mais') {
        const data = await api.getLoan(id, mallId);
        setLoanId(id);
        setLoan(data.loan);
        setCustomer(data.customer);
        setShowModalLoanDetail(true);
      }
      if (action === 'Imprimir') {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        popUp.processPromises(
          'Imprimindo ...',
          api.exportLoan(mallId, id, timezone),
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
      const data = await api.getLoan(id, mallId);
      setLoanId(id);
      setLoan(data.loan);
      setCustomer(data.customer);
      setShowModalGiveBack(true);
    },
    [mallId]
  );

  const handleModalGiveBackSubmit = useCallback(() => {
    loadLoans();
    setShowModalGiveBack(false);
  }, [loadLoans]);

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
      serverSide: true,
      rowsPerPage,
      rowsPerPageOptions: [],
      page,
      count,
      sortOrder,
      onSearchChange: _.debounce(text => setSearchedText(text), 2000),
      onColumnSortChange: (changedColumn, direction) => {
        if (direction === 'ascending') {
          setSortOrder('asc');
        } else if (direction === 'descending') {
          setSortOrder('desc');
        }
      },
      onTableChange: (action, tableState) => {
        switch (action) {
          case 'changePage':
            setPage(tableState.page);
            break;
          case 'sort':
            setColumnSorted(tableState.activeColumn);
            break;
          default:
        }
      },
      customSearchRender: customSearchComponent,
    };
    return options;
  }, [count, customSearchComponent, loading, page, sortOrder]);

  const datatableColumns = useMemo(
    () => [
      {
        name: 'Data',
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
        name: 'Registro',
        options: {
          filter: false,
        },
      },
      {
        name: 'Nome do Cliente',
        options: {
          filter: false,
        },
      },
      {
        name: 'Item',
        options: {
          filter: false,
        },
      },
      {
        name: 'Devolução',
        options: {
          filter: false,
          customBodyRender: ([id, loaned]) => {
            if (mallId && !loaned) {
              return (
                <div className="returned">
                  <Check className="returned-image" alt="Returned" />
                  Devolvido
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
          size="xl"
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
            loan={loan}
            loanId={loanId}
            customer={customer}
          />
        </Modal>
        <Modal
          show={showModalLoanDetail}
          size="xl"
          aria-labelledby="example-custom-modal-styling-title"
          centered
          onHide={() => {}}
        >
          <button
            type="button"
            onClick={() => setShowModalLoanDetail(false)}
            className="modal-close-button"
          >
            <img src="/icons/action-icons/close.svg" alt="Close" />
          </button>

          <ModalLoanDetail loan={loan} loanId={loanId} customer={customer} />
        </Modal>
      </Row>
    </>
  );
};

export default SectionControl;
