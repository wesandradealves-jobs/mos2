/* eslint-disable no-inner-declarations */
import React, { useEffect, useMemo, useRef } from 'react';
import merge from 'lodash.merge';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import pieTheme from './theme';

const PieChart = ({ id, layout, category, valueY, data, onReady }) => {
  const chartRef = useRef(null);

  const defaultLayout = {
    height: 200,
    label: {
      show: true,
    },
  };

  const chartLayout = useMemo(() => merge(defaultLayout, layout), [
    defaultLayout,
    layout,
  ]);

  useEffect(() => {
    am4core.useTheme(pieTheme);

    const chart = am4core.create(id, am4charts.PieChart);
    chart.preloader.disabled = true;

    if (data && data.length > 0) {
      chart.events.on('ready', () => {
        onReady();
      });

      // Add data

      chart.data = data;

      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = valueY;
      pieSeries.dataFields.category = category;
      pieSeries.slices.template.stroke = am4core.color('#fff');
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;

      // This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;

      pieSeries.labels.template.disabled = !chartLayout.label.show;
      pieSeries.labels.template.fill = '#8C8B8B';

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
    am4core.unuseTheme(pieTheme);

    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [id, chartLayout, category, data, onReady, valueY]);

  return <div id={id} />;
};

export default PieChart;
