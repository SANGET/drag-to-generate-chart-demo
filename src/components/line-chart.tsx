import React, { useEffect, useMemo } from 'react';
import { FormOptions } from '@deer-ui/core/form-generator/form-filter';
import { month, getDataForChart } from '../utils/data-filter';
import { setDataTip } from '../utils/constant';

const defaultTitle = 'chart title';

const getAccessorOptions = ({
  dateField,
  dataFields,
}) => {
  return {
    dateField,
    dateFilter: 'month',
    dataFields: dataFields.map((accessor) => ({
      accessor,
      filter: (str, currData) => {
        return isNaN(+str) ? str : +str + (+currData || 0);
      }
    })),
  };
};
const LineChart = ({
  dataSource, title = defaultTitle,
  dateField, dataFields
}) => {
  const accessorOptions = getAccessorOptions({
    dateField,
    dataFields,
  });
  const DataForChart = useMemo(
    () => getDataForChart(dataSource, accessorOptions),
    [dataSource, accessorOptions]
  );
  useEffect(() => {
    if (!window.Highcharts) return () => null;
    const highChart = window.Highcharts.chart('chart', {
      chart: {
        type: 'line'
      },
      title: {
        text: ''
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
    });
    return () => {
      highChart.destroy();
    };
  }, [dateField, dataFields]);
  return (
    <div>
      <h1 className="ps10">{title}</h1>
      <div className="chart" id="chart"></div>
    </div>
  );
};


const options = (columns): FormOptions => {
  const columnValues = {};
  columns.map((column) => {
    columnValues[column] = column;
  });
  return [
    {
      title: 'Title',
      type: 'input',
      defaultValue: defaultTitle,
      ref: 'title'
    },
    {
      type: 'radio',
      title: 'Date fields',
      ref: 'dateField',
      required: true,
      values: columnValues
    },
    {
      type: 'select',
      title: 'Data fields',
      ref: 'dataFields',
      isMultiple: true,
      required: true,
      displayMultipleItems: true,
      values: columnValues
    },
  ];
};

const LineChartRender = (props) => {
  const {
    dateField,
    dataFields,
  } = props;
  if (!dateField || !dataFields) {
    return (
      <h3 className="text-center">{setDataTip}</h3>
    );
  }
  return <LineChart {...props} />;
};

LineChartRender.genEditablePropsConfig = options;

export default LineChartRender;
