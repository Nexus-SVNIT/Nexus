import { LuBuilding, LuMapPin, LuExternalLink } from 'react-icons/lu';
import { Badge } from './Badge';

export function AlumniCard({ alumni }) {
  const getInitials = (name) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();

  const handleLinkedInClick = () => {
    window.open(alumni.linkedInProfile, '_blank');
  };

  return (
    <div className="text-gray-100 rounded-2xl border border-white/10 hover:-translate-y-1 transition-all duration-300 p-6 bg-[#0f0f0f] hover:shadow-elegant">
      {/* Header Section */}

      <div className='flex justify-between'></div>
      <div className="flex items-center gap-4 mb-4">
        {/* Avatar */}
        { alumni.ImageLink?.includes("cloudinary") ? (
            <div className="w-16 h-16 bg-blue-400/20 rounded-full flex items-center justify-center text-white font-bold text-xl">
                <img src={alumni.ImageLink} alt={alumni.fullName} className="w-full h-full rounded-full object-cover" />
            </div>
        ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-500/80 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {getInitials(alumni.fullName)}
            </div>
        )}
        
        
        {/* Name and Graduation Year */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-white">
            {alumni.fullName}
          </h3>
          <p className="text-sm text-gray-400">
            Class of {alumni.passingYear}
          </p>
        </div>

          <button
            onClick={handleLinkedInClick}
        className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-[#00aaff] border border-[#00aaff] rounded-lg hover:bg-[#00aaff] hover:text-white transition-colors duration-200"
          >
            <LuExternalLink className="w-4 h-4" />
            LinkedIn
          </button>
      </div>

      {/* Content Section */}
      <div className='space-y-4'>
        <div className="space-y-2">
          {/* Position and Company */}
          <div className="flex items-center gap-2 text-sm">
            <LuBuilding className="w-4 h-4 text-blue-400" />
            <span className="font-medium">{alumni.currentDesignation}</span>
          </div>
          <div className="flex items-center gap-2">
              <LuMapPin className="w-4 h-4 flex-shrink-0 text-[#6c757d]" />
              <span className="">{alumni.currentCompany} • <span className="text-md text-[#6c757d]">Bangalore, India</span></span>
              {/* <span className="text-[#6c757d] truncate">Bangalore, India</span> */}
          </div>


          {/* Location */}
          { alumni.location && (
            <div className="flex items-center gap-2 text-sm text-gray-2">
              <LuMapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{alumni.location}</span>
            </div>
          )}
        </div>

        {/* Expertise Badges */}
        {alumni.expertise && alumni.expertise.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {alumni.expertise.map((skill, index) => (
                <Badge
                  key={index}
                    className="bg-blue-400/10 text-blue-400 border-blue-400/20 hover:bg-blue-400/20"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}