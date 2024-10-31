import { useTable, useSortBy } from "react-table";

const SortableTable = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <div className="overflow-x-auto">
      <table
        {...getTableProps()}
        className="bg-gray-800 mb-8 mt-4 min-w-full rounded-lg text-sm sm:text-base"
      >
        <thead className="text-xs sm:text-sm uppercase text-blue-400">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="p-2 sm:p-4 whitespace-nowrap"
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="transition duration-200 ease-in-out hover:bg-cyan-900"
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="p-2 sm:p-4">
                    {cell.column.id === "leetcodeProfile" || cell.column.id === "codeforcesProfile" || cell.column.id === "codechefProfile"  ? (
                      <a
                        href={cell.value}
                        className="text-blue-400 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Link
                      </a>
                    ) : (
                      cell.render("Cell")
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SortableTable;
