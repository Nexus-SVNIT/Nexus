import React from 'react';
import { Link } from 'react-router-dom';
import { LuBookMarked, LuArrowRight } from 'react-icons/lu';

export const SubjectCard = React.memo(({ subject }) => {
  return (
    <Link
      to={`/study-material/subject/${subject._id}`}
      onMouseEnter={() => import('../../pages/SubjectDetailPage.jsx')} // preloads route bundle
      className="group block text-gray-100 rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant focus:outline-none focus:ring-2 focus:ring-blue-400/50"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-500/80 text-white">
            <LuBookMarked className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h3
              title={subject.subjectName}
              className="text-lg font-semibold text-white truncate"
            >
              {subject.subjectName}
            </h3>
          </div>
        </div>

        <LuArrowRight className="h-5 w-5 text-gray-400 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
});
