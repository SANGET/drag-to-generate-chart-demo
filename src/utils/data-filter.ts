/* eslint-disable no-param-reassign */

export const month = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const halfYear = [
  "up", "down",
];
const getDataLenByColumns = (columnsAccessor) => {
  // return [columnsAccessor].length;
  switch (columnsAccessor) {
    case 'month':
      return month.length;
    case 'year':
      return 1;
    default:
      return 1;
  }
};

export interface AccessorFilterParams {
  srcStr: string;
  currData: any;
  currItem?: any;
  config?: any;
}
interface Accessor {
  accessor: string;
  filter?: (filterParams: AccessorFilterParams) => any;
}

interface GetDataForChartOptions {
  dateField: string;
  dateFilter: 'month' | 'year';
  dataFields: Accessor[];
}

const getStatisticsField = (date, dateFilter) => {
  const dataEntity = new Date(date);
  switch (dateFilter) {
    case 'year':
      return dataEntity.getFullYear();
    case 'month':
    default:
      return dataEntity.getMonth();
  }
};

const getDataForChart = (DataSource, options: GetDataForChartOptions) => {
  const dateForChart = {};
  const {
    dateField, dataFields, dateFilter,
  } = options;
  const dataLen = getDataLenByColumns(dateFilter);
  DataSource.forEach((item) => {
    const date = item[dateField];
    const monthNum = (new Date(date)).getMonth();
    const statisticsField = getStatisticsField(date, dateFilter);
    dataFields.forEach(({ accessor, filter }) => {
      if (!dateForChart[accessor]) dateForChart[accessor] = new Array(dataLen);
      const currContent = item[accessor];
      dateForChart[accessor][statisticsField] = filter ? filter({
        srcStr: currContent,
        currData: dateForChart[accessor][monthNum]
      }) : currContent;
    });
  });

  return dateForChart;
};

const getDataDeeper = (columnsFields, currDataItem) => {
  const dataDeeper = 0;
  switch (columnsFields) {
    case 'year':
      var dataEntity = new Date(currDataItem);
      return dataEntity.getFullYear();
    case 'month':
      var dataEntity = new Date(currDataItem);
      return dataEntity.getMonth();
  }
  return dataDeeper;
};

interface GetDataForTableOptions {
  dateField: string;
  // dateFilter: 'month' | 'year';
  columnsFields: Accessor;
  rowsFields: Accessor[];
  dataFields: Accessor[];
}
const getDataForTable = (DataSource, options: GetDataForTableOptions) => {
  if (!options) return console.log('请传入 options');
  const dataForTable = {};
  const {
    dataFields, rowsFields, columnsFields, dateField, ...other
  } = options;
  const dataLen = getDataLenByColumns(columnsFields);
  const rowsFieldsLen = rowsFields.length;
  DataSource.forEach((dataItem) => {
    // const dateAccessor = dataItem[dateField];
    // const dataDeeper = (new Date(dateAccessor)).getMonth();
    const tableGenerator = (targetObj, rowFilterDeepIdx = 0) => {
      // 递归修改 targetObj 的属性
      if (rowFilterDeepIdx > rowsFieldsLen - 1) {
        return targetObj;
      }
      const { accessor, filter } = rowsFields[rowFilterDeepIdx];
      const currItemField = dataItem[filter ? filter(dataItem, {}) : accessor];
      if (rowFilterDeepIdx === rowsFieldsLen - 1) {
        // 向最后一项添加 data
        // columnsFields.forEach((columnField, idx) => {
        const dataDeeper = getDataDeeper(columnsFields, dataItem[dateField]);
        if (!targetObj[currItemField]) targetObj[currItemField] = new Array(dataLen);
        dataFields.forEach(({ accessor: dataAccessor, filter: dataFilter }) => {
          targetObj[currItemField][dataDeeper] = {
            ...targetObj[currItemField][dataDeeper],
            [dataAccessor]: dataFilter
              ? dataFilter({
                srcStr: dataItem[dataAccessor],
                currData: targetObj[currItemField][dataDeeper],
                config: options,
                currItem: dataItem
              })
              : dataItem[dataAccessor],
          };
        });
        // });
      } else if (!targetObj[currItemField]) targetObj[currItemField] = {};
      tableGenerator(targetObj[currItemField], rowFilterDeepIdx + 1);
    };
    tableGenerator(dataForTable, 0);
  });
  return dataForTable;
  // CarsDataForPivotTable = dataForTable;

  // return CarsDataForPivotTable;
};

export {
  getDataForTable,
  getDataForChart
};
