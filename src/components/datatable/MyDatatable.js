import React, { useMemo, useCallback } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import merge from 'lodash.merge';

import MUIDataTable from '../muidatatable';

const MyDatatable = ({ options, columns, customTheme, data }) => {
  const getDefaultOptions = useCallback(
    () => ({
      onSearchClose: event => {
        console.log('Desabilitar search', event);
      },
      print: true,
      filter: true,
      download: true,
      pagination: true,
      disableEscapeKeyDown: true,
      selectableRows: 'none',
      filterType: 'dropdown',
      searchOpen: true,
      search: false,
      viewColumns: false,
      responsive: 'scrollFullHeight',
      textLabels: {
        body: {
          noMatch: 'Desculpe, nenhum registro encontrado',
          toolTip: 'Ordenar',
        },
        pagination: {
          next: 'Próxima Página',
          previous: 'Página Anterior',
          rowsPerPage: 'Linhas por página:',
          displayRows: 'de',
        },
        toolbar: {
          search: 'Procurar',
          downloadCsv: 'Download CSV',
          print: 'Imprimir',
          viewColumns: 'Ver Colunas',
          filterTable: 'Filtrar Tabela',
        },
        filter: {
          all: 'Todos',
          title: 'FILTROS',
          reset: 'Reiniciar',
        },
      },
    }),
    []
  );

  const getMuiTheme = useCallback(
    () =>
      createMuiTheme({
        overrides: {
          MuiIconButton: {
            root: {
              paddingRight: '24px',
              paddingLeft: '24px',
              color: '#563062',
              '&:hover': {
                color: '#563062!important',
              },
            },
          },

          MuiMenuItem: {
            root: {
              color: '#563062',
            },
          },
          MUIDataTable: {
            tableRoot: {
              border: '1px solid #cbe6e1 !important',
            },
          },
          MuiTable: {
            root: {
              marginTop: '0px !important',
              marginLeft: '0px',
            },
          },
          MuiTableCell: {
            root: {
              fontFamily: 'Roboto Mono, Helvetica, Arial, sans-serif',
              fontSize: '0.75rem',
            },
          },
          MUIDataTableHeadCell: {
            fixedHeaderCommon: {
              backgroundColor: '#e5eaf2',
              fontFamily: 'Arvo, Helvetica, Arial, sans-serif',
              fontSize: '0.75rem',
              color: '#6b6a69',
              fontWeight: '900',
              textTransform: 'uppercase',
              border: 'none !important',
              padding: '15px 16px !important',
              position: 'relative',
            },
            sortLabelRoot: {
              height: '24px',
            },
            sortAction: {
              width: '100%',
            },
            data: {
              flex: '0 0 100%',
            },
            toolButton: {
              justifyContent: 'center',
            },
            root: {
              textAlign: 'center',
              borderRight: '1px solid #cbe6e1',
            },
          },
          MuiButtonBase: {
            root: {
              position: 'static',
            },
          },
          MUIDataTableBodyCell: {
            root: {
              borderRight: '1px solid #cbe6e1',
              borderBottom: '0px',
              color: '#6b6a69',
              textAlign: 'center',
            },
          },
          MUIDataTableBodyRow: {
            root: {
              '&:nth-child(odd)': {
                backgroundColor: '#f9f9f9',
              },
            },
          },
          MUIDataTableBody: {
            emptyTitle: {
              fontFamily:
                'Roboto Mono, Helvetica, Arial, sans-serif !important;',
            },
            loading: {
              fontFamily:
                'Roboto Mono, Helvetica, Arial, sans-serif !important;',
            },
          },
          MuiToolbar: {
            gutters: {
              paddingLeft: '0px',
              paddingRight: '0px',
              '@media (min-width: 600px)': {
                paddingLeft: '0px',
                paddingRight: '0px',
              },
            },
          },
          MUIDataTableFilter: {
            reset: {
              flex: '1',
              display: 'flex !important',
              justifyContent: 'space-between !important',
              alignItems: 'center !important',
            },
            title: {
              fontFamily: 'Arvo, Helvetica, Arial, sans-serif !important',
              color: '#6b6a69 !important',
            },
          },
          MuiTableSortLabel: {
            icon: {
              height: '20px',
              fill: '#AAAAAA',
              opacity: '100',
              position: 'absolute',
              right: '0',
            },
            iconDirectionDesc: {
              fill: '#563062',
            },
            iconDirectionAsc: {
              fill: '#563062',
            },
          },
        },
      }),
    []
  );
  const tableOptions = useMemo(() => merge(getDefaultOptions(), options), [
    getDefaultOptions,
    options,
  ]);
  const theme = useMemo(() => merge(getMuiTheme(), customTheme), [
    customTheme,
    getMuiTheme,
  ]);

  return (
    <MuiThemeProvider theme={theme}>
      <MUIDataTable
        disableEscapeKeyDown
        data={data}
        columns={columns}
        options={tableOptions}
      />
    </MuiThemeProvider>
  );
};

export default MyDatatable;
