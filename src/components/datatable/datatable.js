import React from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MUIDataTable from '../muidatatable';
import CustomSearchRender from './customsearch';

export default class DataTable extends React.Component {
  getMuiTheme = () =>
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
        MuiTable: {
          root: {
            marginTop: '20px',
            marginLeft: '0px',
            border: '1px solid #54bbab !important',
          },
        },
        MuiTableCell: {
          root: {
            fontFamily: 'Roboto Mono, Helvetica, Arial, sans-serif',
          },
        },
        MUIDataTableHeadCell: {
          fixedHeaderCommon: {
            backgroundColor: '#e5eaf2',
            fontFamily: 'Arvo, Helvetica, Arial, sans-serif',
            color: '#6b6a69',
            fontWeight: '900',
            textTransform: 'uppercase',
            border: 'none !important',
            padding: '15px 10px !important',
            fontSize: '12px',
          },
          sortLabelRoot: {
            height: '24px',
          },
          sortAction: {
            width: '100%',
            justifyContent: 'end',
          },
          data: {
            flex: '0 0 83.33%',
            textAlign: 'center',
          },
          toolButton: {
            justifyContent: 'center',
          },
        },
        MUIDataTableBodyCell: {
          root: {
            borderRight: '1px solid #54bbab !important',
            borderBottom: '0px',
            color: '#6b6a69',
          },
        },
        MUIDataTableBodyRow: {
          root: {
            '&:nth-child(odd)': {
              backgroundColor: '#f9f9f9',
            },
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
        MuiTableSortLabel: {
          icon: {
            height: '20px',
            fill: '#AAAAAA',
            opacity: '100',
          },
          iconDirectionDesc: {
            fill: '#563062',
          },
          iconDirectionAsc: {
            fill: '#563062',
          },
        },
      },
    });

  handleMallChange = mallId => {
    const { refreshTable } = this.props;
    refreshTable(mallId);
  };

  render() {
    const { renderType, malls, parentOptions, data, columns } = this.props;
    const tableOptions = {
      ...parentOptions,
      customSearchRender: (searchText, handleSearch, hideSearch, options) => {
        return (
          <CustomSearchRender
            searchText={searchText}
            onSearch={handleSearch}
            onHide={hideSearch}
            options={options}
            onMallChange={this.handleMallChange}
            malls={malls}
            renderType={renderType}
          />
        );
      },
      onSearchClose: event => {
        return event;
      },
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
          title: 'Filtros',
          reset: 'Reiniciar',
        },
      },
    };

    return (
      <MuiThemeProvider theme={this.getMuiTheme()}>
        <MUIDataTable data={data} columns={columns} options={tableOptions} />
      </MuiThemeProvider>
    );
  }
}
