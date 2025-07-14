import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";

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
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination,
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

  const getRatingButtonStyle = (row, value) => {
    let style = "";

    // For Codeforces - only maxRating
    if (row.original.maxRating !== undefined) {
      // if (row.original.maxRating >= 2400) style = 'border-rose-400 text-rose-300 bg-rose-500/20';
      // if (row.original.maxRating >= 2300) style = 'border-amber-400 text-amber-300 bg-amber-500/20';
      if (row.original.maxRating >= 2100)
        style = "border-yellow-400 text-yellow-300 bg-yellow-500/20";
      else if (row.original.maxRating >= 1900)
        style = "border-violet-400 text-violet-300 bg-violet-500/20";
      else if (row.original.maxRating >= 1600)
        style = "border-blue-400 text-blue-300 bg-blue-500/20";
      else if (row.original.maxRating >= 1400)
        style = "border-cyan-400 text-cyan-300 bg-cyan-500/20";
      else if (row.original.maxRating >= 1200)
        style = "border-emerald-400 text-emerald-300 bg-emerald-500/20";
      else if (row.original.maxRating > 0)
        style = "border-zinc-400 text-zinc-300 bg-zinc-500/20";
    }

    // For LeetCode - rating
    if (
      row.original.globalRanking !== undefined &&
      row.original.rating !== undefined
    ) {
      if (row.original.rating >= 2100)
        style = "border-rose-400 text-rose-300 bg-rose-500/20";
      else if (row.original.rating >= 1900)
        style = "border-amber-400 text-amber-300 bg-amber-500/20";
      else if (row.original.rating >= 1700)
        style = "border-yellow-400 text-yellow-300 bg-yellow-500/20";
      else if (row.original.rating >= 1500)
        style = "border-violet-400 text-violet-300 bg-violet-500/20";
      else if (row.original.rating > 0)
        style = "border-emerald-400 text-emerald-300 bg-emerald-500/20";
      else style = "border-zinc-400 text-zinc-300 bg-zinc-500/20";
    }

    // For CodeChef - only rating (stars)
    if (
      row.original.rating !== undefined &&
      row.original.rating_number !== undefined
    ) {
      if (row.original.rating.includes("7★"))
        style = "border-rose-400 text-rose-300 bg-rose-500/20";
      else if (row.original.rating.includes("6★"))
        style = "border-amber-400 text-amber-300 bg-amber-500/20";
      else if (row.original.rating.includes("5★"))
        style = "border-yellow-400 text-yellow-300 bg-yellow-500/20";
      else if (row.original.rating.includes("4★"))
        style = "border-violet-400 text-violet-300 bg-violet-500/20";
      else if (row.original.rating.includes("3★"))
        style = "border-cyan-400 text-cyan-300 bg-cyan-500/20";
      else if (row.original.rating.includes("2★"))
        style = "border-emerald-400 text-emerald-300 bg-emerald-500/20";
      else if (row.original.rating.includes("1★"))
        style = "border-zinc-400 text-zinc-300 bg-zinc-500/20";
    }

    return (
      <span
        className={`inline-block rounded-full border px-3 py-1 ${style} transition-all hover:bg-opacity-20`}
      >
        {value}
      </span>
    );
  };

  const getRatingBarStyle = (row) => {
    let color = "";

    // For Codeforces
    if (row.original.rating !== undefined) {
      if (row.original.rating >= 2400) color = "bg-rose-400";
      else if (row.original.rating >= 2100) color = "bg-amber-400";
      else if (row.original.rating >= 1900) color = "bg-yellow-400";
      else if (row.original.rating >= 1600) color = "bg-violet-400";
      else if (row.original.rating >= 1400) color = "bg-cyan-400";
      else if (row.original.rating >= 1200) color = "bg-emerald-400";
      else if (row.original.rating > 0) color = "bg-zinc-400";
    }

    // For LeetCode
    if (row.original.globalRanking !== undefined) {
      if (row.original.rating >= 2800) color = "bg-rose-400";
      else if (row.original.rating >= 2400) color = "bg-amber-400";
      else if (row.original.rating >= 2000) color = "bg-yellow-400";
      else if (row.original.rating >= 1600) color = "bg-violet-400";
      else if (row.original.rating > 0) color = "bg-emerald-400";
    }

    // For CodeChef
    if (row.original.rating_number !== undefined) {
      if (row.original.rating_number >= 2500) color = "bg-rose-400";
      else if (row.original.rating_number >= 2200) color = "bg-amber-400";
      else if (row.original.rating_number >= 2000) color = "bg-yellow-400";
      else if (row.original.rating_number >= 1800) color = "bg-violet-400";
      else if (row.original.rating_number >= 1600) color = "bg-cyan-400";
      else if (row.original.rating_number > 0) color = "bg-emerald-400";
    }

    return color ? (
      <div className={`h-6 w-2 rounded-full ${color} shadow-lg`}></div>
    ) : null;
  };

  return (
    <div className="mb-16 overflow-x-auto">
      {" "}
      {/* Added margin-bottom for table spacing */}
      <table
        {...getTableProps()}
        className="bg-gray-800 mb-4 mt-4 min-w-full rounded-lg text-sm sm:text-base"
      >
        <thead className="text-xs uppercase text-blue-400 sm:text-sm">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(
                    column.id === "Rank" ? {} : column.getSortByToggleProps(),
                  )}
                  key={column.id}
                  className="whitespace-nowrap p-2 sm:p-4"
                >
                  {column.id === "tableRank"
                    ? `#${column.render("Header")}`
                    : column.render("Header")}
                  {column.id !== "tableRank" && (
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
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
                className="hover:bg-gray-700/50 text-gray-200 transition duration-200 ease-in-out"
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    key={cell.column.id}
                    className="p-2 sm:p-4"
                  >
                    {cell.column.id === "fullName" ? (
                      <div className="flex items-center gap-2">
                        {getRatingBarStyle(row)}
                        <span>{cell.value}</span>
                      </div>
                    ) : (cell.column.id === "maxRating" &&
                        row.original.codeforcesProfile) ||
                      (cell.column.id === "rating" &&
                        (row.original.codechefProfile ||
                          row.original.leetcodeProfile)) ? (
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
      <div className="mt-6 flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <div className="bg-gray-800 flex items-center gap-3 rounded-lg p-3">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="disabled:bg-gray-700 disabled:text-gray-500 rounded-md bg-blue-600 px-3 py-2 transition-colors hover:bg-blue-700"
          >
            {"<<"}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="disabled:bg-gray-700 disabled:text-gray-500 rounded-md bg-blue-600 px-3 py-2 transition-colors hover:bg-blue-700"
          >
            {"<"}
          </button>
          <span className="mx-2">
            Page <strong>{pageIndex + 1}</strong> of{" "}
            <strong>{pageOptions.length}</strong>
          </span>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="disabled:bg-gray-700 disabled:text-gray-500 rounded-md bg-blue-600 px-3 py-2 transition-colors hover:bg-blue-700"
          >
            {">"}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="disabled:bg-gray-700 disabled:text-gray-500 rounded-md bg-blue-600 px-3 py-2 transition-colors hover:bg-blue-700"
          >
            {">>"}
          </button>
        </div>

        <div className="bg-gray-800 flex items-center gap-2 rounded-lg p-3">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="text-gray-200 border-gray-700 rounded border bg-slate-950 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size} className="bg-transparent">
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
