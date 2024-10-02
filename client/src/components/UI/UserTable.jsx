import React, { useState, useEffect } from "react";
import axios from "axios";

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState("fullName");
    const [sortOrder, setSortOrder] = useState("asc");
    const token = localStorage.getItem('token')
    
    const fetchUsers = async (page, sortField, sortOrder) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/get/all`, {
                params: {
                    page,
                    sortBy: sortField,
                    order: sortOrder,
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Attach token to Authorization header
                },

            });
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    useEffect(() => {
        fetchUsers(page, sortField, sortOrder);
    }, [page, sortField, sortOrder]);

    const handleSort = (field) => {
        const order = sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);
    };

    return (
        <div className="p-5 bg-slate-900 text-white min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center">User Information</h1>

            <table className="w-full table-auto bg-slate-800 shadow-lg rounded-lg">
                <thead>
                    <tr className="text-left bg-blue-900 text-white">
                        <th className="p-3" onClick={() => handleSort("fullName")}>
                            Full Name {sortField === "fullName" && (sortOrder === "asc" ? "▲" : "▼")}
                        </th>
                        <th className="p-3" onClick={() => handleSort("admissionNumber")}>
                            Admission Number {sortField === "admissionNumber" && (sortOrder === "asc" ? "▲" : "▼")}
                        </th>
                        <th className="p-3" onClick={() => handleSort("branch")}>
                            Branch {sortField === "branch" && (sortOrder === "asc" ? "▲" : "▼")}
                        </th>
                        <th className="p-3">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.admissionNumber} className="bg-slate-700 hover:bg-slate-600">
                            <td className="p-3">{user.fullName}</td>
                            <td className="p-3">{user.admissionNumber}</td>
                            <td className="p-3">{user.branch}</td>
                            <td className="p-3">{user.personalEmail}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 flex justify-between items-center">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="bg-blue-700 text-white px-3 py-2 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="bg-blue-700 text-white px-3 py-2 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserTable;
