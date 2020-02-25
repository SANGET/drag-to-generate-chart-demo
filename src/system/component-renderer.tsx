/* eslint-disable no-nested-ternary */
import React from 'react';
import { Grid } from '@deer-ui/core/grid';
import { Icon } from '@deer-ui/core/icon';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../utils/constant';

const MainRenderContainer = ({
  activeComponent,
  selectedItem,
  setSelectedType,
  setActiveComponentByType,
  dataSource,
  closeItem,
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
        space={10}
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
                  <div
                    className="close"
                    onClick={(e) => {
                      closeItem(itemType);
                    }}
                  >
                    <Icon n="times" />
                  </div>
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
              Load a xlsx or use default data.
            </Grid>
          )
        }
      </Grid>
    </div>
  );
};

export default MainRenderContainer;
