import { useState, useEffect } from "react";

const Filters = ({
  showFilters,
  batchFrom,
  batchTo,
  company,
  companies,
  expertise,
  clearFilters,
  onApplyFilters,
  expertiseOptions,
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
      expertise: localExpertise,
    });
  };

  const handleClearFilters = () => {
    setLocalBatchFrom("");
    setLocalBatchTo("");
    setLocalCompany("");
    setLocalExpertise("");
    clearFilters();
  };

  if (!showFilters) return null;

  return (
    <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Filter Alumni</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Batch From */}
        <div className="space-y-2">
          <label className="text-gray-300 block text-sm font-medium">
            Batch From
          </label>
          <input
            type="number"
            value={localBatchFrom}
            onChange={(e) => setLocalBatchFrom(e.target.value)}
            placeholder="e.g., 2020"
            min="1990"
            max="2025"
            className="placeholder-gray-400 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          />
        </div>

        {/* Batch To */}
        <div className="space-y-2">
          <label className="text-gray-300 block text-sm font-medium">
            Batch To
          </label>
          <input
            type="number"
            value={localBatchTo}
            onChange={(e) => setLocalBatchTo(e.target.value)}
            placeholder="e.g., 2024"
            min="1990"
            max="2025"
            className="placeholder-gray-400 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          />
        </div>

        {/* Company */}
        <div className="space-y-2">
          <label className="text-gray-300 block text-sm font-medium">
            Company
          </label>
          <select
            value={localCompany}
            onChange={(e) => setLocalCompany(e.target.value)}
            className="placeholder-gray-400 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          >
            <option value="" className="bg-gray-800">
              Any Company
            </option>
            {companies.map((comp, index) => (
              <option key={index} value={comp} className="bg-gray-800">
                {comp}
              </option>
            ))}
          </select>
        </div>

        {/* Expertise */}
        <div className="space-y-2">
          <label className="text-gray-300 block text-sm font-medium">
            Expertise
          </label>
          <select
            value={localExpertise}
            onChange={(e) => setLocalExpertise(e.target.value)}
            className="placeholder-gray-400 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          >
            <option value="" className="bg-gray-800">
              Any Expertise
            </option>
            {expertiseOptions.map((exp, index) => (
              <option key={index} value={exp} className="bg-gray-800">
                {exp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={handleApplyFilters}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-500"
        >
          Apply Filters
        </button>

        <button
          onClick={handleClearFilters}
          className="rounded-lg bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/20"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default Filters;
