import React, { Fragment, useMemo } from 'react';
import { FormOptions } from '@deer-ui/core/form-generator/form-generator';
import { month, getDataForTable } from '../utils/carsdata-filter';
import { setDataTip } from '../utils/constant';

const getAccessorOptions = ({
  columnsFields,
  dateField,
  rowsFields,
  dataFields,
}) => {
  return {
    dateField,
    dateFilter: 'month',
    columnsFields: {
      accessor: columnsFields,
    },
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
  // return {
  //   dateField: 'DATE',
  //   dateFilter: 'month',
  //   columnsFields: {
  //     accessor: columnsFields,
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
  // };
};

const Table = ({
  dataSource, columns,
  columnsFields,
  dateField,
  rowsFields,
  dataFields,
}) => {
  const colums = month;
  const dataFieldLen = dataFields.length;
  const colSpan = 12 * dataFieldLen + 1;
  const accessorOptions = getAccessorOptions({
    columnsFields,
    dateField,
    rowsFields,
    dataFields,
  });
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
              // return (
              //   <Fragment key={item}>
              //     <th>Count</th>
              //     <th>Price</th>
              //   </Fragment>
              // );
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
                            // Object.keys(srcData).map((finalDataField) => {
                            for (let i = 0; i < finalData.length; i++) {
                              const _data = finalData[i] || {};
                              accessorOptions.dataFields.map(({ accessor }, dataIdx) => {
                                const content = _data[accessor] || '-';
                                result.push(
                                  <td key={`${rowKey}_${content}_${i}_${dataIdx}`}>{content}</td>
                                );
                              });
                            }
                            // });
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

const options = (columns): FormOptions => {
  const columnValues = {};
  columns.map((column) => {
    columnValues[column] = column;
  });
  return [
    {
      type: 'radio',
      title: 'Column fields',
      ref: 'columnsFields',
      defaultValue: 'month',
      // needCancel: false,
      required: true,
      values: {
        month: 'month',
        // season: 'season',
        // halflYear: 'halflYear',
        // fullYear: 'fullYear',
      }
    },
    {
      type: 'radio',
      title: 'Date fields',
      ref: 'dateField',
      required: true,
      // defaultValue: 'DATE',
      values: columnValues
    },
    {
      type: 'select',
      title: 'Rows fields',
      ref: 'rowsFields',
      isMultiple: true,
      displayMultipleItems: true,
      required: true,
      values: columnValues
    },
    {
      type: 'select',
      title: 'Data fields',
      ref: 'dataFields',
      isMultiple: true,
      displayMultipleItems: true,
      required: true,
      values: columnValues
    },
  ];
};

const TableFilter = (props) => {
  const {
    columnsFields,
    dateField,
    rowsFields,
    dataFields,
  } = props;
  if (!rowsFields || !dateField || !columnsFields || !dataFields) {
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
