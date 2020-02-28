import React, { useEffect, useMemo } from 'react';
import { FormOptions } from '@deer-ui/core/form-generator/form-filter';
import { month, getDataForChart, AccessorFilterParams } from '../utils/data-filter';
import { setDataTip, dateFieldReg } from '../utils/constant';

const defaultTitle = 'chart title';

const getAccessorOptions = ({
  dataFields, ...otherProps
}) => {
  return {
    ...otherProps,
    dateFilter: 'month',
    dataFields: dataFields.map((accessor) => ({
      accessor,
      filter: (filterParams: AccessorFilterParams) => {
        const {
          srcStr, currData, currItem, config
        } = filterParams;
        // filter: (str, currData, config) => {
        // const { yearOptions, dateField } = config;
        // if (yearOptions) {
        return isNaN(+srcStr) ? srcStr : +srcStr + (currData ? +(currData) || 0 : 0);
        // if (yearOptions.indexOf(String((new Date(currItem[dateField])).getFullYear())) > -1) {
        // }
        // }
        // return srcStr;
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

const options = (columns, innerValue, dataSource): FormOptions => {
  const { columnsFields, rowsFields, dataFields } = innerValue;
  const columnValues = {};
  const rowsValues = {};
  const dataValues = {};
  let defaultDateField;
  columns.forEach((column) => {
    columnValues[column] = column;
    if (dateFieldReg.test(column)) {
      defaultDateField = column;
    }
    const isColumnMark = columnsFields && columnsFields.indexOf(column) === -1;
    const isRowMark = rowsFields && rowsFields.indexOf(column) === -1;
    if (isColumnMark) {
      rowsValues[column] = column;
    }
    if (isColumnMark && isRowMark) {
      dataValues[column] = column;
    }
  });
  return [
    {
      title: 'Title',
      type: 'input',
      defaultValue: defaultTitle,
      ref: 'title'
    },
    {
      type: 'select',
      title: 'Date fields',
      ref: 'dateField',
      required: true,
      defaultValue: defaultDateField,
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

LineChartRender.onWillMount = options;

export default LineChartRender;
