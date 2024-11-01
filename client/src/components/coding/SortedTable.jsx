import { useTable, useSortBy } from "react-table";

const SortableTable = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  // Function to construct URLs based on the platform
  const getPlatformUrl = (columnId, userid) => {
    if (!userid) return null;

    switch (columnId) {
      case "leetcodeProfile":
        return `https://leetcode.com/u/${userid}/`;
      case "codeforcesProfile":
        return `https://codeforces.com/profile/${userid}`;
      case "codechefProfile":
        return `https://www.codechef.com/users/${userid}`;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table
        {...getTableProps()}
        className="bg-gray-800 mb-8 mt-4 min-w-full rounded-lg text-sm sm:text-base"
      >
        <thead className="text-xs sm:text-sm uppercase text-blue-400">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id}
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
                key={row.id}
                className="transition duration-200 ease-in-out hover:bg-cyan-900"
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.column.id} className="p-2 sm:p-4">
                    {cell.column.id === "leetcodeProfile" || cell.column.id === "codeforcesProfile" || cell.column.id === "codechefProfile" ? (
                      cell.value ? (
                        <a
                          href={getPlatformUrl(cell.column.id, cell.value)}
                          className="text-blue-400 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Link
                        </a>
                      ) : (
                        "N/A"
                      )
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
