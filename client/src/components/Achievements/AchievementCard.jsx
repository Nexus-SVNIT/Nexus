import Modal from "@mui/joy/Modal";
import React from "react";
import { FaX } from "react-icons/fa6";
import { FaTrophy, FaArrowRight, FaExternalLinkAlt } from "react-icons/fa";

const AchievementCard = ({ el }) => {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const imageUrl = el?.image
    ? `https://drive.google.com/thumbnail?id=${el.image}&sz=w1000`
    : "/fallback.png";

  return (
    <>
      <Modal
        aria-describedby="modal-desc"
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0,0,0,0.75)",
        }}
      >
        <div
          id="modal-desc"
          className="relative mx-4 flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-2xl border border-zinc-800/90 bg-zinc-950/95 shadow-2xl backdrop-blur-2xl"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-zinc-300 backdrop-blur-md transition-all hover:bg-black/90 hover:text-white"
            aria-label="Close dialog"
          >
            <FaX size={12} />
          </button>

          <div className="relative h-64 w-full overflow-hidden bg-zinc-900">
            <img
              src={imageUrl}
              alt="Achievement Banner"
              className="h-full w-full object-cover object-center"
              onError={(e) => { e.target.onerror = null; e.target.src = "/fallback.png"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80"></div>
          </div>

          <div className="flex flex-col gap-4 p-6">
            {el.teamMembersDetails?.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Team Members</span>
                <ul className="flex flex-wrap gap-2">
                  {el.teamMembersDetails.map((member) => (
                    member ? (
                      <li key={member._id}>
                        <a
                          href={member.linkedInProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300 transition-colors hover:border-amber-500/40 hover:bg-amber-500/20"
                        >
                          {member.fullName} {member.admissionNumber ? `(${member.admissionNumber})` : ""}
                        </a>
                      </li>
                    ) : null
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Description</span>
              <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-line">
                {el.desc}
              </p>
            </div>

            {el.proof && (
              <div className="pt-2">
                <a
                  href={el.proof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600/90 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all hover:bg-blue-500"
                >
                  <span>View Supporting Proof</span>
                  <FaExternalLinkAlt size={10} />
                </a>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Card */}
      <div
        onClick={() => setOpen(true)}
        className="group relative flex h-[27rem] w-full max-w-[20rem] cursor-pointer flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10"
      >
        {/* Photo Container */}
        <div className="relative h-56 w-full overflow-hidden bg-zinc-900/50">
          <img
            src={imageUrl}
            alt="Achievement"
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            onError={(e) => { e.target.onerror = null; e.target.src = "/fallback.png"; }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>
          <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
        </div>

        {/* Card Content */}
        <div className="flex flex-1 flex-col justify-between p-5">
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-amber-400">
              <FaTrophy className="text-amber-400 text-xs flex-shrink-0" />
              <span className="truncate">
                {el.teamMembersDetails?.map((m) => m?.fullName).filter(Boolean).join(", ") || "Achievement"}
              </span>
            </div>

            <p className="line-clamp-3 text-sm leading-relaxed text-zinc-300">
              {el.desc}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-zinc-800/70 pt-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 transition-colors group-hover:text-blue-300">
              Read Details <FaArrowRight size={10} className="transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AchievementCard;
