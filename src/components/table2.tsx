import React, { Fragment, useMemo } from 'react';
import { FormOptions } from '@deer-ui/core/form-generator/form-generator';
import { month, getCarDataForTable } from '../utils/carsdata-filter';

const Table = ({
  dataSource
}) => {
  const colums = month;
  const colSpan = 25;
  const data = useMemo(() => getCarDataForTable(dataSource), [dataSource]);
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
          Object.keys(data).map((brand) => {
            const brandItem = data[brand];
            return (
              <Fragment key={brand}>
                <tr>
                  <td
                    colSpan={colSpan}
                  >{brand}</td>
                </tr>
                {
                  Object.keys(brandItem).map((type) => {
                    const typeItem = brandItem[type];
                    const carNames = Object.keys(typeItem);
                    return (
                      <Fragment key={type}>
                        <tr>
                          <td
                            style={{ paddingLeft: 30 }}
                            colSpan={colSpan}
                          >
                            {type}
                          </td>
                        </tr>
                        {
                          carNames.map((carName) => {
                            const salesData = typeItem[carName];
                            return (
                              <Fragment key={carName}>
                                <tr>
                                  <td style={{ paddingLeft: 50 }}>{carName}</td>
                                  {
                                    (() => {
                                      const result: JSX.Element[] = [];
                                      for (let i = 0; i < salesData.length; i++) {
                                        const _data = salesData[i] || { count: 0, price: 0 };
                                        const { count, price } = _data;
                                        result.push(
                                          <Fragment key={`${carName}_${price}_${i}`}>
                                            <td>{count}</td>
                                            <td>{price}</td>
                                          </Fragment>
                                        );
                                      }
                                      return result;
                                    })()
                                  }
                                </tr>
                              </Fragment>
                            );
                          })
                        }
                      </Fragment>
                    );
                  })
                }
              </Fragment>
            );
          })
        }
      </tbody>
    </table>
  );
};

const options: FormOptions = [
  {
    type: 'select',
    title: 'column fields',
    defaultValue: ['count', 'price'],
    ref: 'columnFields',
    isMultiple: true,
    values: {
      count: 'count',
      price: 'price',
      brand: 'brand',
    }
  },
  {
    type: 'select',
    title: 'rows fields',
    defaultValue: ['count', 'price'],
    ref: 'rowsFields',
    isMultiple: true,
    values: {
      count: 'count',
      price: 'price',
      brand: 'brand',
    }
  },
  {
    type: 'select',
    title: 'data fields',
    defaultValue: ['count', 'price'],
    ref: 'dataFields',
    isMultiple: true,
    values: {
      count: 'count',
      price: 'price',
      brand: 'brand',
    }
  },
];

Table.editablePropsConfig = options;

export default Table;
