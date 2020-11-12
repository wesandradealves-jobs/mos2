import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { format, parseISO } from 'date-fns';

import MyDataTable from '../../../components/datatable/MyDatatable';
import ExtractCustomSearch from '../components/extract-custom-search';

import { useSession } from '../../../hooks/Session';
import { useMall } from '../../../hooks/Mall';
import { useClient } from '../../../hooks/Client';

import ApiClient from '../../../services/api';

const api = new ApiClient();

const datableColumns = [
  {
    name: 'Movimentação',
    options: {
      filter: true,
    },
  },
  {
    name: 'Motivo',
    options: {
      filter: true,
    },
  },
  {
    name: 'Pontos',
    options: {
      filter: false,
      customBodyRender: value => {
        const colors = { red: '#a43043', green: '#76a47c' };
        let color;
        let label;
        if (value > 0) {
          color = colors.green;
          label = `+${value.toString()}`;
        }
        if (value < 0) {
          color = colors.red;
          label = `${value.toString()}`;
        }
        return <p style={{ color, margin: '0' }}>{label}</p>;
      },
    },
  },
  {
    name: 'Data',
    options: {
      filter: false,
      customBodyRender: value => {
        return (
          <p style={{ margin: '0' }}>{format(parseISO(value), 'dd/MM/yyyy')}</p>
        );
      },
    },
  },
  {
    name: 'Responsável',
    options: {
      filter: true,
    },
  },
];

const SectionExtract = () => {
  const { mallId, setMallId } = useMall();
  const { malls } = useSession();
  const { clientCpf } = useClient();

  const [statement, setStatement] = useState([]);
  const [period, setPeriod] = useState(null);

  const [loading, setLoading] = useState(true);

  const limit = 10;

  useEffect(() => {
    const loadStatement = async () => {
      try {
        setLoading(true);
        const data = await api.getStatement(
          mallId,
          clientCpf,
          period
            ? { startDate: period.startDate, endDate: period.endDate }
            : null
        );
        setStatement(data);
      } catch {
        setStatement([]);
      } finally {
        setLoading(false);
      }
    };
    loadStatement();
  }, [clientCpf, mallId, period]);

  const handleMallChange = useCallback(
    id => {
      setMallId(id);
    },
    [setMallId]
  );

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
        <ExtractCustomSearch
          malls={malls}
          searchText={searchText}
          onSearch={handleSearch}
          onHide={hideSearch}
          renderType="coalitionExtract"
          onMallChange={handleMallChange}
          currentMallId={mallId}
          onPeriodChange={handleExtractPeriodChange}
        />
      );
    },
    [handleExtractPeriodChange, handleMallChange, mallId, malls]
  );

  const statementData = useMemo(
    () =>
      statement.map(mov => {
        const row = [];
        row.push(mov.description);
        row.push(mov.reason);
        if (mov.type === 'credit') {
          row.push(mov.points);
        } else if (mov.type === 'debit') {
          row.push(-mov.points);
        }
        row.push(mov.startDate);
        row.push(mov.responsible);
        return row;
      }),
    [statement]
  );

  const customTableTheme = useMemo(
    () => ({
      overrides: {
        MUIDataTableHeadCell: {
          root: {
            '&:nth-child(1)': {
              textAlign: 'left',
            },
            '&:nth-child(5)': {
              textAlign: 'left',
            },
          },
        },
        MUIDataTableBodyCell: {
          root: {
            '&:nth-child(2)': {
              textAlign: 'left',
            },
            '&:nth-child(10)': {
              textAlign: 'left',
            },
          },
        },
      },
    }),
    []
  );

  const datatableOptions = useMemo(() => {
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
    return options;
  }, [customSearchComponent, loading]);

  return (
    <MyDataTable
      data={statementData}
      columns={datableColumns}
      options={datatableOptions}
      rowsPerPage={limit}
      customTheme={customTableTheme}
    />
  );
};

export default SectionExtract;
