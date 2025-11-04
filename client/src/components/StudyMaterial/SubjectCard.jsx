import { Link } from "react-router-dom";
import { LuBookOpen, LuArrowRight } from "react-icons/lu";

export const SubjectCard = ({ subject }) => {
  return (
    <Link
      to={`/study-material/subject/${subject._id}`}
      className="group block h-full rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:bg-white/5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400/30"
    >
      <div className="flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <LuBookOpen className="h-5 w-5" />
            </div>
            <h3
              className="text-lg font-semibold text-white leading-snug line-clamp-2"
              title={subject.subjectName}
            >
              {subject.subjectName}
            </h3>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
          <p className="truncate">
            <span className="font-medium text-gray-300">Dept:</span>{" "}
            {subject.department}
          </p>
          <span className="inline-flex items-center gap-1 text-blue-400 group-hover:translate-x-1 transition-transform duration-300">
            View
            <LuArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};