import React, { Fragment, useMemo } from 'react';
import { FormOptions } from '@deer-ui/core/form-generator/form-generator';
import { month, getDataForTable } from '../utils/data-filter';
import { setDataTip } from '../utils/constant';

const getAccessorOptions = ({
  columnsFields,
  dateField,
  yearOptions,
  rowsFields,
  dataFields,
}) => {
  return {
    dateField,
    dateFilter: columnsFields,
    columnsFields,
    rowsFields: rowsFields.map((accessor) => ({
      accessor,
    })),
    dataFields: dataFields.map((accessor) => ({
      accessor,
      filter: (str, currData) => {
        return isNaN(+str) ? str : +str + (+currData[accessor] || 0);
      }
    })),
  };
};

// const ColumnMapper = () => {
//   return {
//     month: month,
//     year:
//   }
// }

const Table = ({
  dataSource, columns,
  columnsFields,
  dateField,
  rowsFields,
  yearOptions,
  dataFields,
}) => {
  const dataFieldLen = dataFields.length;
  const accessorOptions = getAccessorOptions({
    columnsFields,
    dateField,
    rowsFields,
    yearOptions,
    dataFields,
  });
  const colums = [columnsFields];
  const colSpan = colums.length * dataFieldLen + 1;
  const data = useMemo(
    () => getDataForTable(dataSource, accessorOptions),
    [dataSource, accessorOptions]
  );
  return (
    <table className="table">
      <thead>
        <tr>
          <th>-</th>
          {
            colums.map((item) => {
              return (
                <th key={item} colSpan={colSpan}>{item}</th>
              );
            })
          }
        </tr>
        <tr>
          <th>Model</th>
          {
            colums.map((item, idx1) => {
              const THs = dataFields.map((dataField, idx2) => {
                return (
                  <th key={`${idx1}_${idx2}`}>{dataField}</th>
                );
              });
              return THs;
            })
          }
        </tr>
      </thead>
      <tbody>
        {
          (() => {
            let res: JSX.Element[] = [];
            const getTrItems = (deeper, srcData) => {
              const _res: JSX.Element[] = [];
              if (deeper < accessorOptions.rowsFields.length) {
                const currDataFields = Object.keys(srcData);
                currDataFields.forEach((field, idx) => {
                  const rowKey = `${field}_${idx}`;
                  const paddingLeft = 15 * (deeper + 1);
                  if (deeper === accessorOptions.rowsFields.length - 1) {
                  // 处理最后的数据
                    const finalData = srcData[field];
                    _res.push((
                      <tr key={rowKey}>
                        <td style={{ paddingLeft }}>
                          {field}
                        </td>
                        {
                          (() => {
                            const result: JSX.Element[] = [];
                            for (let i = 0; i < finalData.length; i++) {
                              const _data = finalData[i] || {};
                              accessorOptions.dataFields.map(({ accessor }, dataIdx) => {
                                const content = _data[accessor] || '-';
                                result.push(
                                  <td key={`${rowKey}_${content}_${i}_${dataIdx}`}>{content}</td>
                                );
                              });
                            }
                            return result;
                          })()
                        }
                      </tr>
                    ));
                  } else {
                    _res.push(
                      <Fragment key={rowKey}>
                        <tr>
                          <td
                            colSpan={colSpan}
                            style={{ paddingLeft }}
                          >{field}</td>
                        </tr>
                        {getTrItems(deeper + 1, srcData[field])}
                      </Fragment>
                    );
                  }
                });
              }
              return _res;
            };
            res = getTrItems(0, data);
            return res;
          })()
        }
      </tbody>
    </table>
  );
};

const dateFieldReg = /date/i;

const getDateOptions = ({
  dataSource, dateField, columnValues
}): FormOptions => {
  const yearValues = {};
  const isValidDate = dateFieldReg.test(dateField);
  if (!isValidDate) return [];
  const yearOptions = {
    type: 'checkbox',
    ref: 'yearOptions',
    title: 'Year options',
    required: true,
    values: {}
  };
  const pickDateField = {
    type: 'select',
    title: 'Date fields',
    ref: 'dateField',
    required: true,
    defaultValue: dateField,
    values: columnValues,
  };
  dataSource.forEach((item) => {
    const currYear = item[dateField];
    const year = (new Date(currYear)).getFullYear();
    if (!isNaN(year)) {
      yearValues[year] = year;
    }
  });
  yearOptions.values = yearValues;
  return [
    pickDateField,
    yearOptions
  ];
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
  // console.log(innerValue)
  const dateField = innerValue.dateField || defaultDateField;
  const isDateColumn = ['month', 'year'].indexOf(columnsFields) !== -1;
  const dateColumn = isDateColumn ? getDateOptions({
    dataSource, dateField, columnValues
  }) : [];
  return [
    {
      type: 'select',
      title: 'Column fields',
      ref: 'columnsFields',
      // defaultValue: 'month',
      // needCancel: false,
      // isMultiple: true,
      displayMultipleItems: true,
      required: true,
      values: {
        ...columnValues,
        month: 'month',
        // year: 'year',
        // season: 'season',
        // halflYear: 'halflYear',
        // fullYear: 'fullYear',
      }
    },
    ...dateColumn,
    {
      type: 'select',
      title: 'Rows fields',
      ref: 'rowsFields',
      isMultiple: true,
      displayMultipleItems: true,
      required: true,
      values: rowsValues
    },
    {
      type: 'select',
      title: 'Data fields',
      ref: 'dataFields',
      isMultiple: true,
      displayMultipleItems: true,
      required: true,
      values: dataValues
    },
  ];
};

const TableFilter = (props) => {
  const {
    columnsFields,
    rowsFields,
    dataFields,
  } = props;
  if (!rowsFields || !columnsFields || !dataFields) {
    return (
      <table className="table">
        <thead>
        </thead>
        <tbody>
          <tr>
            <td><h3>{setDataTip}</h3></td>
          </tr>
        </tbody>
      </table>
    );
  }
  return <Table {...props} />;
};

TableFilter.genEditablePropsConfig = options;

export default TableFilter;
