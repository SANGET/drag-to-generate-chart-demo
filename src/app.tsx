import React, { useState } from 'react';

import { Grid } from '@deer-ui/core/grid';
import { Icon } from '@deer-ui/core/icon';
import { Container } from '@deer-ui/core/container';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import UploadFile from './components/uploader';
import ChartSelectorGroup from './components/chart-selector';
import MainRenderContainer from './components/component-renderer';
import ComponentPropsEditor from './components/prop-editor';

import './style.scss';

if (window.OnLuanched) window.OnLuanched();

// 测试数据的正确性
// import { getDataForTable } from './utils/carsdata-filter';

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

const App = () => {
  const [activeComponent, setActiveComponent] = useState({});
  const [selectedType, setSelectedType] = useState('');
  const [dataSource, setDataSource] = useState();
  const selectedItem = activeComponent[selectedType];
  const setActiveComponentByType = (type, item) => {
    setActiveComponent({
      ...activeComponent,
      [type]: {
        ...item,
        runningProps: Object.assign({},
          activeComponent[type] && activeComponent[type].runningProps)
      }
    });
    setSelectedType(type);
  };
  const closeItem = (type) => {
    const nextComponent = Object.assign({}, activeComponent);
    delete nextComponent[type];
    setActiveComponent(nextComponent);
  };
  return (
    <DndProvider backend={Backend}>
      <Container className="App p10" fluid>
        <UploadFile
          onLoadFile={(resData) => {
            setDataSource(resData);
          }}
        />
        <Grid container space={10}>
          <Grid
            xl={2}
            lg={2}
          >
            <ChartSelectorGroup
              setActiveComponentByType={setActiveComponentByType}
            />
          </Grid>
          <Grid
            xl={8}
            lg={8}
          >
            <MainRenderContainer
              activeComponent={activeComponent}
              selectedItem={selectedItem}
              setSelectedType={setSelectedType}
              dataSource={dataSource}
              closeItem={closeItem}
              setActiveComponentByType={setActiveComponentByType}
            />
          </Grid>
          <Grid
            xl={2}
            lg={2}
          >
            <ComponentPropsEditor
              key={selectedType}
              columns={dataSource ? Object.keys(dataSource[0]) : []}
              onChangeValue={(nextValues) => {
              // console.log(nextValues);
                setActiveComponent({
                  ...activeComponent,
                  [selectedType]: Object.assign({}, selectedItem,
                    {
                      runningProps: Object.assign({}, selectedItem.runningProps, nextValues)
                    })
                });
              }}
              selectedComponent={selectedItem}
            />
          </Grid>
        </Grid>
      </Container>
    </DndProvider>
  );
};

export default App;
