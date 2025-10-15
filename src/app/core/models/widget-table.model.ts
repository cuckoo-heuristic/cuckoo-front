export interface WidgetTableColumnConfig {
  key: string;
  title: string;
  action?: (item: any) => string;
  type: 'date' | 'dateTime' | 'text' | 'number';
  isSort?: true | undefined;
  direction?: 'ltr' | 'rtl';
  translator?: boolean;
  condition?: any;
}

export interface WidgetTableTableSort {
  column: string;
  key: 'ascend' | 'descend' | null;
}

export interface WidgetTableTableSelected {
  items: any[];
  list: 'all' | 'selected';
  keepSelected?: boolean;
}
