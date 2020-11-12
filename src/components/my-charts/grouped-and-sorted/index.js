/* eslint-disable no-inner-declarations */
import React, { useEffect, useMemo, useRef } from 'react';
import merge from 'lodash.merge';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import groupedAndSortedChartTheme from './theme';

const GroupedAndSorted = ({ id, layout, valueY, category, data, onReady }) => {
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
    lineSeries: {
      stroke: {
        width: 2,
      },
    },
    yAxes: {
      min: 0,
      inside: false,
      label: {
        show: true,
      },
    },
    yAxes2: {
      opposite: true,
      labels: {
        show: false,
      },
      grid: {
        show: false,
      },
    },
    xAxes: {
      grid: {
        show: true,
        location: 0,
        minDistance: 30,
      },
      labels: {
        rotation: -45,
        dx: -15,
      },
    },
  };

  const chartLayout = useMemo(() => merge(defaultLayout, layout), [
    defaultLayout,
    layout,
  ]);

  useEffect(() => {
    am4core.useTheme(groupedAndSortedChartTheme);

    const chart = am4core.create(id, am4charts.XYChart);
    chart.preloader.disabled = true;

    // chart.height = chartLayout.height;

    if (data && data.length > 0) {
      chart.events.on('ready', () => {
        onReady();
      });

      // Add data

      chart.data = data;

      // Create axes
      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = category;
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.grid.template.disabled = !chartLayout.xAxes.grid
        .show;
      categoryAxis.renderer.minGridDistance =
        chartLayout.xAxes.grid.minDistance;
      categoryAxis.renderer.cellStartLocation = 0.2;
      categoryAxis.renderer.cellEndLocation = 0.8;
      categoryAxis.renderer.labels.template.fill = '#8C8B8B';
      categoryAxis.renderer.labels.template.rotation =
        chartLayout.xAxes.labels.rotation;
      categoryAxis.renderer.labels.template.dx = chartLayout.xAxes.labels.dx;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.min = 0;
      valueAxis.renderer.labels.template.fill = '#8C8B8B';

      // Create series
      function createSeries(field, fieldName) {
        // Set up series
        const series = chart.series.push(new am4charts.ColumnSeries());
        series.name = fieldName;
        series.dataFields.valueY = field;
        series.dataFields.categoryX = category;
        series.sequencedInterpolation = true;

        // Configure columns
        series.columns.template.width = am4core.percent(
          chartLayout.columnSeries.percentWidth
        );
        series.columns.template.tooltipText = '[font-size:14px]{valueY}';

        return series;
      }

      Object.entries(data[0]).forEach(([key]) => {
        if (key !== category && key !== valueY.property) {
          createSeries(key, key);
        }
      });

      // // second value axis for quantity
      // const valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
      // valueAxis2.renderer.opposite = true;
      // valueAxis2.syncWithAxis = valueAxis;
      // valueAxis2.tooltip.disabled = true;
      // valueAxis2.renderer.disabled = true;
      // valueAxis2.renderer.labels.template.disabled = true;

      // // quantity line series
      // const lineSeries = chart.series.push(new am4charts.LineSeries());
      // lineSeries.dataFields.categoryX = category;
      // lineSeries.dataFields.valueY = valueY.property;
      // lineSeries.yAxis = valueAxis2;
      // const bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
      // bullet.tooltipText = '{valueY}';
      // lineSeries.stroke = chart.colors.getIndex(6);
      // lineSeries.fill = lineSeries.stroke;
      // lineSeries.strokeWidth = 2;
      // lineSeries.name = valueY.name;

      // // when data validated, adjust location of data item based on count
      // lineSeries.events.on('datavalidated', () => {
      //   lineSeries.dataItems.each(dataItem => {
      //     // if count divides by two, location is 0 (on the grid)
      //     if (
      //       dataItem.dataContext.count / 2 ===
      //       Math.round(dataItem.dataContext.count / 2)
      //     ) {
      //       dataItem.setLocation('categoryX', 0);
      //     }
      //     // otherwise location is 0.5 (middle)
      //     else {
      //       dataItem.setLocation('categoryX', 0.5);
      //     }
      //   });
      // });

      // Disabling zoom
      chart.maxZoomLevel = 1;

      // Legend
      chart.legend = new am4charts.Legend();
      chart.legend.labels.template.fill = '#8C8B8B';
      chart.legend.position = 'right';
      chart.legend.width = 250;

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
    am4core.unuseTheme(groupedAndSortedChartTheme);

    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [chartLayout, valueY, data, onReady, category, id]);

  return <div id={id} />;
};

export default GroupedAndSorted;
