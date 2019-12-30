import React, { Fragment, useMemo } from 'react';
import { FormOptions } from '@deer-ui/core/form-generator/form-generator';
import { month, getDataForTable } from '../utils/carsdata-filter';

const accessorOptions = {
  dateField: 'DATE',
  dateFilter: 'month',
  columnsFields: {
    accessor: '',
  },
  rowsFields: [{
    accessor: 'BRAND',
  }, {
    accessor: 'TYPE',
  }, {
    accessor: 'NAME',
  }],
  dataFields: [{
    accessor: 'COUNT',
    filter: (str, currData) => {
      return +str + (+currData.COUNT || 0);
    }
  }, {
    accessor: 'PRICE',
    filter: (str, currData) => {
      return +str + (+currData.PRICE || 0);
    }
  }],
};

const Table = ({
  dataSource, columns
}) => {
  const colums = month;
  const colSpan = 25;
  const data = useMemo(() => getDataForTable(dataSource, accessorOptions), [dataSource]);
  return (
    <table className="table">
      <thead>
        <tr>
          <th>-</th>
          {
            colums.map((item) => {
              return (
                <th key={item} colSpan={2}>{item}</th>
              );
            })
          }
        </tr>
        <tr>
          <th>Model</th>
          {
            colums.map((item) => {
              return (
                <Fragment key={item}>
                  <th>Count</th>
                  <th>Price</th>
                </Fragment>
              );
            })
          }
        </tr>
      </thead>
      <tbody>
        {
          (() => {
            let res: JSX.Element[] = [];
            const getTrItems = (deeper, srcData) => {
              if (deeper > accessorOptions.rowsFields.length - 1) {
                return null;
              }
              const _res: JSX.Element[] = [];
              const currDataFields = Object.keys(srcData);
              currDataFields.forEach((field, idx) => {
                const rowKey = `${field}_${idx}`;
                const paddingLeft = 15 * deeper;
                if (deeper === accessorOptions.rowsFields.length - 1) {
                  // 处理最后的数据
                  _res.push((
                    <tr key={rowKey}>
                      <td style={{ paddingLeft }}>
                        {field}
                      </td>
                      {
                        (() => {
                          const result: JSX.Element[] = [];
                          for (let i = 0; i < srcData.length; i++) {
                            const _data = srcData[i];
                            accessorOptions.dataFields.map(({ accessor }) => {
                              const content = _data[accessor] || '-';
                              result.push(
                                <td key={`${content}_${i}`}>{content}</td>
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
                return _res;
              });
            };
            res = getTrItems(0, data);
            return res;
            // Object.keys(data).map((rowOption, idx) => {
            //   const rowItem = data[brand];
            //   return (
            //     <Fragment key={brand}>
            //       <tr>
            //         <td
            //           colSpan={colSpan}
            //         >{brand}</td>
            //       </tr>
            //       {
            //         accessorOptions.rowsFields.map((type) => {
            //           const typeItem = rowItem[type];
            //           const carNames = Object.keys(typeItem);
            //           return (
            //             <Fragment key={type}>
            //               <tr>
            //                 <td
            //                   style={{ paddingLeft: 30 }}
            //                   colSpan={colSpan}
            //                 >
            //                   {type}
            //                 </td>
            //               </tr>
            //               {
            //                 accessorOptions.dataFields.map((carName) => {
            //                   const salesData = typeItem[carName];
            //                   return (
            //                     <Fragment key={carName}>
            //                       <tr>
            //                         <td style={{ paddingLeft: 50 }}>{carName}</td>
            //                         {
            //                           (() => {
            //                             const result: JSX.Element[] = [];
            //                             for (let i = 0; i < salesData.length; i++) {
            //                               const _data = salesData[i] || { count: 0, price: 0 };
            //                               result.push(
            //                                 <Fragment key={`${carName}_${i}`}>
            //                                   {
            //                                     accessorOptions.dataFields.map((field) => {
            //                                       return (
            //                                         <td>{_data[field] || '-'}</td>
            //                                       );
            //                                     })
            //                                   }
            //                                 </Fragment>
            //                               );
            //                             }
            //                             return result;
            //                           })()
            //                         }
            //                       </tr>
            //                     </Fragment>
            //                   );
            //                 })
            //               }
            //             </Fragment>
            //           );
            //         })
            //       }
            //     </Fragment>
            //   );
            // });
          })()
        }
      </tbody>
    </table>
  );
};

const options = (columns): FormOptions => {
  const values = {};
  columns.map((column) => {
    values[column] = column;
  });
  return [
    {
      type: 'select',
      title: 'column fields',
      ref: 'columnsFields',
      values: {
        month: 'month',
        season: 'season',
        halflYear: 'halflYear',
        fullYear: 'fullYear',
      }
    },
    {
      type: 'select',
      title: 'date fields',
      ref: 'dateField',
      values
    },
    {
      type: 'select',
      title: 'rows fields',
      ref: 'rowsFields',
      isMultiple: true,
      values
    },
    {
      type: 'select',
      title: 'data fields',
      ref: 'dataFields',
      isMultiple: true,
      values
    },
  ];
};

Table.genEditablePropsConfig = options;

export default Table;
