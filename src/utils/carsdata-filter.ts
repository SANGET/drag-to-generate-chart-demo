/* eslint-disable no-param-reassign */
// interface CarsDataForPivotTableStruct {
//   [brand: string]: {
//     [type: string]: {
//       [carName: string]: ({
//         count: number;
//         price: number;
//       })[];
//     };
//   };
// }
interface CarsDataForChartStruct {
  totalSales: number[];
  counts: number[];
}
// const CarsDataForPivotTable: CarsDataForPivotTableStruct = {};
const CarsDataForChart: CarsDataForChartStruct = {
  totalSales: [],
  counts: [],
};

export const month = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const getDataForChart = (CarsDataSource) => {
  if (CarsDataForChart.totalSales.length === 0) {
    CarsDataForChart.totalSales = new Array(month.length);
    CarsDataForChart.counts = new Array(month.length);
  }
  CarsDataSource.forEach((item) => {
    const {
      TYPE, DATE, NAME, MODEL, TRANS, BRAND, COUNT, PRICE, TOTAL
    } = item;
    const monthNum = (new Date(DATE)).getMonth();
    CarsDataForChart.totalSales[monthNum] = (+CarsDataForChart.totalSales[monthNum] || 0) + (+TOTAL || 0);
    CarsDataForChart.counts[monthNum] = (+CarsDataForChart.counts[monthNum] || 0) + (+COUNT || 0);
  });

  return CarsDataForChart;
};

interface Accessor {
  accessor: string;
  filter?: (accessor: string, currData: {}) => any;
}

interface GetDataForTableOptions {
  dateField: string;
  dateFilter: 'month' | 'year';
  columnsFields: Accessor;
  rowsFields: Accessor[];
  dataFields: Accessor[];
}
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
const getDataForTable = (CarsDataSource, options: GetDataForTableOptions) => {
  if (!options) return console.log('请传入 options');
  const dataForTable = {};
  const {
    dataFields, rowsFields, columnsFields, dateField, dateFilter
  } = options;
  const dataLen = getDataLenByDate(dateFilter);
  const rowsFieldsLen = rowsFields.length;
  CarsDataSource.forEach((item) => {
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
