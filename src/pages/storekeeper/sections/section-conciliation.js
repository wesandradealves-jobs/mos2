import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { format, getMonth, getYear, parseISO } from 'date-fns';

import MyDatatable from '../../../components/datatable/MyDatatable';
import ConciliationCustomSearch from '../components/conciliation-custom-search';

const SectionConciliation = ({ mock }) => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [selectedType, setSelectedType] = useState('credit_card');

  const [datatableOptions, setDatatableOption] = useState([]);

  const [datatableData, setDatatableData] = useState([]);
  const [loading, setLoading] = useState(true);

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
        },
      },
    },
  };

  const loadTransactions = useCallback(async () => {
    try {
      const chooseDate = parseISO(selectedDate);

      const data = mock.transactions.filter(t => {
        const month = parseInt(t.date.split('/')[1], 10) - 1;
        const year = parseInt(t.date.split('/')[2], 10);

        return (
          year === getYear(chooseDate) &&
          month === getMonth(chooseDate) &&
          t.type === selectedType
        );
      });
      const transformedData = data.map(transaction => {
        const row = [];
        row.push(transaction.date);
        row.push(transaction.name);
        row.push(transaction.description);
        row.push(transaction.value);
        return row;
      });
      setDatatableData(transformedData);
    } catch {
      setDatatableData([]);
    } finally {
      setLoading(false);
    }
  }, [mock.transactions, selectedDate, selectedType]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

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
    ],
    []
  );

  const handleDateChange = useCallback(
    date => {
      setSelectedDate(date);
      loadTransactions();
    },
    [loadTransactions]
  );

  const handleTypeChange = useCallback(
    type => {
      setSelectedType(type);
      loadTransactions();
    },
    [loadTransactions]
  );

  const customSearchComponent = useCallback(
    (searchText, handleSearch) => {
      return (
        <ConciliationCustomSearch
          searchText={searchText}
          onSearch={handleSearch}
          onDateChange={handleDateChange}
          onTypeChange={handleTypeChange}
        />
      );
    },
    [handleDateChange, handleTypeChange]
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
    </>
  );
};

export default SectionConciliation;
