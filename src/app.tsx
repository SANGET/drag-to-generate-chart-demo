import React, { useState } from 'react';
import {
  Grid, FormGenerator, Icon, Container
} from '@deer-ui/core';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import Table from './components/table2';
import LineChart from './components/line-chart';
import CarsDataSource from './utils/carsdata.json';

import './style.scss';
import { ItemTypes } from './utils/constant';

const createViewType = [
  {
    type: 'lineChart',
    title: 'Line Chart',
    component: LineChart,
    icon: <Icon n="chart-line" style={{ fontSize: 20 }} />,
    layoutInfo: {
      xl: 6,
      lg: 6,
    }
  },
  {
    type: 'pivoTable',
    title: 'Pivot Table',
    component: Table,
    icon: <Icon n="table" style={{ fontSize: 20 }} />,
    layoutInfo: {
      xl: 12,
      lg: 12,
    }
  },
];

const ComponentPropsEditor = ({
  selectedComponent, onChangeValue
}) => {
  if (!selectedComponent) return null;
  const {
    title, component, type, runningProps
  } = selectedComponent;
  const { editablePropsConfig } = component;
  return (
    <div className="chart-editor">
      <FormGenerator
        formOptions={['Props editor', ...editablePropsConfig]}
        ref={(e) => {
          if (e) {
            e.changeValues(runningProps, true);
          }
        }}
        layout="vertical"
        onChange={(values, ref, val) => {
          onChangeValue(values);
        }}
      />
    </div>
  );
};

const DragItem = ({
  children, item, ...other
}) => {
  const [collectedPropsForDrag, drag] = useDrag({
    item: { originItem: item, type: ItemTypes.DragTableItem },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <div {...other} ref={drag}>
      {children}
    </div>
  );
};

const ChartGroup = ({
  setActiveComponent,
  activeComponent,
  setSelectedType,
  setActiveComponentByType,
}) => {
  return (
    <>
      <div className="chart-selector">
        <h4>Chart type</h4>
        {
          createViewType.map((item) => {
            const {
              title, component, type, icon
            } = item;
            return (
              <div
                className="action-item"
                key={item.title}
              >
                <h5>
                  {title}
                </h5>
                <DragItem
                  className="drag-area _btn"
                  item={item}
                  onClick={(e) => {
                    setActiveComponentByType(type, item);
                    // setActiveComponent({
                    //   ...activeComponent,
                    //   [type]: {
                    //     ...item,
                    //     runningProps: Object.assign({},
                    //       activeComponent[type] && activeComponent[type].runningProps)
                    //   }
                    // });
                    // setSelectedType(type);
                  }}
                >
                  {icon}
                </DragItem>
              </div>
            );
          })
        }
      </div>
    </>
  );
};

const MainRenderContainer = ({
  activeComponent,
  selectedItem,
  setSelectedType,
  setActiveComponentByType,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.DragTableItem,
    drop: ({ originItem }) => {
      // console.log('drop');
      setActiveComponentByType(originItem.type, originItem);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  return (
    <div
      ref={drop}
      className={`renderer${isOver ? ' overing' : ''}`}
    >
      <Grid
        container
        space={20}
        className="render-container"
      >
        {
          Object.keys(activeComponent).map((itemType) => {
            const item = activeComponent[itemType];
            const active = selectedItem && selectedItem.type === itemType;
            return (
              <Grid
                {...(item.layoutInfo || { xl: 12, lg: 12 })}
                key={itemType} onClick={(e) => {
                  setSelectedType(itemType);
                }}
              >
                <div
                  className={`active-renderer${active ? ' active' : ''}`}
                >
                  <item.component
                    {...item.runningProps}
                    dataSource={CarsDataSource}
                  />
                </div>
              </Grid>
            );
          })
        }
      </Grid>
    </div>
  );
};

const App = () => {
  const [activeComponent, setActiveComponent] = useState({});
  const [selectedType, setSelectedType] = useState('');
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
  return (
    <DndProvider backend={Backend}>
      <Container className="App p10" fluid>
        <Grid container space={10}>
          <Grid
            xl={2}
            lg={2}
          >
            <ChartGroup
              setSelectedType={setSelectedType}
              activeComponent={activeComponent}
              setActiveComponent={setActiveComponent}
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
              setActiveComponentByType={setActiveComponentByType}
            />
          </Grid>
          <Grid
            xl={2}
            lg={2}
          >
            <ComponentPropsEditor
              key={selectedType}
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
