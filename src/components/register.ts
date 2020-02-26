import Table from './table';
import LineChart from './line-chart';
import { ComponentItem } from '../system/types';

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
