import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getResourcesBySubject, getSubjectDetails } from "../services/studyMaterialService";
import Loader from "../components/Loader/Loader";
import MaintenancePage from "../components/Error/MaintenancePage";
import {
  LuLink,
  LuFileText,
  LuYoutube,
  LuBook,
  LuArrowLeft,
  LuFilter,
} from "react-icons/lu";

// Resource Card
const ResourceLink = ({ resource }) => {
  let icon;
  switch (resource.subCategory) {
    case "Youtube Resources":
      icon = <LuYoutube className="h-5 w-5" />;
      break;
    case "Notes":
    case "PYQs":
      icon = <LuFileText className="h-5 w-5" />;
      break;
    case "Important topics":
      icon = <LuBook className="h-5 w-5" />;
      break;
    default:
      icon =
        resource.resourceType === "PDF"
          ? <LuFileText className="h-5 w-5" />
          : <LuLink className="h-5 w-5" />;
  }

  return (
    <a
      href={resource.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#0f0f0f] p-4 transition-all duration-300 hover:border-blue-400/50 hover:bg-white/5"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="text-blue-400 flex-shrink-0">{icon}</span>
        <span className="font-medium text-gray-100 truncate">{resource.title}</span>
      </div>
      <LuLink className="h-4 w-4 text-gray-500 transition-all duration-300 group-hover:text-blue-400" />
    </a>
  );
};

const SubjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subCategoryFilter, setSubCategoryFilter] = useState("All");

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // Fetch subject info
  const {
    data: subjectMeta,
    isLoading: isSubjectLoading,
    isError: isSubjectError,
    error: subjectError,
  } = useQuery({
    queryKey: ["subjectMeta", id],
    queryFn: async () => {
      const response = await getSubjectDetails(id);
      if (!response.success)
        throw new Error(response.message || "Failed to fetch subject details");
      return response.data;
    },
  });

  // Fetch grouped resources
  const {
    data: resourceResponse,
    isLoading: isResourceLoading,
    isError: isResourceError,
    error: resourceError,
  } = useQuery({
    queryKey: ["resources", id, subCategoryFilter],
    queryFn: async () => {
      const response = await getResourcesBySubject(id, {
        subCategory: subCategoryFilter !== "All" ? subCategoryFilter : undefined,
      });
      if (!response.success)
        throw new Error(response.message || "Failed to fetch resources");
      return response.data; // grouped object
    },
    enabled: !!id,
  });

  // Loading + error handling
  if (isSubjectLoading || isResourceLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader />
      </div>
    );

  if (isSubjectError || isResourceError) {
    console.error("Error fetching data:", subjectError || resourceError);
    return <MaintenancePage />;
  }

  if (!subjectMeta)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader />
      </div>
    );

  const groupedResources = resourceResponse || {};
  const allSubCategories = Object.keys(groupedResources);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-white">
      <Link
        to="/study-material"
        className="mb-6 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/20"
      >
        <LuArrowLeft className="h-4 w-4" />
        Back to Subjects
      </Link>

      <h1 className="mb-8 text-4xl font-bold">{subjectMeta.subjectName}</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-2">
          {/* Filter */}
          <div className="rounded-lg border border-white/10 bg-[#0f0f0f] p-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Sub-Category
              </label>
              <select
                value={subCategoryFilter}
                onChange={(e) => setSubCategoryFilter(e.target.value)}
                className="w-full rounded-lg bg-white/10 border border-white/20 py-2.5 px-3 text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Sub-Categories</option>
                {allSubCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grouped Resources */}
          {Object.keys(groupedResources).length > 0 ? (
            Object.entries(groupedResources)
              .filter(
                ([subCat]) => subCategoryFilter === "All" || subCat === subCategoryFilter
              )
              .map(([subCategory, resources]) => (
                <div key={subCategory} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-blue-400">
                    {subCategory}
                  </h2>
                  <div className="space-y-3">
                    {resources.map((resource) => (
                      <ResourceLink key={resource._id} resource={resource} />
                    ))}
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-10 rounded-lg border border-dashed border-white/10">
              <LuFilter className="mx-auto h-12 w-12 text-gray-500" />
              <h3 className="mt-2 text-xl font-semibold text-white">
                No resources found
              </h3>
            </div>
          )}
        </div>

        {/* Right Column: Tips */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#0f0f0f] p-6">
            <h2 className="mb-4 text-2xl font-semibold text-blue-400">
              Tips & Advice
            </h2>
            {subjectMeta.tips?.length > 0 ? (
              <ul className="space-y-4">
                {subjectMeta.tips.map((tip, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                    <span className="text-gray-300">{tip}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">
                No tips added yet. Be the first to contribute!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetailPage;
