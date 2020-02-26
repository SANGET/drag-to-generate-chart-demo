import { Children } from '@deer-ui/core/utils';
import { RowSet } from '@deer-ui/core/grid';

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
export type SetActiveComponentByType = (type: string, item: ComponentItem) => void;
