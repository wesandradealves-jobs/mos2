/* eslint-disable no-inner-declarations */
import React, { useEffect, useMemo, useRef } from 'react';
import merge from 'lodash.merge';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import lineTheme from './theme';

const LineChart = ({ id, layout, category, data, onReady }) => {
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
      inside: false,
      grid: {
        show: true,
      },
      label: {
        show: true,
      },
    },
    xAxes: {
      grid: {
        show: false,
        location: 0,
        minDistance: 30,
      },
      label: {
        show: false,
      },
    },
  };

  const chartLayout = useMemo(() => merge(defaultLayout, layout), [
    defaultLayout,
    layout,
  ]);

  useEffect(() => {
    am4core.useTheme(lineTheme);

    const chart = am4core.create(id, am4charts.XYChart);
    chart.preloader.disabled = true;

    if (data && data.length > 0) {
      chart.events.on('ready', () => {
        onReady();
      });

      // Create axes

      const xAxis = chart.xAxes.push(new am4charts.DateAxis());
      xAxis.renderer.labels.template.disabled = !chartLayout.xAxes.label.show;
      xAxis.renderer.grid.template.disabled = !chartLayout.xAxes.grid.show;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.inside = chartLayout.yAxes.inside;
      valueAxis.renderer.labels.template.disabled = !chartLayout.yAxes.label
        .show;
      valueAxis.min = chartLayout.yAxes.min;
      valueAxis.renderer.labels.template.fill = '#8C8B8B';

      function processOver(hoveredSeries) {
        hoveredSeries.toFront();

        hoveredSeries.segments.each(segment => {
          segment.setState('hover');
        });

        chart.series.each(series => {
          if (series !== hoveredSeries) {
            series.segments.each(segment => {
              segment.setState('dimmed');
            });
            series.bulletsContainer.setState('dimmed');
          }
        });
      }

      function processOut() {
        chart.series.each(series => {
          series.segments.each(segment => {
            segment.setState('default');
          });
          series.bulletsContainer.setState('default');
        });
      }

      // Create series
      function createSeries(field, name) {
        const series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.dateX = 'date';
        series.name = name;

        const segment = series.segments.template;
        segment.interactionsEnabled = true;

        const hoverState = segment.states.create('hover');
        hoverState.properties.strokeWidth = 3;

        const dimmed = segment.states.create('dimmed');
        dimmed.properties.stroke = am4core.color('#dadada');

        segment.events.on('over', event => {
          processOver(event.target.parent.parent.parent);
        });

        segment.events.on('out', event => {
          processOut(event.target.parent.parent.parent);
        });

        const seriesData = [];
        data.map(object => {
          const dataItem = {
            date: object.day,
          };
          dataItem[field] = object[field];

          return seriesData.push(dataItem);
        });

        series.data = seriesData;
        return series;
      }

      // Add data

      Object.entries(data[0]).forEach(([key]) => {
        if (key !== category) {
          createSeries(key, key);
        }
      });

      chart.legend = new am4charts.Legend();
      chart.legend.position = 'bottom';
      chart.legend.scrollable = true;
      chart.legend.labels.template.fill = '#8C8B8B';
      chart.legend.itemContainers.template.events.on('over', event => {
        processOver(event.target.dataItem.dataContext);
      });

      chart.legend.itemContainers.template.events.on('out', event => {
        processOut(event.target.dataItem.dataContext);
      });

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
    am4core.unuseTheme(lineTheme);

    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [id, chartLayout, data, onReady, category]);

  return <div id={id} />;
};

export default LineChart;
