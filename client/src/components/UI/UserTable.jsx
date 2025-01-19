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
    const token = localStorage.getItem('core-token');

    const fetchUsers = async (page, sortField, sortOrder, search = searchQuery) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/get/all`, {
                params: {
                    page,
                    sortBy: sortField,
                    order: sortOrder,
                    search,
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
    }, [page, sortField, sortOrder, searchQuery]);

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

    const filteredUsers = users;

    const downloadExcel = () => {
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
        XLSX.writeFile(workbook, "users_data.xlsx");
    };

    return (
        <div className="p-4 lg:p-5 bg-slate-800 text-white min-h-screen">
            <h1 className="text-xl lg:text-2xl font-bold mb-6 text-center">User Information ({filteredUsers.length})</h1>

            {/* Search and Download Section - Made responsive */}
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-md border p-2 text-black flex-grow max-w-md"
                />
                <div className="flex gap-2">
                    <button
                        onClick={() => setSearchQuery("")}
                        className="rounded-md bg-slate-700 hover:bg-slate-600 px-4 py-2 text-white transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        onClick={downloadExcel}
                        className="rounded-md bg-slate-700 hover:bg-slate-600 px-4 py-2 text-white transition-colors"
                    >
                        Download Excel
                    </button>
                </div>
            </div>

            {/* Checkbox Section - Made responsive */}
            <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {Object.keys(selectedFields).map((field) => (
                    <label key={field} className="flex items-center space-x-2 text-sm">
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

            {/* Table Container - Fixed horizontal scroll */}
            <div className="relative">
                <div className="max-h-[60vh] overflow-auto rounded-lg border border-slate-700 shadow-xl">
                    <table className="w-full table-auto">
                        <thead className="sticky top-0">
                            <tr className="bg-slate-800 text-left">
                                {Object.keys(selectedFields).map(field => 
                                    selectedFields[field] && (
                                        <th 
                                            key={field} 
                                            className="p-3 font-semibold whitespace-nowrap min-w-[150px] cursor-pointer hover:bg-slate-700 transition-colors"
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
                                            <td key={field} className="p-3 whitespace-nowrap">
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

            {/* Pagination Section - Made responsive */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white px-4 py-2 rounded transition-colors"
                >
                    Previous
                </button>
                <span className="text-slate-300">
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white px-4 py-2 rounded transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserTable;
