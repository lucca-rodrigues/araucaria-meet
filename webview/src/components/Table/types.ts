export interface TableColumn<T = unknown> {
  header: string;
  accessorKey: string;
  cell?: (props: { row: { original: T } }) => JSX.Element;
}

export interface TableProps<T = unknown> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
}
