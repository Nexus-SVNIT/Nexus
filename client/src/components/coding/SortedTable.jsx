import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';

const SortableTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    useSortBy,
    usePagination
  );

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
    <div className="overflow-x-auto mb-16"> {/* Added margin-bottom for table spacing */}
      <table
        {...getTableProps()}
        className="bg-gray-800 mb-4 mt-4 min-w-full rounded-lg text-sm sm:text-base"
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
          {page.map((row) => {
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

      {/* Updated Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-4 gap-4">
        <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="px-3 py-2 bg-blue-600 rounded-md disabled:bg-gray-700 disabled:text-gray-500 hover:bg-blue-700 transition-colors"
          >
            {'<<'}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-3 py-2 bg-blue-600 rounded-md disabled:bg-gray-700 disabled:text-gray-500 hover:bg-blue-700 transition-colors"
          >
            {'<'}
          </button>
          <span className="mx-2">
            Page <strong>{pageIndex + 1}</strong> of <strong>{pageOptions.length}</strong>
          </span>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-3 py-2 bg-blue-600 rounded-md disabled:bg-gray-700 disabled:text-gray-500 hover:bg-blue-700 transition-colors"
          >
            {'>'}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="px-3 py-2 bg-blue-600 rounded-md disabled:bg-gray-700 disabled:text-gray-500 hover:bg-blue-700 transition-colors"
          >
            {'>>'}
          </button>
        </div>

        <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-lg">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className="bg-slate-950 text-gray-200 border border-gray-700 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size} className='bg-transparent'>
                {size}
              </option>
            ))}
          </select>
          <span>entries</span>
        </div>
      </div>
    </div>
  );
};

export default SortableTable;
