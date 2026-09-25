import { createLazyFileRoute } from "@tanstack/react-router";
import React, {
  useState,
  useMemo,
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
} from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Download,
  Filter,
  X,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  CalendarSearch,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useFetchMemberCodes,
  type MemberRecord,
} from "@/features/dashboard/hooks/useFetchMemberCodes";
import { useFetchAllEvents } from "@/features/dashboard/hooks/useFetchEvents"; // adjust path to match your project

export const Route = createLazyFileRoute("/dashboard/codes")({
  component: ViewPayment,
});

// --- Static config -----------------------------------------------------
// None of this depends on props or state, so it's defined once at module
// scope instead of being rebuilt (render closures included) on every render.

type ColumnKey = "id" | "userName" | "code" | "status";

const STATUS_STYLES: Record<MemberRecord["status"], string> = {
  Used: "bg-green-100 text-green-700",
  "Not Used": "bg-yellow-100 text-yellow-700",
};

const ALL_COLUMNS: Array<{
  key: ColumnKey;
  label: string;
  sortable: boolean;
  width?: string;
  render: (value: any, row: MemberRecord, index: number) => React.ReactNode;
}> = [
  {
    key: "id",
    label: "ID",
    sortable: false, // it's just row position — sorting it is meaningless
    width: "70px",
    render: (_value, _row, index) => (
      <div className="font-[400] text-gray-900">{index + 1}</div>
    ),
  },
  {
    key: "userName",
    label: "Full Name",
    sortable: true,
    render: (value) => <div className="font-[400] text-gray-900">{value}</div>,
  },
  {
    key: "code",
    label: "Payment Code",
    sortable: true,
    render: (value) => <div className="text-gray-700 text-[15px]">{value}</div>,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value: MemberRecord["status"]) => (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[value]}`}
      >
        {value}
      </span>
    ),
  },
];

const DEFAULT_VISIBLE_COLUMNS: Record<ColumnKey, boolean> = {
  id: true,
  userName: true,
  code: true,
  status: true,
};

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

function csvEscape(value: unknown): string {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

// -------------------------------------------------------------------------

function ViewPayment() {
  // The event is now a user choice, not something read off the logged-in
  // user — this is local state driven entirely by the dropdown below.
  const [eventId, setEventId] = useState("");

  const {
    data: events,
    isLoading: eventsLoading,
    isError: eventsError,
  } = useFetchAllEvents();

  const { data, isLoading, isFetching, isError, error, refetch } =
    useFetchMemberCodes(eventId);

  // FIX: `data` here isn't guaranteed to be a flat array — depending on how
  // useFetchMemberCodes's `select` normalizes the response, it may come
  // back wrapped as `{ codes: [...], type: '...' }` (the same shape
  // useFetchAllEvents returns for events, i.e. `{ events: [...], type }`).
  // Treating that wrapper object as `rows` is what caused
  // `sortedData.slice is not a function` — an object was flowing all the
  // way through filteredData/sortedData untouched (empty search + no sort
  // applied means both just pass the value through) until `.slice()`
  // finally choked on it. Normalizing once, right here, means nothing
  // downstream has to guard against it again.
  const rows: MemberRecord[] = Array.isArray(data)
    ? data
    : ((data as any)?.codes ?? []);

  const hasEvent = eventId !== "";

  const [searchTerm, setSearchTerm] = useState("");
  // Typing filters a potentially large table on every keystroke. Deferring
  // the value used for the actual filter/sort work keeps the input itself
  // feeling instant even while the table catches up.
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const [sortConfig, setSortConfig] = useState<{
    key: ColumnKey | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE_COLUMNS);

  const columnSelectorRef = useRef<HTMLDivElement>(null);

  // Switching events means the old search/sort/page no longer makes sense
  // against the new dataset — reset the table's local state each time.
  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm("");
    setSortConfig({ key: null, direction: "asc" });
  }, [eventId]);

  // Close the column-selector dropdown on outside click.
  useEffect(() => {
    if (!showColumnSelector) return;
    const onClick = (e: MouseEvent) => {
      if (
        columnSelectorRef.current &&
        !columnSelectorRef.current.contains(e.target as Node)
      ) {
        setShowColumnSelector(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showColumnSelector]);

  const columns = useMemo(
    () => ALL_COLUMNS.filter((col) => visibleColumns[col.key]),
    [visibleColumns],
  );

  const toggleColumn = useCallback((columnKey: ColumnKey) => {
    setVisibleColumns((prev) => ({ ...prev, [columnKey]: !prev[columnKey] }));
  }, []);

  const filteredData = useMemo(() => {
    if (rows.length === 0) return [];
    if (!deferredSearchTerm) return rows;
    const term = deferredSearchTerm.toLowerCase();
    return rows.filter((row: any) =>
      ALL_COLUMNS.some((column) => {
        const value = (row as any)[column.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(term);
      }),
    );
  }, [rows, deferredSearchTerm]);

  const sortedData = useMemo(() => {
    if (filteredData.length === 0 || !sortConfig.key) return filteredData;
    const key = sortConfig.key;
    const dir = sortConfig.direction === "asc" ? 1 : -1;

    return [...filteredData].sort((a, b) => {
      const aValue = (a as any)[key];
      const bValue = (b as any)[key];
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      if (typeof aValue === "string") return aValue.localeCompare(bValue) * dir;
      if (aValue < bValue) return -1 * dir;
      if (aValue > bValue) return 1 * dir;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));

  // If a search/filter shrinks the result set out from under the current
  // page, snap back instead of rendering a "stuck" empty page.
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const startIndex =
    sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, sortedData.length);

  const handleSort = useCallback((key: ColumnKey) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    );
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    },
    [totalPages],
  );

  const handlePageSizeChange = useCallback((newSize: string) => {
    setPageSize(Number(newSize));
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleCopyCode = useCallback(async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy payment code");
    }
  }, []);

  const handleExport = useCallback(() => {
    const headers = columns.map((col) => col.label).join(",");
    const body = sortedData
      .map((row: any) =>
        columns.map((col) => csvEscape((row as any)[col.key])).join(","),
      )
      .join("\n");

    const blob = new Blob([`${headers}\n${body}`], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payment_data_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [columns, sortedData]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Data refreshed successfully!");
    } catch (err) {
      console.error("Failed to refresh data:", err);
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const getSortIcon = (columnKey: ColumnKey) => {
    if (sortConfig.key !== columnKey)
      return <ChevronsUpDown className="w-4 h-4" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="w-full lg:p-6 py-4 bg-gray-50 font-inter">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="lg:px-6 px-4 py-4 border-b border-gray-200">
          <div className="lg:flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Payment Data
              </h2>
              <p className="text-[15px] text-gray-500 mt-1">
                Select an event, then view and manage its payment records
              </p>
            </div>

            <div className="flex items-center lg:justify-between lg:gap-5 gap-3 lg:mt-0 mt-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading || !hasEvent}
                className="flex items-center gap-2 lg:px-4 lg:py-2 px-[25px] py-[7px] text-white rounded-sm hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#091e54" }}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <p className="lg:flex hidden">
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </p>
              </button>
              <button
                onClick={handleExport}
                disabled={sortedData.length === 0}
                className="flex items-center gap-2 lg:px-4 lg:py-2 px-[25px] py-[7px] text-white rounded-sm hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#091e54" }}
              >
                <Download className="w-4 h-4" />
                <p className="lg:flex hidden">Export CSV</p>
              </button>
            </div>
          </div>
        </div>

        {/* Event picker — the gate for everything below */}
        <div className="lg:px-6 px-4 py-4 border-b border-gray-200">
          <label className="block text-[15px] font-medium text-gray-700 mb-2">
            Event
          </label>
          <div className="relative max-w-md">
            <CalendarSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              disabled={eventsLoading}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50"
              style={{ "--tw-ring-color": "#091e54" } as React.CSSProperties}
            >
              <option value="">
                {eventsLoading ? "Loading events…" : "Select an event"}
              </option>
              {events?.events?.map((ev: any) => (
                <option key={ev._id} value={ev._id}>
                  {ev.eventTitle}
                </option>
              ))}
            </select>
          </div>
          {eventsError && (
            <p className="mt-2 text-sm text-red-500">
              Couldn't load the list of events. Try refreshing the page.
            </p>
          )}
        </div>

        {!hasEvent ? (
          /* Nothing selected yet — don't show a loading table or "no results",
             just tell the person what to do next. */
          <div className="px-6 py-16 text-center text-gray-500">
            <div className="flex flex-col items-center gap-2">
              <CalendarSearch className="w-12 h-12 text-gray-300" />
              <p className="text-lg font-medium">No event selected</p>
              <p className="text-[15px]">
                Choose an event above to view its payment codes
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Filters and Search */}
            <div className="lg:px-6 px-4 py-4 border-b border-gray-200">
              <div className="lg:flex grid flex-wrap items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={
                      { "--tw-ring-color": "#091e54" } as React.CSSProperties
                    }
                  />
                  {searchTerm && (
                    <button
                      onClick={() => handleSearch("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="relative" ref={columnSelectorRef}>
                  <button
                    onClick={() => setShowColumnSelector((v) => !v)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Columns
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showColumnSelector && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <div className="p-2">
                        <div className="px-3 py-2 text-[15px] font-medium text-gray-700 border-b border-gray-200">
                          Show/Hide Columns
                        </div>
                        {ALL_COLUMNS.map((column) => (
                          <label
                            key={column.key}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded-md"
                          >
                            <input
                              type="checkbox"
                              checked={visibleColumns[column.key]}
                              onChange={() => toggleColumn(column.key)}
                              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                              style={{ accentColor: "#091e54" }}
                            />
                            <div className="flex items-center gap-2 flex-1">
                              {visibleColumns[column.key] ? (
                                <Eye className="w-4 h-4 text-gray-400" />
                              ) : (
                                <EyeOff className="w-4 h-4 text-gray-400" />
                              )}
                              <span className="text-[15px] text-gray-700">
                                {column.label}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[15px] text-gray-600">Show:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={
                      { "--tw-ring-color": "#091e54" } as React.CSSProperties
                    }
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto relative">
              {isFetching && !isLoading && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#091e54]/20 overflow-hidden">
                  <div className="h-full w-1/3 bg-[#091e54] animate-pulse" />
                </div>
              )}
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                        style={{ width: column.width }}
                      >
                        <div
                          className={`flex items-center gap-2 ${column.sortable ? "cursor-pointer select-none" : ""}`}
                          onClick={() =>
                            column.sortable && handleSort(column.key)
                          }
                        >
                          {column.label}
                          {column.sortable && (
                            <span className="text-gray-400">
                              {getSortIcon(column.key)}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    Array.from({ length: pageSize }).map((_, i) => (
                      <tr key={`skeleton-${i}`}>
                        {columns.map((col) => (
                          <td key={col.key} className="px-6 py-4">
                            <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                          </td>
                        ))}
                        <td className="px-6 py-4">
                          <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : isError ? (
                    <tr>
                      <td
                        colSpan={columns.length + 1}
                        className="px-6 py-12 text-center text-red-500"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="w-10 h-10" />
                          <p className="text-lg font-medium">
                            Couldn't load payment data
                          </p>
                          <p className="text-[15px] text-gray-500">
                            {(error as any)?.message ??
                              "Something went wrong. Please try refreshing."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length + 1}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Filter className="w-12 h-12 text-gray-300" />
                          <p className="text-lg font-medium">
                            No results found
                          </p>
                          <p className="text-[15px]">
                            Try adjusting your search or filters
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((row: any, rowIndex: number) => {
                      const globalIndex =
                        (currentPage - 1) * pageSize + rowIndex;
                      return (
                        <tr
                          key={row._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {columns.map((column) => (
                            <td
                              key={column.key}
                              className="px-6 py-4 whitespace-nowrap"
                            >
                              {column.render(
                                (row as any)[column.key],
                                row,
                                globalIndex,
                              )}
                            </td>
                          ))}KW
                          <td className="px-6 py-4 whitespace-nowrap">
                          {row.stauts === "Not Used" ?
                        (
                            <button
                              className={`flex items-center gap-2 px-3 py-1 text-[15px] text-white rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer`}
                              style={{
                                backgroundColor:
                                  copiedId === row._id ? "#10b981" : "#091e54",
                              }}
                              onClick={() => handleCopyCode(row.code, row._id)}
                              title="Copy Payment Code"
                            >
                              {copiedId === row._id ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  Copy Code
                                </>
                              )}
                            </button>
                        )  : ("")
                        }
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="lg:px-6 px-4 py-4 border-t border-gray-200">
              <div className="lg:flex grid items-center justify-between gap-4">
                <div className="text-[15px] text-gray-600">
                  Showing <span className="font-medium">{startIndex}</span> to{" "}
                  <span className="font-medium">{endIndex}</span> of{" "}
                  <span className="font-medium">{sortedData.length}</span>{" "}
                  results
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 px-4">
                    <span className="text-[15px] text-gray-600">Page</span>
                    <input
                      type="number"
                      value={currentPage}
                      onChange={(e) => handlePageChange(Number(e.target.value))}
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={
                        {
                          "--tw-ring-color": "#091e54",
                        } as React.CSSProperties
                      }
                      min={1}
                      max={totalPages}
                    />
                    <span className="text-[15px] text-gray-600">
                      of {totalPages}
                    </span>
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
