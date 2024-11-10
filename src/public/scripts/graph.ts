import { Chart } from "chart.js";
const DATA_COUNT = 12;
const labels = [];

const ctx = document.getElementById('myChart') as HTMLCanvasElement;

for (let i = 0; i < DATA_COUNT; ++i) {
  labels.push(i.toString());
}
const datapoints = [-7, -4, 2, 8, 0, 4, 5];
const data: any = {
  labels: labels,
  datasets: [
    {
      label: 'Cubic interpolation (monotone)',
      data: datapoints,
    //   borderColor: Utils.CHART_COLORS.red,
      fill: false,
      cubicInterpolationMode: 'monotone',
      tension: 0.4
    }, {
      label: 'Cubic interpolation',
      data: datapoints,
    //   borderColor: Utils.CHART_COLORS.blue,
      fill: false,
      tension: 0.4
    }, {
      label: 'Linear interpolation (default)',
      data: datapoints,
    //   borderColor: Utils.CHART_COLORS.green,
      fill: false
    }
  ]
};
new Chart(ctx, data);