import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

export default function stackedChartTheme(target) {
  if (target instanceof am4core.ColorSet) {
    target.list = [
      am4core.color('#3B7D86'),
      am4core.color('#7E3F5D'),
      am4core.color('#EFB700'),
      am4core.color('#3F2351'),
      am4core.color('#A43043'),
      am4core.color('#594A76'),
      am4core.color('#B06348'),
      am4core.color('#54BBAB'),
    ];
  }

  if (target instanceof am4charts.Legend) {
    target.useDefaultMarker = true;
    if (target.markers) {
      const marker = target.markers.template.children.getIndex(0);
      marker.cornerRadius(12, 12, 12, 12);
      marker.width = 15;
      marker.height = 15;
      marker.verticalCenter = 'top';
      marker.dy = 3;
    }
  }
}
