import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState("fullName");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFields, setSelectedFields] = useState({
        fullName: true,
        admissionNumber: true,
        branch: true,
        mobileNumber: true,
        instituteEmail: false,
        personalEmail: false,
        linkedInProfile: false,
        githubProfile: false,
        leetcodeProfile: false,
        codeforcesProfile: false,
        codechefProfile: false,
    });
    const [branchFilter, setBranchFilter] = useState('all');
    const [yearFilter, setYearFilter] = useState('all');
    const token = localStorage.getItem('core-token');

    const fetchUsers = async (page, sortField, sortOrder, search = searchQuery) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/get/all`, {
                params: {
                    page,
                    sortBy: sortField,
                    order: sortOrder,
                    search,
                    branch: branchFilter,
                    year: yearFilter,
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    useEffect(() => {
        fetchUsers(page, sortField, sortOrder, searchQuery);
    }, [page, sortField, sortOrder, searchQuery, branchFilter, yearFilter]);

    const handleSort = (field) => {
        const order = sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);
    };

    const handleCheckboxChange = (field) => {
        setSelectedFields(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const branchOptions = [
        { value: 'all', label: 'All Branches' },
        { value: 'CS', label: 'Computer Science' },
        { value: 'AI', label: 'Artificial Intelligence' },
        // Add more branches as needed
    ];

    const extractYear = (admissionNumber) => {
        const match = admissionNumber.match(/[UI](\d{2})/);
        return match ? `20${match[1]}` : null;
    };

    const uniqueYears = [...new Set(users
        .map(user => extractYear(user.admissionNumber))
        .filter(Boolean)
    )].sort((a, b) => b - a);

    const filteredUsers = users;

    const downloadCurrentPageExcel = () => {
        const exportData = filteredUsers.map(user => {
            const row = {};
            Object.keys(selectedFields).forEach(field => {
                if (selectedFields[field]) {
                    row[field] = user[field] || "N/A";
                }
            });
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Current_Page_Users");
        XLSX.writeFile(workbook, `users_data_page_${page}.xlsx`);
    };

    const downloadAllUsersExcel = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/get/all`, {
                params: {
                    page: 1,
                    limit: 1000000, // Large number to get all users
                    sortBy: sortField,
                    order: sortOrder,
                    search: searchQuery,
                    branch: branchFilter,
                    year: yearFilter,
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const allUsers = response.data.users;
            const exportData = allUsers.map(user => {
                const row = {};
                Object.keys(selectedFields).forEach(field => {
                    if (selectedFields[field]) {
                        row[field] = user[field] || "N/A";
                    }
                });
                return row;
            });

            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "All_Users");
            XLSX.writeFile(workbook, "all_users_data.xlsx");
        } catch (error) {
            console.error("Error downloading all users", error);
        }
    };

    return (
        <div className="p-2 sm:p-4 lg:p-5 bg-slate-800 text-white min-h-screen overflow-scroll">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-center">
                User Information ({filteredUsers.length})
            </h1>

            {/* Search, Filter, and Download Section */}
            <div className="mb-4 space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:gap-4 flex-wrap">
                {/* Search input */}
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-auto rounded-md border p-2 text-black flex-grow max-w-md"
                />

                {/* Branch Filter */}
                <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="w-full sm:w-auto rounded-md border p-2 text-black"
                >
                    {branchOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Year Filter */}
                <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full sm:w-auto rounded-md border p-2 text-black"
                >
                    <option value="all">All Years</option>
                    {uniqueYears.map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                {/* Buttons */}
                <div className="flex gap-2 justify-end sm:justify-start flex-wrap">
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            setBranchFilter("all");
                            setYearFilter("all");
                        }}
                        className="flex-1 sm:flex-none rounded-md bg-slate-700 hover:bg-slate-600 px-3 sm:px-4 py-2 text-white transition-colors"
                    >
                        Clear Filters
                    </button>
                    <button
                        onClick={downloadCurrentPageExcel}
                        className="flex-1 sm:flex-none rounded-md bg-green-700 hover:bg-green-600 px-3 sm:px-4 py-2 text-white transition-colors"
                    >
                        Download Current Page
                    </button>
                    <button
                        onClick={downloadAllUsersExcel}
                        className="flex-1 sm:flex-none rounded-md bg-blue-700 hover:bg-blue-600 px-3 sm:px-4 py-2 text-white transition-colors"
                    >
                        Download All Data
                    </button>
                </div>
            </div>

            {/* Checkbox Section */}
            <div className="mb-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {Object.keys(selectedFields).map((field) => (
                    <label key={field} className="flex items-center space-x-2 text-xs sm:text-sm p-1">
                        <input
                            type="checkbox"
                            checked={selectedFields[field]}
                            onChange={() => handleCheckboxChange(field)}
                            className="rounded border-slate-400"
                        />
                        <span className="truncate">{field}</span>
                    </label>
                ))}
            </div>

            {/* Table Container */}
            <div className="relative rounded-lg border border-slate-700 shadow-xl">
                <div className="w-full overflow-x-auto">
                    <div className="max-h-[60vh] overflow-y-auto">
                        <table className="w-full table-auto">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-slate-800 text-left">
                                    {Object.keys(selectedFields).map(field => 
                                        selectedFields[field] && (
                                            <th 
                                                key={field} 
                                                className="p-2 sm:p-3 font-semibold whitespace-nowrap text-xs sm:text-sm min-w-[120px] sm:min-w-[150px] cursor-pointer hover:bg-slate-700 transition-colors"
                                                onClick={() => handleSort(field)}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>{field}</span>
                                                    <span>{sortField === field && (sortOrder === "asc" ? "↑" : "↓")}</span>
                                                </div>
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {filteredUsers.map((user) => (
                                    <tr key={user.admissionNumber} className="bg-slate-900 hover:bg-slate-800 transition-colors">
                                        {Object.keys(selectedFields).map(field => 
                                            selectedFields[field] && (
                                                <td key={field} className="p-2 sm:p-3 whitespace-nowrap text-xs sm:text-sm">
                                                    {user[field] || "N/A"}
                                                </td>
                                            )
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination Section */}
            <div className="mt-4 flex flex-col xs:flex-row justify-between items-center gap-2 sm:gap-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="w-full xs:w-auto bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white px-3 sm:px-4 py-2 rounded text-sm transition-colors"
                >
                    Previous
                </button>
                <span className="text-slate-300 text-sm">
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="w-full xs:w-auto bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white px-3 sm:px-4 py-2 rounded text-sm transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserTable;
