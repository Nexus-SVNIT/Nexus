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

  const getRatingBadge = (row) => {
    let color = '';
    
    // For Codeforces
    if (row.original.rating !== undefined) {
      if (row.original.rating >= 2400) color = 'bg-rose-500';
      else if (row.original.rating >= 2100) color = 'bg-amber-500';
      else if (row.original.rating >= 1900) color = 'bg-violet-500';
      else if (row.original.rating >= 1600) color = 'bg-sky-500';
      else if (row.original.rating >= 1400) color = 'bg-cyan-400';
      else if (row.original.rating >= 1200) color = 'bg-emerald-400';
      else if (row.original.rating > 0) color = 'bg-slate-400';
    }
    
    // For LeetCode
    if (row.original.globalRanking !== undefined) {
      if (row.original.rating >= 2800) color = 'bg-rose-500';
      else if (row.original.rating >= 2400) color = 'bg-amber-500';
      else if (row.original.rating >= 2000) color = 'bg-violet-500';
      else if (row.original.rating >= 1600) color = 'bg-sky-500';
      else if (row.original.rating > 0) color = 'bg-emerald-400';
    }
    
    // For CodeChef
    if (row.original.rating_number !== undefined) {
      if (row.original.rating_number >= 2500) color = 'bg-rose-500';
      else if (row.original.rating_number >= 2200) color = 'bg-amber-500';
      else if (row.original.rating_number >= 2000) color = 'bg-violet-500';
      else if (row.original.rating_number >= 1800) color = 'bg-sky-500';
      else if (row.original.rating_number >= 1600) color = 'bg-cyan-400';
      else if (row.original.rating_number > 0) color = 'bg-emerald-400';
    }

    return color ? (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-6 rounded-full ${color} shadow-lg shadow-${color}/50`}></div>
      </div>
    ) : null;
  };

  const getRatingButtonStyle = (row, value) => {
    let style = '';
    
    // For Codeforces
    if (row.original.rating !== undefined) {
      if (row.original.rating >= 2400) style = 'bg-rose-600 hover:bg-rose-700';
      else if (row.original.rating >= 2100) style = 'bg-amber-600 hover:bg-amber-700';
      else if (row.original.rating >= 1900) style = 'bg-violet-600 hover:bg-violet-700';
      else if (row.original.rating >= 1600) style = 'bg-sky-600 hover:bg-sky-700';
      else if (row.original.rating >= 1400) style = 'bg-cyan-600 hover:bg-cyan-700';
      else if (row.original.rating >= 1200) style = 'bg-emerald-600 hover:bg-emerald-700';
      else if (row.original.rating > 0) style = 'bg-slate-600 hover:bg-slate-700';
    }
    
    // For LeetCode and CodeChef - similar rating ranges as before
    if (row.original.globalRanking !== undefined) {
      if (row.original.rating >= 2800) style = 'bg-rose-600 hover:bg-rose-700';
      else if (row.original.rating >= 2400) style = 'bg-amber-600 hover:bg-amber-700';
      else if (row.original.rating >= 2000) style = 'bg-violet-600 hover:bg-violet-700';
      else if (row.original.rating >= 1600) style = 'bg-sky-600 hover:bg-sky-700';
      else if (row.original.rating > 0) style = 'bg-emerald-600 hover:bg-emerald-700';
    }
    
    if (row.original.rating_number !== undefined) {
      if (row.original.rating_number >= 2500) style = 'bg-rose-600 hover:bg-rose-700';
      else if (row.original.rating_number >= 2200) style = 'bg-amber-600 hover:bg-amber-700';
      else if (row.original.rating_number >= 2000) style = 'bg-violet-600 hover:bg-violet-700';
      else if (row.original.rating_number >= 1800) style = 'bg-sky-600 hover:bg-sky-700';
      else if (row.original.rating_number >= 1600) style = 'bg-cyan-600 hover:bg-cyan-700';
      else if (row.original.rating_number > 0) style = 'bg-emerald-600 hover:bg-emerald-700';
    }

    return (
      <span className={`inline-block px-3 py-1 rounded-full text-white font-medium ${style} transition-colors`}>
        {value}
      </span>
    );
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
                  {...column.getHeaderProps(
                    column.id === 'Rank' ? {} : column.getSortByToggleProps()
                  )}
                  key={column.id}
                  className="p-2 sm:p-4 whitespace-nowrap"
                >
                  {column.render("Header")}
                  {column.id !== 'Rank' && (
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={row.id}
                className="transition duration-200 ease-in-out hover:bg-gray-700/50 text-gray-200"
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.column.id} className="p-2 sm:p-4">
                    {cell.column.id === "fullName" ? (
                      <div className="flex items-center gap-2">
                        {getRatingBadge(row)}
                        <span>{cell.value}</span>
                      </div>
                    ) : cell.column.id === "rating" || cell.column.id === "rating_number" || cell.column.id === "maxRating" ? (
                      getRatingButtonStyle(row, cell.value)
                    ) : cell.column.id === "Rank" ? (
                      pageSize * pageIndex + i + 1
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
