import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'


interface DataTableProps<T> {
  data: T[]
  columns: (ColumnDef<T, string> | ColumnDef<T, Date>)[]
}

export default function DataTable<T>({data, columns}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200 bg-white shadow-md">
      <thead className="bg-gray-100">
        {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id} className="border-b border-gray-200">
          {headerGroup.headers.map(header => (
          <th
            key={header.id}
            className="px-4 py-2 text-left text-sm font-medium text-gray-700"
          >
            {header.isPlaceholder
            ? null
            : flexRender(
              header.column.columnDef.header,
              header.getContext()
              )}
          </th>
          ))}
        </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
        <tr
          key={row.id}
          className="border-b border-gray-200 hover:bg-gray-50"
        >
          {row.getVisibleCells().map(cell => (
          <td
            key={cell.id}
            className="px-4 py-2 text-sm text-gray-600"
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
          ))}
        </tr>
        ))}
      </tbody>
      <tfoot className="bg-gray-100">
        {table.getFooterGroups().map(footerGroup => (
        <tr key={footerGroup.id} className="border-t border-gray-200">
          {footerGroup.headers.map(header => (
          <th
            key={header.id}
            className="px-4 py-2 text-left text-sm font-medium text-gray-700"
          >
            {header.isPlaceholder
            ? null
            : flexRender(
              header.column.columnDef.footer,
              header.getContext()
              )}
          </th>
          ))}
        </tr>
        ))}
      </tfoot>
      </table>
    </div>
  )
}
