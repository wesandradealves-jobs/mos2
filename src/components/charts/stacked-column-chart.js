import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { bindAll } from '../../utils/functions';
import ColumnExpanded from './stacked-column-chart-expanded';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
    bindAll(this, ['handleShow', 'handleClose']);
  }

  dataChart() {
    const data = [];
    let visits = 10;

    for (let i = 1; i < 5; i++) {
      visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      data.push({
        date: new Date(2018, 0, i),
        name: `name${i}`,
        value: visits,
      });
    }
    return data;
  }

  montChart() {
    const chart = am4core.create('column', am4charts.XYChart);
    chart.paddingRight = 20;
    chart.data = this.dataChart();

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'value';
    series.tooltipText = '{valueY.value}';
    chart.cursor = new am4charts.XYCursor();
    this.chart = chart;
  }

  componentDidMount() {
    this.montChart();
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleClose() {
    this.setState({ show: false });
  }

  render() {
    return (
      <>
        <div className="section-line">
          <span className="title">TOTAL DE EMPRÉSTIMOS</span>
          <button className="line-button" onClick={this.handleShow}>
            +
          </button>
          <div id="column" />
        </div>

        <Modal
          size="lg"
          centered
          show={this.state.show}
          onHide={this.handleClose}
          animation={false}
        >
          <Modal.Body>
            <ColumnExpanded />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
