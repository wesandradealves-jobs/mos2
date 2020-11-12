import * as am4core from '@amcharts/amcharts4/core';

export default function heatMapTheme(target) {
  if (target instanceof am4core.ColorSet) {
    target.list = [am4core.color('#035058')];
  }
}
