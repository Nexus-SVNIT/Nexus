import React from "react";
import { useNavigate } from "react-router-dom";
import { LuBookOpen, LuArrowRight } from "react-icons/lu";

export const SubjectCard = ({ subject }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/study-material/${subject._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:bg-white/5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 overflow-hidden">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-400 transition-all duration-300 group-hover:bg-blue-400 group-hover:text-white">
            <LuBookOpen className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="text-lg font-semibold text-white break-words line-clamp-2 group-hover:text-blue-400"
              title={subject.subjectName}
            >
              {subject.subjectName}
            </h3>
            <p className="mt-1 text-sm text-gray-400 truncate">
              {subject.department} • {subject.category}
            </p>
          </div>
        </div>

        <LuArrowRight className="h-5 w-5 flex-shrink-0 text-gray-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-400" />
      </div>
    </div>
  );
};