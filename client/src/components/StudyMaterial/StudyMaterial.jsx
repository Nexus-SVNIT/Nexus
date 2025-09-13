import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import MaintenancePage from '../Error/MaintenancePage';
import HeadTags from "../HeadTags/HeadTags";
import { useNavigate } from "react-router-dom";

const StudyMaterial = () => {
    const navigate = useNavigate();
    const departments = ['CSE','AI'];
    return (
        <div className="min-h-screen py-6 px-4">
            <HeadTags
                title="Study Materials | Nexus - NIT Surat"
                description="Browse through study materials for academic subjects, curated by Nexus Members."
                keywords={"Nexus NIT Surat, Study Material, Materials, PYQ, Previous Year Questions, Notes, SVNIT Surat, NIT Surat, CSE, AI, Presentation, PPT"}
            />
            <div className="bg-gray-900 text-white p-2 md:p-8 rounded-md shadow-md max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-center">Study Materials</h1>
                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    {departments.map((dept) => (
                        <div className="bg-gray-800 border border-blue-500 p-8 rounded-lg shadow-lg transition-transform transform hover:scale-[1.01]" onClick={() => {navigate(`${dept.toLowerCase()}`)}}>
                            <p>{dept}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StudyMaterial;