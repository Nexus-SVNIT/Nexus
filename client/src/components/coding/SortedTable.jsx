import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { useSearchParams } from "react-router-dom";

const SortableTable = ({ columns, data, searchParams, setSearchParams }) => {
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentPageSize = parseInt(searchParams.get("limit") || "10");

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize, sortBy },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: currentPage - 1,
        pageSize: currentPageSize,
        sortBy: [
          {
            id: searchParams.get("sortBy") || "sortingKey",
            desc: searchParams.get("sortOrder") === "desc",
          },
        ],
      },
      manualPagination: true,
      manualSortBy: true,
      pageCount: Math.ceil(data.length / currentPageSize),
    },
    useSortBy,
    usePagination,
  );

  const getRatingButtonStyle = (row, value) => {
    let style = "";
    console.log(row);
    // For Codeforces - only maxRating
    const data = row.original.sortingKey;

    switch (row.original.platform) {
      case "codeforces":
        if (data >= 2100)
          style = "border-yellow-400 text-yellow-300 bg-yellow-500/20";
        else if (data >= 1900)
          style = "border-violet-400 text-violet-300 bg-violet-500/20";
        else if (data >= 1600)
          style = "border-blue-400 text-blue-300 bg-blue-500/20";
        else if (data >= 1400)
          style = "border-cyan-400 text-cyan-300 bg-cyan-500/20";
        else if (data >= 1200)
          style = "border-emerald-400 text-emerald-300 bg-emerald-500/20";
        else if (data > 0)
          style = "border-zinc-400 text-zinc-300 bg-zinc-500/20";
        break;
      case "leetcode":
        if (data >= 2100)
          style = "border-rose-400 text-rose-300 bg-rose-500/20";
        else if (data >= 1900)
          style = "border-amber-400 text-amber-300 bg-amber-500/20";
        else if (data >= 1700)
          style = "border-yellow-400 text-yellow-300 bg-yellow-500/20";
        else if (data >= 1500)
          style = "border-violet-400 text-violet-300 bg-violet-500/20";
        else if (data > 0)
          style = "border-emerald-400 text-emerald-300 bg-emerald-500/20";
        else style = "border-zinc-400 text-zinc-300 bg-zinc-500/20";
        break;
      case "codechef":
        if (data >= 2500)
          style = "border-rose-400 text-rose-300 bg-rose-500/20";
        else if (data >= 2200)
          style = "border-amber-400 text-amber-300 bg-amber-500/20";
        else if (data >= 2000)
          style = "border-yellow-400 text-yellow-300 bg-yellow-500/20";
        else if (data >= 1800)
          style = "border-violet-400 text-violet-300 bg-violet-500/20";
        else if (data >= 1600)
          style = "border-cyan-400 text-cyan-300 bg-cyan-500/20";
        else if (data >= 1400)
          style = "border-emerald-400 text-emerald-300 bg-emerald-500/20";
        else style = "border-zinc-400 text-zinc-300 bg-zinc-500/20";
        break;
      default:
        style = "border-gray-400 text-gray-300 bg-gray-500/20";
        break;
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

    const data = row.original.sortingKey;

    switch (row.original.platform) {
      case "codeforces":
        if (data >= 2100) color = "bg-yellow-500";
        else if (data >= 1900) color = "bg-violet-500";
        else if (data >= 1600) color = "bg-blue-500";
        else if (data >= 1400) color = "bg-cyan-500";
        else if (data >= 1200) color = "bg-emerald-500";
        else if (data > 0) color = "bg-zinc-500";
        break;
      case "leetcode":
        if (data >= 2100) color = "bg-rose-500";
        else if (data >= 1900) color = "bg-amber-500";
        else if (data >= 1700) color = "bg-yellow-500";
        else if (data >= 1500) color = "bg-violet-500";
        else if (data > 0) color = "bg-emerald-500";
        else color = "bg-zinc-500";
        break;
      case "codechef":
        if (data >= 2500) color = "bg-rose-500";
        else if (data >= 2200) color = "bg-amber-500";
        else if (data >= 2000) color = "bg-yellow-500";
        else if (data >= 1800) color = "bg-violet-500";
        else if (data >= 1600) color = "bg-cyan-500";
        else if (data >= 1400) color = "bg-emerald-500";
        else color = "bg-zinc-500";
        break;
      default:
        color = "bg-gray-500";
        break;
    }

    return color ? (
      <div className={`h-6 w-2 rounded-full ${color} shadow-lg`}></div>
    ) : null;
  };

  // Get the current ranking scheme from URL parameters
  const rankingScheme = searchParams.get("rankingScheme") || "filtered";
  const isNexusRanking = rankingScheme === "nexus";

  return (
    <div className="mb-16 overflow-x-auto px-10">
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
                    column.id === "tableRank" && !isNexusRanking
                      ? {}
                      : {
                          ...column.getSortByToggleProps(),
                          onClick: () => {
                            const params = new URLSearchParams(searchParams);
                            // Set sortBy to the column's ID (field name)
                            params.set("sortBy", column.id);
                            // Toggle sort order if already sorted by this column
                            if (params.get("sortBy") === column.id) {
                              params.set(
                                "sortOrder",
                                params.get("sortOrder") === "asc"
                                  ? "desc"
                                  : "asc",
                              );
                            } else {
                              // Default to descending order when sorting by a new column
                              params.set("sortOrder", "desc");
                            }
                            params.set("page", "1"); // Reset to first page when sorting
                            setSearchParams(params);
                          },
                        },
                  )}
                  key={column.id}
                  className="cursor-pointer whitespace-nowrap p-2 sm:p-4"
                >
                  {column.id === "tableRank" && !isNexusRanking
                    ? `#${column.render("Header")}`
                    : column.render("Header")}
                  {(column.id !== "tableRank" || isNexusRanking) && (
                    <span>
                      {searchParams.get("sortBy") === column.id
                        ? searchParams.get("sortOrder") === "desc"
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
                        row.original.platform === "codeforces") ||
                      (cell.column.id === "rating" &&
                        (row.original.platform === "leetcode" ||
                          row.original.platform === "codechef")) ? (
                      getRatingButtonStyle(row, cell.value)
                    ) : cell.column.id === "tableRank" ||
                      cell.column.id === "nexusRank" ? (
                      cell.value
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
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set("page", "1");
              setSearchParams(params);
            }}
            disabled={currentPage === 1}
            className="disabled:bg-gray-700 disabled:text-gray-500 rounded-md bg-blue-600 px-3 py-2 transition-colors hover:bg-blue-700"
          >
            {"<<"}
          </button>
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set("page", (currentPage - 1).toString());
              setSearchParams(params);
            }}
            disabled={currentPage === 1}
            className="disabled:bg-gray-700 disabled:text-gray-500 rounded-md bg-blue-600 px-3 py-2 transition-colors hover:bg-blue-700"
          >
            {"<"}
          </button>
          <span className="mx-2">
            Page <strong>{currentPage}</strong>
          </span>
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set("page", (currentPage + 1).toString());
              setSearchParams(params);
            }}
            disabled={data.length < currentPageSize}
            className="disabled:bg-gray-700 disabled:text-gray-500 rounded-md bg-blue-600 px-3 py-2 transition-colors hover:bg-blue-700"
          >
            {">"}
          </button>
        </div>

        <div className="bg-gray-800 flex items-center gap-2 rounded-lg p-3">
          <span>Show</span>
          <select
            value={currentPageSize}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              params.set("limit", e.target.value);
              params.set("page", "1"); // Reset to first page when changing page size
              setSearchParams(params);
            }}
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
