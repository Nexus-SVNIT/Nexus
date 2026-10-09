import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { useSearchParams } from "react-router-dom";

const SortableTable = ({ columns, data, searchParams, setSearchParams, totalProfiles }) => {
  const actualTotal = totalProfiles || data.length;
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
      pageCount: Math.ceil(actualTotal / currentPageSize),
    },
    useSortBy,
    usePagination,
  );

  const getRatingButtonStyle = (row, value) => {
    let style = "";
   
    const data = typeof value === "number" ? value : Number(value) || 0;

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
        else
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
      case "github":
        if (data >= 1000)
          style = "border-emerald-400 text-emerald-300 bg-emerald-500/20 font-bold shadow-[0_0_12px_rgba(52,211,153,0.3)]";
        else if (data >= 500)
          style = "border-green-400 text-green-300 bg-green-500/20 font-semibold";
        else if (data >= 250)
          style = "border-teal-400 text-teal-300 bg-teal-500/20";
        else if (data >= 100)
          style = "border-cyan-400 text-cyan-300 bg-cyan-500/20";
        else if (data > 0)
          style = "border-zinc-400 text-zinc-300 bg-zinc-500/20";
        else style = "border-zinc-600 text-zinc-400 bg-zinc-700/20";
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
      case "github":
        if (data >= 1000) color = "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]";
        else if (data >= 500) color = "bg-green-500";
        else if (data >= 250) color = "bg-teal-500";
        else if (data >= 100) color = "bg-cyan-500";
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

  const renderRankBadge = (val) => {
    const num = Number(val);
    if (num === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
          🥇 1
        </span>
      );
    }
    if (num === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-300/20 text-slate-200 border border-slate-300/40">
          🥈 2
        </span>
      );
    }
    if (num === 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-700/20 text-amber-400 border border-amber-700/40">
          🥉 3
        </span>
      );
    }
    if (num > 3 && num <= 10) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700/60 font-mono">
          #{num}
        </span>
      );
    }
    return <span className="text-zinc-500 font-mono text-xs">#{val}</span>;
  };

  return (
    <div className="mb-8 w-full overflow-x-auto overflow-y-hidden rounded-xl border border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-md shadow-2xl">
      <table
        {...getTableProps()}
        className="min-w-full text-left text-sm text-zinc-300 border-collapse"
      >
        <thead className="bg-[#09090b]/90 text-[0.7rem] uppercase tracking-widest text-zinc-400 border-b border-zinc-800/60 font-semibold backdrop-blur-sm">
          {headerGroups.map((headerGroup, idx) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id || idx}>
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
          {page.length === 0 ? (
            <tr>
              <td
                colSpan={headerGroups[0]?.headers?.length || 8}
                className="py-12 text-center text-zinc-500 text-sm font-medium"
              >
                No profiles match your current search or filters.
              </td>
            </tr>
          ) : (
            page.map((row, i) => {
              prepareRow(row);
              const key = row.id || i;
              const rankVal = Number(row.values?.tableRank || row.values?.nexusRank || row.original?.tableRank || row.original?.nexusRank);
              const rowHighlight =
                rankVal === 1
                  ? "bg-amber-500/[0.04] border-l-2 border-l-amber-400"
                  : rankVal === 2
                  ? "bg-slate-400/[0.03] border-l-2 border-l-slate-400"
                  : rankVal === 3
                  ? "bg-amber-700/[0.03] border-l-2 border-l-amber-600"
                  : "";

              return (
                <tr
                  {...row.getRowProps()}
                  key={key}
                  className={`hover:bg-zinc-900/60 transition-colors border-b border-zinc-800/40 last:border-0 ${rowHighlight}`}
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
                          <span className="font-medium text-zinc-200">{cell.value}</span>
                        </div>
                      ) : (cell.column.id === "maxRating" &&
                          row.original.platform === "codeforces") ||
                        (cell.column.id === "rating" &&
                          (row.original.platform === "leetcode" ||
                            row.original.platform === "codechef")) ||
                        (cell.column.id === "totalContributions" &&
                          row.original.platform === "github") ? (
                        getRatingButtonStyle(row, cell.value)
                      ) : cell.column.id === "tableRank" ||
                        cell.column.id === "nexusRank" ? (
                        renderRankBadge(cell.value)
                      ) : (
                        cell.render("Cell")
                      )}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Refined Minimalist Pagination */}
      <div className="bg-[#09090b] border-t border-zinc-800/60 px-6 py-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set("page", "1");
              setSearchParams(params);
            }}
            disabled={currentPage === 1}
            className="flex items-center justify-center rounded px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            First
          </button>
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set("page", (currentPage - 1).toString());
              setSearchParams(params);
            }}
            disabled={currentPage === 1}
            className="flex items-center justify-center rounded px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            Prev
          </button>
          
          <div className="flex items-center justify-center px-4 py-1 text-xs font-medium text-zinc-400 mx-1 border border-zinc-800 rounded-md">
            Page <strong className="text-white mx-1">{currentPage}</strong> of <strong className="text-white mx-1">{Math.ceil(actualTotal / currentPageSize) || 1}</strong>
          </div>

          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set("page", (currentPage + 1).toString());
              setSearchParams(params);
            }}
            disabled={currentPage >= Math.ceil(actualTotal / currentPageSize)}
            className="flex items-center justify-center rounded px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
          <span>Show</span>
          <select
            value={currentPageSize}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              params.set("limit", e.target.value);
              params.set("page", "1"); // Reset to first page when changing page size
              setSearchParams(params);
            }}
            className="appearance-none rounded border border-zinc-800 bg-[#09090b] px-2 py-1 text-zinc-300 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-colors outline-none cursor-pointer text-center"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size} className="bg-[#09090b] text-center">
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
