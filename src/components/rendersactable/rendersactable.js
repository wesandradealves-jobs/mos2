import React from "react";
import DataTable from "../datatable"
import Actions from "./actions";
import axios from "axios";

export default class RenderSacDataTable extends React.Component {

    constructor(props) {
        super(props);
        this.environment = "dev";

        this.handler = this.handler.bind(this);

        this.columns = [
            "Data",
            "Tipo",
            "Ocorrência",
            "Nome do Cliente",
            "Motivo",
            "Nota",
            "Status",
            {
              name: "Ação",
              options: {
                filter: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                  return (
                    <Actions
                      value={value.toString()}
                      change={event => updateValue(event)}
                      onActionClick={this.handler}
                    />
                  );
                }
              }
            },
            {
                name : "CPF",
                options: {
                    filter: false,
                    display: false,
                    viewColumns: false,
                    searchable: true
                }
            }
          ];

        this.state = {
            mallId: "6",
            data: []
        }

    }

    handler(selectedOption) {
      this.props.onEditClick(selectedOption)
    }

    transformDataToArray(data)  {
      console.log("Data", data)
      
      let transformedData = data.map((ticket)=> {
        let rowArray = []
        rowArray.push(convertISOToShortDate(ticket.dateTime));
        rowArray.push("Ocorrência");
        rowArray.push(ticket.id);
        rowArray.push(ticket.fullName);
        rowArray.push(ticket.reason);
        rowArray.push(ticket.score || "--");
        rowArray.push(ticket.status);
        rowArray.push(ticket.id);
        rowArray.push(ticket.cpf);
        return rowArray
      })
      return transformedData;
    }
    
    async getTickets() {
        try {
            const data = await axios.get(`https://${this.environment}.spotmetrics.com/mos/v1/facility-management/tickets?mallId=${this.state.mallId}`, {
                headers:
                {
                  "x-access-token": ""
                }
            })

            this.setState({ data: this.transformDataToArray(data.data), unformattedData: data.data });
            return data
        }
        catch (e) {
            console.log("Error", e)
        }
        
    }
    refreshTable = (mallId) => {
        this.setState({mallId: mallId}, ()=>{
            this.getTickets();
        })
    }

    componentDidMount() {
        this.getTickets();
    }
    

    render() {
        return (
          <section className="content">
            <DataTable data={this.state.data} columns={this.columns} refreshTable={this.refreshTable} key={this.state.data.id} />
          </section>
        )

    }
}

function convertISOToShortDate(date) {
  let shortDate, dateObject = new Date(date);
  return shortDate = dateObject.getDate() + "/" + dateObject.getMonth()+1 + "/" + dateObject.getFullYear();
}