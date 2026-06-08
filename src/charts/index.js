import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';
HighchartsMore(Highcharts);
SolidGauge(Highcharts);
Highcharts.setOptions({
  credits: { enabled: false },
  chart: { style: { fontFamily: 'Inter, "Open Sans", sans-serif' } },
});
export default Highcharts;
