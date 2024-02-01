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
          onClose={() => setOpen(false)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            id="modal-desc"
            key={el.timestamp}
            className={`mx-4 flex cursor-text flex-col rounded-lg bg-black/70 pb-8 transition-all  md:w-[28rem] md:gap-4`}
          >
            <div>
              <img
                src={
                  `https://lh3.googleusercontent.com/d/${el.imageLink}` ??
                  "https://images.pexels.com/photos/1097930/pexels-photo-1097930.jpeg?auto=compress&cs=tinysrgb&w=800"
                }
                alt="Banner"
                className="h-60 w-full rounded-t-lg object-cover object-center md:h-80"
              />
            </div>

            <div className="mx-2 flex flex-1 flex-col items-center justify-evenly gap-2 overflow-hidden px-2">
              <p className="line-clamp-none w-4/5 text-center text-sm text-[#FFD700]">
                - {el.name}
              </p>
              <p className="text-whiter line-clamp-none text-sm ">
                {el.achievement}
              </p>
            </div>
          </div>
        </Modal>
      </React.Fragment>
      <div
        key={el.timestamp}
        className={`flex h-[26rem] w-[20rem] cursor-text flex-col rounded-lg bg-blue-100/5  transition-all hover:scale-105 md:gap-4`}
      >
        <div>
          <img
            src={
              `https://lh3.googleusercontent.com/d/${el.imageLink}` ??
              "https://images.pexels.com/photos/1097930/pexels-photo-1097930.jpeg?auto=compress&cs=tinysrgb&w=800"
            }
            alt="Banner"
            className="h-60 w-full rounded-t-lg object-cover object-center"
          />
        </div>

        <div className="mx-2 flex flex-1 flex-col items-center justify-evenly gap-2 overflow-hidden px-2">
          <p className="line-clamp-1 w-4/5 text-center text-sm text-[#FFD700]">
            - {el.name}
          </p>
          <p className="line-clamp-3 text-sm text-gray-400 ">
            {el.achievement}
          </p>
          <button
            className="mb-2 w-full cursor-pointer justify-start p-0 text-start text-blue-600"
            onClick={(e) => setOpen(true)}
          >
            Read More...
          </button>
        </div>
      </div>
    </>
  );
};

export default AchievementCard;
