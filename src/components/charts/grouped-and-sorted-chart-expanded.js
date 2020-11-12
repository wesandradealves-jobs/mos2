import React, { Component } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { Modal } from 'react-bootstrap';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

export default class Chat extends Component {
  dataChart() {
    const data = [];
    let visits = 10;

    for (let i = 1; i < 5; i++) {
      visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      data.push({ date: new Date(2018, 0, i), name: `name${i}`, value: visits });
    }
    return data;
  }

  montChart() {
    am4core.useTheme(am4themes_animated);
    const chart = am4core.create('grouped-sorted-expanded', am4charts.XYChart);
    chart.paddingBottom = 50;

    chart.cursor = new am4charts.XYCursor();
    chart.scrollbarX = new am4core.Scrollbar();

    const colors = {};

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataItems.template.text = '{realName}';
    categoryAxis.adapter.add('tooltipText', function(tooltipText, target) {
      return categoryAxis.tooltipDataItem.dataContext.realName;
    });

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.min = 0;

    const columnSeries = chart.series.push(new am4charts.ColumnSeries());
    columnSeries.columns.template.width = am4core.percent(80);
    columnSeries.tooltipText = '{provider}: {realName}, {valueY}';
    columnSeries.dataFields.categoryX = 'category';
    columnSeries.dataFields.valueY = 'value';

    const valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.renderer.opposite = true;
    valueAxis2.syncWithAxis = valueAxis;
    valueAxis2.tooltip.disabled = true;

    const lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.tooltipText = '{valueY}';
    lineSeries.dataFields.categoryX = 'category';
    lineSeries.dataFields.valueY = 'quantity';
    lineSeries.yAxis = valueAxis2;
    lineSeries.bullets.push(new am4charts.CircleBullet());
    lineSeries.stroke = chart.colors.getIndex(13);
    lineSeries.fill = lineSeries.stroke;
    lineSeries.strokeWidth = 2;
    lineSeries.snapTooltip = true;

    lineSeries.events.on('datavalidated', function() {
      lineSeries.dataItems.each(function(dataItem) {
        if (dataItem.dataContext.count / 2 == Math.round(dataItem.dataContext.count / 2)) {
          dataItem.setLocation('categoryX', 0);
        } else {
          dataItem.setLocation('categoryX', 0.5);
        }
      });
    });

    columnSeries.columns.template.adapter.add('fill', function(fill, target) {
      const name = target.dataItem.dataContext.realName;
      if (!colors[name]) {
        colors[name] = chart.colors.next();
      }
      target.stroke = colors[name];
      return colors[name];
    });

    const rangeTemplate = categoryAxis.axisRanges.template;
    rangeTemplate.tick.disabled = false;
    rangeTemplate.tick.location = 0;
    rangeTemplate.tick.strokeOpacity = 0.6;
    rangeTemplate.tick.length = 60;
    rangeTemplate.grid.strokeOpacity = 0.5;
    rangeTemplate.label.tooltip = new am4core.Tooltip();
    rangeTemplate.label.tooltip.dy = -10;
    rangeTemplate.label.cloneTooltip = false;

    const chartData = [];
    const lineSeriesData = [];

    const data = {
      1: {
        1: 10,
        2: 35,
        3: 5,
        4: 20,
        qtd: 430,
      },
      2: {
        1: 15,
        3: 21,
        qtd: 210,
      },
      3: {
        2: 25,
        3: 11,
        4: 17,
        qtd: 265,
      },
      4: {
        3: 12,
        4: 15,
        qtd: 98,
      },
    };

    for (const providerName in data) {
      const providerData = data[providerName];

      const tempArray = [];
      let count = 0;
      for (const itemName in providerData) {
        if (itemName != 'qtd') {
          count++;
          tempArray.push({
            category: `${providerName}_${itemName}`,
            realName: itemName,
            value: providerData[itemName],
            provider: providerName,
          });
        }
      }
      tempArray.sort(function(a, b) {
        if (a.value > b.value) {
          return 1;
        } else if (a.value < b.value) {
          return -1;
        }
        return 0;
      });

      const lineSeriesDataIndex = Math.floor(count / 2);
      tempArray[lineSeriesDataIndex].quantity = providerData.quantity;
      tempArray[lineSeriesDataIndex].count = count;
      am4core.array.each(tempArray, function(item) {
        chartData.push(item);
      });

      var range = categoryAxis.axisRanges.create();
      range.category = tempArray[0].category;
      range.endCategory = tempArray[tempArray.length - 1].category;
      range.label.text = tempArray[0].provider;
      range.label.dy = 30;
      range.label.truncate = true;
      range.label.fontWeight = 'bold';
      range.label.tooltipText = tempArray[0].provider;

      range.label.adapter.add('maxWidth', function(maxWidth, target) {
        const range = target.dataItem;
        const startPosition = categoryAxis.categoryToPosition(range.category, 0);
        const endPosition = categoryAxis.categoryToPosition(range.endCategory, 1);
        const startX = categoryAxis.positionToCoordinate(startPosition);
        const endX = categoryAxis.positionToCoordinate(endPosition);
        return endX - startX;
      });
    }

    chart.data = chartData;

    var range = categoryAxis.axisRanges.create();
    range.category = chart.data[chart.data.length - 1].category;
    range.label.disabled = true;
    range.tick.location = 1;
    range.grid.location = 1;
  }

  componentDidMount() {
    this.montChart();
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return (
      <div className="expanded-chart">
        <div id="grouped-sorted-expanded" />
      </div>
    );
  }
}
