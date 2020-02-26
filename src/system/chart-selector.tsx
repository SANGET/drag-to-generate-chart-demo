import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import ToolTip from '@deer-ui/core/tooltip/tooltip';

import { ComponentItem, SetActiveComponentByType } from './types';
import { ItemTypes } from '../utils/constant';

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
  setActiveComponentByType, data
}: {
  setActiveComponentByType: SetActiveComponentByType;
  data: ComponentItem[];
}) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      document.querySelector('#pivoTable').click();
    }
    return () => {};
  }, []);
  return (
    <>
      <div className="chart-selector">
        <h4>Chart type</h4>
        {
          data.map((item) => {
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
                  id={type}
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

export default ChartSelectorGroup;
