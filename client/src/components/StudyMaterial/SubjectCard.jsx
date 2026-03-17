import { Link } from 'react-router-dom';
import { LuBookMarked, LuArrowRight, LuFileText } from 'react-icons/lu';

export const SubjectCard = ({ subject }) => {
  const resourceCount = subject.resources 
    ? Object.values(subject.resources).flat().length 
    : 0;

  return (
    <Link 
      to={`/study-material/subject/${subject._id}`} 
      className="group block rounded-xl border border-zinc-700/50 bg-zinc-900/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/30 hover:bg-zinc-800/60 hover:shadow-lg hover:shadow-blue-500/5 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-800 text-blue-400 transition-all duration-300 group-hover:border-blue-500/30 group-hover:bg-blue-500/10">
            <LuBookMarked className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-gray-200 group-hover:text-white transition-colors">
              {subject.subjectName}
            </h3>
            {resourceCount > 0 && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                <LuFileText className="h-3 w-3" />
                <span>{resourceCount} resource{resourceCount !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
        </div>
        <LuArrowRight className="h-5 w-5 flex-shrink-0 text-gray-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-400" />
      </div>
    </Link>
  );
};