/* eslint-disable no-inner-declarations */
import React, { useEffect, useMemo, useRef } from 'react';
import merge from 'lodash.merge';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import stackedColumnTheme from './theme';

const StackedColumn = ({ id, layout, category, data, onReady }) => {
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
      labels: {
        rotation: -45,
        dx: -15,
      },
    },
    tooltip: { getTooltipText: value => value },
  };

  const chartLayout = useMemo(() => merge(defaultLayout, layout), [
    defaultLayout,
    layout,
  ]);

  useEffect(() => {
    am4core.useTheme(stackedColumnTheme);

    const chart = am4core.create(id, am4charts.XYChart);
    chart.preloader.disabled = true;

    if (data && data.length > 0) {
      chart.events.on('ready', () => {
        onReady();
      });

      // Add data

      chart.data = data;

      // Create axes
      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = category;
      categoryAxis.renderer.grid.template.location =
        chartLayout.xAxes.grid.location;
      categoryAxis.renderer.grid.template.disabled = !chartLayout.xAxes.grid
        .show;
      categoryAxis.renderer.minGridDistance =
        chartLayout.xAxes.grid.minDistance;
      categoryAxis.renderer.labels.template.fill = '#8C8B8B';
      categoryAxis.renderer.labels.template.rotation =
        chartLayout.xAxes.labels.rotation;
      categoryAxis.renderer.labels.template.dx = chartLayout.xAxes.labels.dx;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.inside = chartLayout.yAxes.inside;
      valueAxis.renderer.labels.template.disabled = !chartLayout.yAxes.label
        .show;
      valueAxis.min = chartLayout.yAxes.min;

      // Create series
      function createSeries(field, fieldName) {
        // Set up series
        const series = chart.series.push(new am4charts.ColumnSeries());
        series.name = fieldName;
        series.dataFields.valueY = field;
        series.dataFields.categoryX = category;
        series.sequencedInterpolation = true;

        series.columns.template.tooltipText = '{valueY}';

        series.columns.template.adapter.add('tooltipText', (_text, target) =>
          chartLayout.tooltip.getTooltipText(target.dataItem.valueY)
        );

        // Make it stacked
        series.stacked = true;

        // Disabling zoom
        chart.maxZoomLevel = 1;

        // Configure columns
        series.columns.template.width = am4core.percent(
          chartLayout.columnSeries.percentWidth
        );
        // series.columns.template.tooltipText = `[font-size:14px]${chartLayout.tooltipText.function(
        //   '{valueY}'
        // )}`;

        return series;
      }

      Object.entries(data[0]).forEach(([key]) => {
        if (key !== category) {
          createSeries(key, key);
        }
      });

      // Legend
      chart.legend = new am4charts.Legend();
      chart.legend.labels.template.fill = '#8C8B8B';

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
    am4core.unuseTheme(stackedColumnTheme);

    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [id, chartLayout, category, data, onReady]);

  return <div id={id} />;
};

export default StackedColumn;
