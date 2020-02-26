import React, { useState } from 'react';

import { Grid } from '@deer-ui/core/grid';
import { Icon } from '@deer-ui/core/icon';
import { Container } from '@deer-ui/core/container';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import Uploader from './system/uploader';
import ChartSelector from './system/chart-selector';
import MainRenderContainer from './system/component-renderer';
import ComponentPropsEditor from './system/prop-editor';

import chartSelections from './components/register';

import './style.scss';
import { SetActiveComponentByType } from './system/types';

if (window.OnLuanched) window.OnLuanched();

const App = () => {
  const [activeComponent, setActiveComponent] = useState({});
  const [selectedType, setSelectedType] = useState('');
  const [dataSource, setDataSource] = useState();
  const selectedItem = activeComponent[selectedType];
  const setActiveComponentByType: SetActiveComponentByType = (type, item) => {
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
        <Uploader
          onLoadFile={(resData) => {
            setDataSource(resData);
          }}
        />
        <Grid container space={10}>
          <Grid
            xl={2}
            lg={2}
          >
            <ChartSelector
              setActiveComponentByType={setActiveComponentByType}
              data={chartSelections}
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
            {
              selectedItem && (
                <ComponentPropsEditor
                  // key={selectedType}
                  columns={dataSource ? Object.keys(dataSource[0]) : []}
                  selectedComponent={selectedItem}
                  dataSource={dataSource}
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
                />
              )
            }
          </Grid>
        </Grid>
      </Container>
    </DndProvider>
  );
};

export default App;
