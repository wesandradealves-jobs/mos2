import React from 'react';
import DataTable from '../../../components/datatable';
import Actions from '../actions-tab-edition';
import ApiClient from '../../../services/api';

const tableActions = ['Acompanhar', 'Imprimir'];

export default class RenderSacDataTable extends React.Component {
  constructor(props) {
    super(props);
    this.client = new ApiClient();
    this.sessionSpot = props.sessionSpot;
    this.handler = this.handler.bind(this);
    // this.printTicket = this.printTicket.bind(this)
    this.tableOptions = {
      customSort: (data, colIndex, order) => {
        const dateTimeField = 0;
        const dateTimeFieldNumeric = 9;
        const sortedArray = data;

        if (colIndex == dateTimeField) {
          data.sort((a, b) => {
            if (order == 'asc') {
              if (
                new Date(a.data[dateTimeFieldNumeric]) >
                new Date(b.data[dateTimeFieldNumeric])
              )
                return 1;
              return -1;
            }

            if (
              new Date(a.data[dateTimeFieldNumeric]) <
              new Date(b.data[dateTimeFieldNumeric])
            )
              return 1;
            return -1;
          });
        } else {
          data.sort((a, b) => {
            if (order == 'asc') {
              if (a.data[colIndex] > b.data[colIndex]) return 1;
              return -1;
            }

            if (a.data[colIndex] < b.data[colIndex]) return 1;
            return -1;
          });
        }

        return sortedArray;
      },
    };
    this.columns = [
      'Data',
      {
        name: 'Tipo',
        options: {
          filter: false,
        },
      },
      {
        name: 'Ocorrência',
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
      'Motivo',
      'Nota',
      'Status',
      {
        name: 'Ação',
        options: {
          filter: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <Actions
                value={value.toString()}
                change={event => updateValue(event)}
                onActionClick={this.handler}
                actions={tableActions}
              />
            );
          },
        },
      },
      {
        name: 'CPF',
        options: {
          filter: false,
          display: false,
          viewColumns: false,
          searchable: true,
        },
      },
      {
        name: 'Data Numerica',
        options: {
          filter: false,
          display: false,
          viewColumns: false,
          searchable: false,
        },
      },
    ];

    this.state = {
      mallId: props.sessionSpot.malls[0].id,
      data: [],
    };
  }

  async handler(action, ticketId) {
    if (action == 'Acompanhar') {
      this.props.onEditClick(ticketId, this.state.mallId);
    }
    if (action == 'Imprimir') {
      const response = await this.client.printTicket(
        ticketId,
        this.state.mallId
      );
      console.log('Print Resposta', response);
      const retrievedPDF = new Blob([response.data], {
        type: 'application/pdf',
      });
      const url = window.URL.createObjectURL(retrievedPDF);
      window.open(url);
    }
  }

  transformDataToArray(data) {
    const transformedData = data.map(ticket => {
      const rowArray = [];
      rowArray.push(convertISOToShortDate(ticket.dateTime));
      rowArray.push('Ocorrência');
      rowArray.push(ticket.id);
      rowArray.push(ticket.fullName);
      rowArray.push(ticket.reason);
      rowArray.push(ticket.score || '--');
      rowArray.push(ticket.status);
      rowArray.push(ticket.id);
      rowArray.push(ticket.cpf);
      rowArray.push(ticket.dateTime);
      return rowArray;
    });
    return transformedData;
  }

  async getTickets() {
    const data = await this.client.getTickets(this.state.mallId);
    if (data) {
      this.setState({
        data: this.transformDataToArray(data),
        unformattedData: data,
      });
    }
  }

  refreshTable = mallId => {
    this.setState({ mallId }, () => {
      this.getTickets();
    });
  };

  componentDidMount() {
    this.getTickets();
  }

  render() {
    return (
      <section className="content">
        <DataTable
          data={this.state.data}
          columns={this.columns}
          refreshTable={this.refreshTable}
          key={this.state.data.id}
          malls={this.sessionSpot.malls}
          options={this.tableOptions}
          renderType="sac"
        />
      </section>
    );
  }
}

function convertISOToShortDate(date) {
  let shortDate;
  const dateObject = new Date(date);
  return (shortDate = `${dateObject.getDate()}/${+dateObject.getMonth() +
    1}/${dateObject.getFullYear()}`);
}
