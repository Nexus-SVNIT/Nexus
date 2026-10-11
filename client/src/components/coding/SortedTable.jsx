import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { useSearchParams } from "react-router-dom";

const SortableTable = ({ columns, data, searchParams, setSearchParams, totalProfiles, activePlatform }) => {
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
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-white/[0.06] text-zinc-300 border border-white/10 font-mono">
          #{num}
        </span>
      );
    }
    return <span className="text-zinc-500 font-mono text-xs">#{val}</span>;
  };

  return (
    <div className="mb-8 w-full overflow-hidden rounded-xl border border-white/[0.07] bg-indigo-950/20 backdrop-blur-xl shadow-2xl">
      {/* Mobile Card Layout (< 768px) */}
      <div className="block md:hidden">
        {page.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-sm font-medium">
            No profiles match your current search or filters.
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {page.map((row, i) => {
              prepareRow(row);
              const key = row.id || i;
              const rankVal = Number(row.values?.tableRank || row.values?.nexusRank || row.original?.tableRank || row.original?.nexusRank);
              
              return (
                <div key={key} className="rounded-lg border border-white/[0.1] bg-white/[0.02] p-4">
                  {/* Rank and Name */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getRatingBarStyle(row)}
                      <div>
                        <div className="font-medium text-zinc-200 text-sm">{row.original.fullName}</div>
                        <div className="text-xs text-zinc-400">{row.original.admissionNo}</div>
                      </div>
                    </div>
                    {renderRankBadge(rankVal)}
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {activePlatform === "codeforces" && (
                      <>
                        <div>
                          <span className="text-zinc-400">Max Rating:</span>
                          <div className="mt-1">{getRatingButtonStyle(row, row.original.maxRating)}</div>
                        </div>
                        <div>
                          <span className="text-zinc-400">Current:</span>
                          <div className="mt-1 text-zinc-200">{row.original.rating}</div>
                        </div>
                        <div>
                          <span className="text-zinc-400">Rank:</span>
                          <div className="mt-1 text-zinc-200 capitalize">{row.original.rank}</div>
                        </div>
                        <div>
                          <a
                            href={`https://codeforces.com/profile/${row.original.profileId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline hover:text-blue-300 text-xs"
                          >
                            View Profile
                          </a>
                        </div>
                      </>
                    )}
                    
                    {activePlatform === "leetcode" && (
                      <>
                        <div>
                          <span className="text-zinc-400">Rating:</span>
                          <div className="mt-1">{getRatingButtonStyle(row, row.original.rating)}</div>
                        </div>
                        <div>
                          <span className="text-zinc-400">Solved:</span>
                          <div className="mt-1 text-zinc-200">{row.original.totalSolved}</div>
                        </div>
                        <div>
                          <span className="text-zinc-400">Global Rank:</span>
                          <div className="mt-1 text-zinc-200">{row.original.globalRanking}</div>
                        </div>
                        <div>
                          <a
                            href={`https://leetcode.com/${row.original.profileId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline hover:text-blue-300 text-xs"
                          >
                            View Profile
                          </a>
                        </div>
                      </>
                    )}
                    
                    {activePlatform === "codechef" && (
                      <>
                        <div>
                          <span className="text-zinc-400">Rating:</span>
                          <div className="mt-1">{getRatingButtonStyle(row, row.original.rating)}</div>
                        </div>
                        <div>
                          <span className="text-zinc-400">Stars:</span>
                          <div className="mt-1 text-zinc-200">{row.original.rating_number}</div>
                        </div>
                        <div>
                          <span className="text-zinc-400">Global Rank:</span>
                          <div className="mt-1 text-zinc-200">{row.original.globalRank}</div>
                        </div>
                        <div>
                          <a
                            href={`https://www.codechef.com/users/${row.original.profileId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline hover:text-blue-300 text-xs"
                          >
                            View Profile
                          </a>
                        </div>
                      </>
                    )}
                    
                    {activePlatform === "github" && (
                      <>
                        <div>
                          <span className="text-zinc-400">Contributions:</span>
                          <div className="mt-1">{getRatingButtonStyle(row, row.original.totalContributions)}</div>
                        </div>
                        <div>
                          <span className="text-zinc-400">Repos:</span>
                          <div className="mt-1 text-zinc-200">{row.original.publicRepos}</div>
                        </div>
                        <div>
                          <span className="text-zinc-400">Stars:</span>
                          <div className="mt-1 text-zinc-200">{row.original.stars} ⭐</div>
                        </div>
                        <div>
                          <a
                            href={`https://github.com/${row.original.profileId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline hover:text-blue-300 text-xs"
                          >
                            @{row.original.profileId}
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Table Layout (>= 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table
          {...getTableProps()}
          className="min-w-full text-left text-sm text-zinc-300 border-collapse"
        >
          <thead className="bg-indigo-950/30 text-[0.7rem] uppercase tracking-widest text-zinc-400 border-b border-white/[0.06] font-semibold backdrop-blur-sm">
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
                    className="cursor-pointer whitespace-nowrap p-2 sm:p-3 md:p-4 text-xs sm:text-sm"
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
                    className={`hover:bg-white/[0.04] transition-colors border-b border-white/[0.05] last:border-0 ${rowHighlight}`}
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        key={cell.column.id}
                        className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm"
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
      </div>

      {/* Refined Minimalist Pagination */}
      <div className="bg-indigo-950/20 border-t border-white/[0.06] px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex flex-col items-center justify-between gap-3 sm:gap-4 md:flex-row">
        <div className="flex flex-wrap items-center gap-1 justify-center md:justify-start">
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set("page", "1");
              setSearchParams(params);
            }}
            disabled={currentPage === 1}
            className="flex items-center justify-center rounded px-2 sm:px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 transition-colors hover:bg-white/[0.08] hover:text-white disabled:pointer-events-none disabled:opacity-30"
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
            className="flex items-center justify-center rounded px-2 sm:px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 transition-colors hover:bg-white/[0.08] hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            Prev
          </button>
          
          <div className="flex items-center justify-center px-2 sm:px-3 md:px-4 py-1 text-xs font-medium text-zinc-400 mx-1 border border-white/10 rounded-md bg-white/[0.04]">
            <span className="hidden sm:inline">Page </span>
            <strong className="text-white mx-1">{currentPage}</strong>
            <span className="hidden sm:inline"> of </span>
            <span className="sm:hidden">/</span>
            <strong className="text-white mx-1">{Math.ceil(actualTotal / currentPageSize) || 1}</strong>
          </div>

          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set("page", (currentPage + 1).toString());
              setSearchParams(params);
            }}
            disabled={currentPage >= Math.ceil(actualTotal / currentPageSize)}
            className="flex items-center justify-center rounded px-2 sm:px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 transition-colors hover:bg-white/[0.08] hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
          <span className="hidden sm:inline">Show</span>
          <select
            value={currentPageSize}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              params.set("limit", e.target.value);
              params.set("page", "1"); // Reset to first page when changing page size
              setSearchParams(params);
            }}
            className="appearance-none rounded border border-white/10 bg-white/[0.06] px-2 py-1 text-zinc-300 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-colors outline-none cursor-pointer text-center min-w-[3rem]"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size} className="bg-[#0d1230] text-center">
                {size}
              </option>
            ))}
          </select>
          <span className="hidden sm:inline">entries</span>
        </div>
      </div>
    </div>
  );
};

export default SortableTable;
