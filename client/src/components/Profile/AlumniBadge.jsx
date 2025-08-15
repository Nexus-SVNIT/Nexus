import { FaGraduationCap } from "react-icons/fa";

const AlumnusBadge = () => {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-1 text-white text-sm font-semibold shadow-md">
      <FaGraduationCap size={20} />
      <span>Alumnus</span>
    </div>
  );
};

export default AlumnusBadge;
