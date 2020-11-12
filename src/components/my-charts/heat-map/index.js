/* eslint-disable no-inner-declarations */
import React, { useLayoutEffect, useMemo, useRef } from 'react';
import merge from 'lodash.merge';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import heatMapTheme from './theme';

const HeatMap = ({ id, layout, data, onReady }) => {
  const chartRef = useRef(null);

  const defaultLayout = {
    paddingRight: 20,
    height: 200,
    columnSeries: {
      percentWidth: 80,
      label: {
        locationY: 0.5,
        hideOversized: true,
      },
    },
    yAxes: {
      min: 0,
      inside: true,
      label: {
        show: false,
      },
    },
    xAxes: {
      grid: {
        show: false,
        location: 0,
        minDistance: 30,
      },
    },
  };

  const chartLayout = useMemo(() => merge(defaultLayout, layout), [
    defaultLayout,
    layout,
  ]);

  useLayoutEffect(() => {
    am4core.useTheme(heatMapTheme);

    const chart = am4core.create(id, am4charts.XYChart);

    // chart.height = chartLayout.height;
    chart.maskBullets = false;

    if (data && data.length > 0) {
      chart.events.on('ready', () => {
        onReady();
      });

      chart.preloader.disabled = true;

      chart.data = data;

      const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      const yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

      xAxis.dataFields.category = 'hour';
      yAxis.dataFields.category = 'weekday';

      xAxis.renderer.grid.template.disabled = true;
      xAxis.renderer.minGridDistance = chartLayout.xAxes.grid.minDistance;
      xAxis.renderer.opposite = true;
      xAxis.renderer.labels.template.fill = '#8C8B8B';

      yAxis.renderer.grid.template.disabled = true;
      yAxis.renderer.inversed = true;
      yAxis.renderer.minGridDistance = 30;
      yAxis.renderer.labels.template.fill = '#8C8B8B';

      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = 'hour';
      series.dataFields.categoryY = 'weekday';
      series.dataFields.value = 'value';
      series.sequencedInterpolation = true;
      series.defaultState.transitionDuration = 3000;

      const bgColor = new am4core.InterfaceColorSet().getFor('background');

      const columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 1;
      columnTemplate.strokeOpacity = 0.2;
      columnTemplate.stroke = bgColor;
      columnTemplate.tooltipText =
        "{weekday}, {hour}: {value.workingValue.formatNumber('#.')}";
      columnTemplate.width = am4core.percent(100);
      columnTemplate.height = am4core.percent(100);

      series.heatRules.push({
        target: columnTemplate,
        property: 'fill',
        min: am4core.color(bgColor),
        max: chart.colors.getIndex(0),
      });

      chart.responsive.useDefault = false;
      chart.responsive.enabled = true;

      // heat legend
      // const heatLegend = chart.bottomAxesContainer.createChild(
      //   am4charts.HeatLegend
      // );
      // heatLegend.width = am4core.percent(100);
      // heatLegend.series = series;
      // heatLegend.valueAxis.renderer.labels.template.fontSize = 9;
      // heatLegend.valueAxis.renderer.minGridDistance = 30;

      // heat legend behavior
      // series.columns.template.events.on('over', function(event) {
      //   handleHover(event.target);
      // });

      // series.columns.template.events.on('hit', function(event) {
      //   handleHover(event.target);
      // });

      // function handleHover(column) {
      //   if (!isNaN(column.dataItem.value)) {
      //     heatLegend.valueAxis.showTooltipAt(column.dataItem.value);
      //   } else {
      //     heatLegend.valueAxis.hideTooltip();
      //   }
      // }

      // series.columns.template.events.on('out', function(event) {
      //   heatLegend.valueAxis.hideTooltip();
      // });

      // EXPORT
      chart.exporting.menu = new am4core.ExportMenu();
      chart.exporting.menu.container = document.getElementById(
        `chart-header-${id}`
      );

      chart.exporting.menu.items = [
        {
          icon: '/icons/action-icons/graph_menu.svg',
          menu: [
            {
              label: 'Imprimir',
              type: 'print',
            },
            // {
            //   label: 'Exportar',
            //   menu: [
            //     { type: 'png', label: 'PNG' },
            //     { type: 'jpg', label: 'JPG' },
            //     { type: 'svg', label: 'SVG' },
            //     { type: 'pdf', label: 'PDF' },
            //     { type: 'json', label: 'JSON' },
            //     { type: 'xlsx', label: 'XLSX' },
            //     { type: 'csv', label: 'CSV' },
            //   ],
            // },
          ],
        },
      ];
    } else {
      onReady();
    }
    am4core.unuseTheme(heatMapTheme);

    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [
    chartLayout.height,
    chartLayout.xAxes.grid.minDistance,
    data,
    id,
    onReady,
  ]);

  return <div id={id} />;
};

export default HeatMap;
