interface CarsDataForPivotTableStruct {
  [brand: string]: {
    [type: string]: {
      [carName: string]: ({
        count: number;
        price: number;
      })[];
    };
  };
}
interface CarsDataForChartStruct {
  totalSales: number[];
  counts: number[];
}
let CarsDataForPivotTable: CarsDataForPivotTableStruct = {};
const CarsDataForChart: CarsDataForChartStruct = {
  totalSales: [],
  counts: [],
};

export const month = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const getCarDataForChart = (CarsDataSource) => {
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

const getCarDataForTable = (CarsDataSource) => {
  const carTypeMap = {};
  CarsDataSource.forEach((item) => {
    const {
      TYPE, DATE, NAME, MODEL, TRANS, BRAND, COUNT, PRICE, TOTAL
    } = item;
    // const _month = month[monthNum];
    const monthNum = (new Date(DATE)).getMonth();
    if (!carTypeMap[BRAND]) carTypeMap[BRAND] = {};
    if (!carTypeMap[BRAND][TYPE]) carTypeMap[BRAND][TYPE] = {};
    if (!carTypeMap[BRAND][TYPE][NAME]) carTypeMap[BRAND][TYPE][NAME] = new Array(month.length);
    if (!carTypeMap[BRAND][TYPE][NAME][monthNum]) {
      carTypeMap[BRAND][TYPE][NAME][monthNum] = {
        count: +COUNT,
        price: +PRICE
      };
    } else {
      const perData = carTypeMap[BRAND][TYPE][NAME][monthNum];
      carTypeMap[BRAND][TYPE][NAME][monthNum] = {
        count: perData.count + +COUNT,
        price: perData.price + +PRICE
      };
    }
  });
  CarsDataForPivotTable = carTypeMap;

  return CarsDataForPivotTable;
};

export {
  getCarDataForTable,
  getCarDataForChart
};
