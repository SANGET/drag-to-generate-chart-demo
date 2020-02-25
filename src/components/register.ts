import { Children } from '@deer-ui/core/utils';
import { RowSet } from '@deer-ui/core/grid';
import Table from './table';
import LineChart from './line-chart';

export interface ComponentItem {
  type: string;
  title: string;
  component: Children;
  icon?: string;
  layoutInfo?: {
    xs?: RowSet;
    sm?: RowSet;
    md?: RowSet;
    lg?: RowSet;
    xl?: RowSet;
  };
}

const chartSelections: ComponentItem[] = [
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
export default chartSelections;
