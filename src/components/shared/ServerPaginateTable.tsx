import { PropsWithChildren } from "react";
import Table, { TableProps } from "./Table";

interface ServerPaginateTableProps<T extends object = {}>
  extends Partial<TableProps<T>> {
  pageIndex?: number;
  pageSize: number;
  totalCount: number;
}

const ServerPaginateTable = <T extends object = {}>({
  pageIndex = 0,
  pageSize,
  totalCount,
  ...props
}: PropsWithChildren<ServerPaginateTableProps<T>>) => {
  const pageCount = Math.ceil(totalCount / pageSize);

  return (
    // @ts-ignore

    <Table
      initialState={{ pageIndex, pageSize }}
      manualPagination
      {...props}
      pageCount={pageCount ? pageCount : 1}
    />
  );
};

export default ServerPaginateTable;
