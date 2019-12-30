import React, { useEffect, useMemo } from 'react';
import { FormOptions } from '@deer-ui/core/form-generator/form-filter';
import { month, getDataForChart } from '../utils/carsdata-filter';

const LineChart = ({
  dataSource, title = 'Sales trend'
}) => {
  const DataForChart = useMemo(() => getDataForChart(dataSource), [dataSource]);
  useEffect(() => {
    if (!window.Highcharts) return;
    const myChart = window.Highcharts.chart('chart', {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Sales trend'
      },
      xAxis: {
        categories: month
      },
      yAxis: {
        title: {
          text: 'Fruit eaten'
        }
      },
      series: Object.keys(DataForChart).map((label) => {
        return {
          name: label,
          data: DataForChart[label]
        };
      })
      // series: [{
      //   name: 'Jane',
      //   data: [1, 0, 4, 1, 2, 3, 4, 5, 2, 1, 5, 1]
      // }, {
      //   name: 'John',
      //   data: [5, 7, 3, 5, 7, 3, 5, 7, 3, 5, 7, 3]
      // }]
    });
    return () => {
    };
  }, []);
  return (
    <div>
      <h1>{title}</h1>
      <div className="chart" id="chart"></div>
    </div>
  );
};

const options = (columns): FormOptions => [
  {
    title: '标题',
    type: 'input',
    defaultValue: 'Sales trend',
    ref: 'title'
  },
];

LineChart.genEditablePropsConfig = options;

export default LineChart;
