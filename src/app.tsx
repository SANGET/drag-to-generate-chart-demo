/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import {
  Grid, FormGenerator, Icon, Container, FormLayout, ToolTip, Button
} from '@deer-ui/core';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import Table from './components/table';
import LineChart from './components/line-chart';

import './style.scss';
import { ItemTypes } from './utils/constant';

import { convertXlsxToJson } from './utils/convert2json';

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

const createViewType = [
  {
    type: 'lineChart',
    title: 'Line Chart',
    component: LineChart,
    icon: "chart-line",
    layoutInfo: {
      xl: 6,
      lg: 6,
    }
  },
  {
    type: 'pivoTable',
    title: 'Pivot Table',
    component: Table,
    icon: "table",
    layoutInfo: {
      xl: 12,
      lg: 12,
    }
  },
];

const ComponentPropsEditor = ({
  selectedComponent, onChangeValue, columns
}) => {
  if (!selectedComponent) return null;
  const {
    title, component, type, runningProps
  } = selectedComponent;
  const { genEditablePropsConfig } = component;
  return (
    <div className="chart-editor">
      <FormLayout
        formOptions={['Props editor', ...genEditablePropsConfig(columns)]}
        formBtns={[
          {
            action: (formRef) => {
              const checkRes = formRef.checkForm();
              // console.log(checkRes);
              onChangeValue(formRef.value);
            },
            text: 'Update UI'
          }
        ]}
        ref={(e) => {
          if (e) {
            e.formHelper.changeValues(runningProps, true);
          }
        }}
        layout="vertical"
        // onChange={(values, ref, val) => {
        // }}
      />
    </div>
  );
};

const UploadFile = ({
  onLoadFile
}) => {
  const [loadedData, setLoadedData] = useState();
  return (
    <div className="file-loader">
      <input
        id="LoadFile"
        style={{
          position: 'absolute',
          zIndex: -1,
          opacity: 0
        }}
        type="file" onChange={(e) => {
          convertXlsxToJson(e)
            .then((resData) => {
              onLoadFile && onLoadFile(resData);
              setLoadedData(resData);
            });
        }}
      />
      <Button
        className="mr10"
        onClick={(e) => {
          document.querySelector('#LoadFile').click();
        }}
      >
        Load xlsx
      </Button>
      <Button
        hola
        className="mr10"
        onClick={(e) => {
        import('./utils/carsdata.json')
          .then((res) => {
            onLoadFile(res.Cars);
            setLoadedData(res.Cars);
          });
        }}
      >
        Use default data
      </Button>
      {
        !!loadedData && (
          <Button
            hola
            color="green"
            className="mr10"
            onClick={(e) => {
              const w = window.open();
              w.document.write(JSON.stringify(loadedData));
            }}
          >
            Perview loaded Data
          </Button>
        )
      }
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

const ChartSelectorGroup = ({
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
                <h5 className="t_gray-6">
                  {title}
                </h5>
                <DragItem
                  className="drag-area _btn"
                  item={item}
                  onClick={(e) => {
                    setActiveComponentByType(type, item);
                  }}
                >
                  <ToolTip
                    n={icon}
                    title={type}
                    className="t_blue"
                    clickToClose
                    style={{
                      fontSize: 22,
                    }}
                  />
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
  dataSource
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
  const activeItemTypes = Object.keys(activeComponent);
  const hasActiveItem = activeItemTypes.length > 0;
  const loadedData = !!dataSource;
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
          loadedData ? (hasActiveItem ? activeItemTypes.map((itemType) => {
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
                    columns={Object.keys(dataSource[0])}
                    dataSource={dataSource}
                  />
                </div>
              </Grid>
            );
          }) : (
            <Grid
              xl={12}
              lg={12}
              className="no-item-tip text-center t_gray-6"
              style={{
                fontSize: 30,
                // color: `#DDD`,
              }}
            >
              Drag a component from left panel to this area.
            </Grid>
          )) : (
            <Grid
              xl={12}
              lg={12}
              className="no-item-tip text-center t_gray-6"
              style={{
                fontSize: 30,
                // color: `#DDD`,
              }}
            >
              Load a xlsx or use default data first.
            </Grid>
          )
        }
      </Grid>
    </div>
  );
};

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
              dataSource={dataSource}
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
