/* eslint-disable no-param-reassign */

// 测试数据的正确性
// const data = getDataForTable(CarsDataSource, {
//   dateField: 'DATE',
//   dateFilter: 'month',
//   columnsFields: {
//     accessor: '',
//   },
//   rowsFields: [{
//     accessor: 'BRAND',
//   }, {
//     accessor: 'TYPE',
//   }, {
//     accessor: 'NAME',
//   }],
//   dataFields: [{
//     accessor: 'COUNT',
//     filter: (str, currData) => {
//       return +str + (+currData.COUNT || 0);
//     }
//   }, {
//     accessor: 'PRICE',
//     filter: (str, currData) => {
//       return +str + (+currData.PRICE || 0);
//     }
//   }],
// });
// console.log(data);

export const month = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const getDataLenByDate = (dateFilter) => {
  let dataLen;
  switch (dateFilter) {
    case 'month':
      dataLen = 12;
      break;
    case 'year':
      dataLen = 1;
      break;
  }
  return dataLen;
};

interface Accessor {
  accessor: string;
  filter?: (accessor: string, currData: {}) => any;
}

interface GetDataForChartOptions {
  dateField: string;
  dateFilter: 'month' | 'year';
  dataFields: Accessor[];
}

const getDataForChart = (DataSource, options: GetDataForChartOptions) => {
  const dateForChart = {};
  const { dateField, dataFields, dateFilter } = options;
  const dataLen = getDataLenByDate(dateFilter);
  DataSource.forEach((item) => {
    const date = item[dateField];
    const monthNum = (new Date(date)).getMonth();
    dataFields.forEach(({ accessor, filter }) => {
      if (!dateForChart[accessor]) dateForChart[accessor] = new Array(dataLen);
      const currContent = item[accessor];
      dateForChart[accessor][monthNum] = filter ? filter(currContent, dateForChart[accessor][monthNum]) : currContent;
    });
  });

  return dateForChart;
};

interface GetDataForTableOptions {
  dateField: string;
  dateFilter: 'month' | 'year';
  columnsFields: Accessor;
  rowsFields: Accessor[];
  dataFields: Accessor[];
}
const getDataForTable = (DataSource, options: GetDataForTableOptions) => {
  if (!options) return console.log('请传入 options');
  const dataForTable = {};
  const {
    dataFields, rowsFields, columnsFields, dateField, dateFilter
  } = options;
  const dataLen = getDataLenByDate(dateFilter);
  const rowsFieldsLen = rowsFields.length;
  DataSource.forEach((item) => {
    const dateAccessor = item[dateField];
    const dataDeeper = (new Date(dateAccessor)).getMonth();
    const rowsFieldFilter = (targetObj, rowFilterDeepIdx = 0) => {
      // 递归修改 targetObj 的属性
      if (rowFilterDeepIdx > rowsFieldsLen - 1) {
        return targetObj;
      }
      const { accessor, filter } = rowsFields[rowFilterDeepIdx];
      const currItemField = item[filter ? filter(item, {}) : accessor];
      if (rowFilterDeepIdx === rowsFieldsLen - 1) {
        // 向最后一项添加 data
        if (!targetObj[currItemField]) targetObj[currItemField] = new Array(dataLen);
        dataFields.forEach(({ accessor: dataAccessor, filter: dataFilter }) => {
          targetObj[currItemField][dataDeeper] = {
            ...targetObj[currItemField][dataDeeper],
            [dataAccessor]: dataFilter
              ? dataFilter(item[dataAccessor], targetObj)
              : item[dataAccessor],
          };
        });
      } else if (!targetObj[currItemField]) targetObj[currItemField] = {};
      rowsFieldFilter(targetObj[currItemField], rowFilterDeepIdx + 1);
    };
    rowsFieldFilter(dataForTable, 0);
  });
  return dataForTable;
  // CarsDataForPivotTable = dataForTable;

  // return CarsDataForPivotTable;
};

export {
  getDataForTable,
  getDataForChart
};
