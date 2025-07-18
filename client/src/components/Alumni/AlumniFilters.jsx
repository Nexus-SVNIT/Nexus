import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const Filters = ({ 
    showFilters, 
    batchFrom, 
    setBatchFrom, 
    batchTo, 
    setBatchTo, 
    company, 
    setCompany, 
    companies, 
    expertise, 
    setExpertise, 
    clearFilters,
    onApplyFilters,
    expertiseOptions
}) => {
    const [localBatchFrom, setLocalBatchFrom] = useState(batchFrom);
    const [localBatchTo, setLocalBatchTo] = useState(batchTo);
    const [localCompany, setLocalCompany] = useState(company);
    const [localExpertise, setLocalExpertise] = useState(expertise);

    // Update local state when props change
    useEffect(() => {
        setLocalBatchFrom(batchFrom);
        setLocalBatchTo(batchTo);
        setLocalCompany(company);
        setLocalExpertise(expertise);
    }, [batchFrom, batchTo, company, expertise]);

    const handleApplyFilters = () => {
        onApplyFilters({
            batchFrom: localBatchFrom,
            batchTo: localBatchTo,
            company: localCompany,
            expertise: localExpertise
        });
    };

    const handleClearFilters = () => {
        setLocalBatchFrom('');
        setLocalBatchTo('');
        setLocalCompany('');
        setLocalExpertise('');
        clearFilters();
    };

    if (!showFilters) return null;

    return (
        <div className="mb-6 rounded-lg bg-white/5 p-6 backdrop-blur-sm border border-white/10">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Filter Alumni</h3>
                <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                    <FaTimes className="text-xs" />
                    Clear All
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Batch From */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                        Batch From
                    </label>
                    <input
                        type="number"
                        value={localBatchFrom}
                        onChange={(e) => setLocalBatchFrom(e.target.value)}
                        placeholder="e.g., 2020"
                        min="1990"
                        max="2025"
                        className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    />
                </div>

                {/* Batch To */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                        Batch To
                    </label>
                    <input
                        type="number"
                        value={localBatchTo}
                        onChange={(e) => setLocalBatchTo(e.target.value)}
                        placeholder="e.g., 2024"
                        min="1990"
                        max="2025"
                        className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    />
                </div>

                {/* Company */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                        Company
                    </label>
                    <select
                        value={localCompany}
                        onChange={(e) => setLocalCompany(e.target.value)}
                        className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    >
                        <option value="" className="bg-gray-800">Any Company</option>
                        {companies.map((comp, index) => (
                            <option key={index} value={comp} className="bg-gray-800">
                                {comp}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Expertise */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                        Expertise
                    </label>
                    <select
                        value={localExpertise}
                        onChange={(e) => setLocalExpertise(e.target.value)}
                        className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    >
                        <option value="" className="bg-gray-800">Any Expertise</option>
                        {expertiseOptions.map((exp, index) => (
                            <option key={index} value={exp} className="bg-gray-800">
                                {exp}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Apply Filters Button */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleApplyFilters}
                    className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-500 transition-colors font-medium"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
};

export default Filters;