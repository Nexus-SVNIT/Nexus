import Modal from "@mui/joy/Modal";
import React from "react";

const AchievementCard = ({ el }) => {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  return (
    <>
      <React.Fragment>
        <Modal
          aria-describedby="modal-desc"
          open={open}
          onClose={handleClose}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            id="modal-desc"
            key={el._id}
            className={`mx-4 flex cursor-text flex-col rounded-lg bg-black/70 pb-8 transition-all md:w-[28rem] md:gap-4`}
          >
            <div>
              <img
                src={`https://lh3.googleusercontent.com/d/${el.image}`} // Update image source based on new data
                alt="Banner"
                className="h-60 w-full rounded-t-lg object-cover object-center md:h-80"
              />
            </div>

            <div className="mx-2 flex flex-1 flex-col items-center justify-evenly gap-2 overflow-hidden px-2">
              <ul className="line-clamp-none w-4/5 text-center text-sm text-[#FFD700]">
                {el.teamMembersDetails
                  .map((member) => <li className="italic hover:underline"><a href={member.linkedInProfile} target="_blank">{member.fullName + " (" + member.admissionNumber + ")"}</a></li>)
                  }{" "}
                {/* Display full names of team members */}
              </ul>
              <p className="line-clamp-none text-sm text-whiter ">
                {el.desc} {/* Updated to show description */}
              </p>
              <a
                href={el.proof}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                View Proof
              </a>{" "}
              {/* Link to proof */}
            </div>
          </div>
        </Modal>
      </React.Fragment>

      <div
        key={el._id}
        className={`flex h-[26rem] w-[20rem] cursor-text flex-col rounded-lg bg-blue-100/5 transition-all hover:scale-105 md:gap-4`}
      >
        <div>
          <img
            src={`https://lh3.googleusercontent.com/d/${el.image}`} // Update image source based on new data
            alt="Banner"
            className="h-60 w-full rounded-t-lg object-cover object-center"
          />
        </div>

        <div className="mx-2 flex flex-1 flex-col items-center justify-evenly gap-0 overflow-hidden px-2">
          <p className=" w-4/5 text-center text-sm text-[#FFD700]">
          - {el.teamMembersDetails.map(member => member.fullName).join(", ")} {/*Display full names of team members*/}
          </p>
          <p className="text-gray-400 line-clamp-3 text-sm ">
            {el.desc} {/* Updated to show description */}
          </p>
          <button
            className="mb-2 w-full cursor-pointer justify-start p-0  text-center text-blue-600"
            onClick={() => setOpen(true)}
          >
            Read More...
          </button>
        </div>
      </div>
    </>
  );
};

export default AchievementCard;
