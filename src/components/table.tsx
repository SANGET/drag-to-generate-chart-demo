import React, { Fragment, useMemo, useState } from 'react';
import { FormOptions } from '@deer-ui/core/form-generator/form-generator';
import { Table as DeerTable } from '@deer-ui/core/table';
import { Pagination } from '@deer-ui/core/pagination';
import { month, getDataForTable, AccessorFilterParams } from '../utils/data-filter';
import { setDataTip, dateFieldReg } from '../utils/constant';

const getAccessorOptions = ({
  columnsFields,
  rowsFields,
  dataFields,
  ...other
}) => {
  return {
    ...other,
    dateFilter: columnsFields,
    columnsFields,
    rowsFields: rowsFields.map((accessor) => ({
      accessor,
    })),
    dataFields: dataFields.map((accessor) => ({
      accessor,
      filter: (filterParams: AccessorFilterParams) => {
        const {
          srcStr, currData, currItem, config
        } = filterParams;
        // filter: (str, currData, config) => {
        const { yearOptions, dateField } = config;
        if (yearOptions) {
          if (yearOptions.indexOf(String((new Date(currItem[dateField])).getFullYear())) > -1) {
            return isNaN(+srcStr) ? srcStr : +srcStr + (currData ? +(currData[accessor]) || 0 : 0);
          }
        }
        return srcStr;
      }
    })),
  };
};

const getColumn = (columnsFields) => {
  switch (columnsFields) {
    case 'month':
      return month;
    default:
      return [columnsFields];
  }
};

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
  const colums = getColumn(columnsFields);
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
                <th key={item} colSpan={dataFieldLen}>{item}</th>
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
  if (!innerValue) return [];
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
      displayMultipleItems: true,
      required: true,
      values: {
        month: 'month',
        ...columnValues,
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

const NormalTable = ({
  dataSource
}) => {
  const [pagin, setPagin] = useState({
    active: true,
    total: dataSource.length,
    pIdx: 0,
    pSize: 20
  });
  const columns = Object.keys(dataSource[0]).map((item) => ({
    key: item
  }));
  const data = dataSource.slice(pagin.pIdx * pagin.pSize, (pagin.pIdx + 1) * pagin.pSize);
  return (
    <div className="normal-table">
      <DeerTable
        dataRows={data}
        columns={columns}
        height="30vh"
        rowKey={(record, idx) => idx}
      />
      <Pagination pagingInfo={pagin} onPagin={setPagin} />
    </div>
  );
};

const TableFilter = (props) => {
  const {
    columnsFields,
    rowsFields,
    dataFields,
    dataSource,
  } = props;
  if (!rowsFields || !columnsFields || !dataFields) {
    return (
      <NormalTable {...props} />
    );
  }
  return <Table {...props} />;
};

TableFilter.onWillMount = options;

export default TableFilter;
