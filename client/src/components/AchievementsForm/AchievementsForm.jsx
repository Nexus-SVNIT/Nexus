import Modal from "@mui/joy/Modal/Modal";
import Loader from "../Loader/Loader";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

const AchievementsForm = () => {
  const [open, setOpen] = useState(false);
  const [AchievementForm, setAchievementForm] = useState({
    email: "",
    image: "",
    members: "",
    desc: "",
    proof: "",
  });
  const [image, setImage] = useState(null);
  const handleInputChange = (event) => {
    setAchievementForm({
      ...AchievementForm,
      [event.target.id]: event.target.value,
    });
  };

  const handleImageChange = (event) => {
    try {
      const file = event?.target?.files?.[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage(reader.result);
        }
      };
      reader?.readAsDataURL(file);
    } catch (error) {
      return;
    }
  };
  const mutation = useMutation({
    mutationFn: (newAchievement) => {
      return fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/achievements/add`,
        {
          method: "POST",
          body: JSON.stringify(newAchievement),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    },
  });
  const handleSubmit = (event) => {
    setOpen(true);
    mutation.mutate({ ...AchievementForm, image });
  };
  if (mutation.isError) return <p>ERROR</p>;
  return (
    <section className="mx-4 mb-48 mt-10 flex h-auto max-w-5xl items-center overflow-hidden rounded-md bg-blue-100/10 md:mx-auto">
      <Modal
        aria-describedby="modal-desc"
        open={open}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "none",
        }}
      >
        <div
          id="modal-desc"
          className={`mx-4 flex min-h-[10rem] flex-col items-center justify-center rounded-lg border-none bg-black/70 pb-8  transition-all md:w-[15rem] md:gap-4`}
        >
          {mutation.isPending ? (
            <>
              <Loader />
              <p className="w-3/4 text-white">Uploading Your Details...</p>
            </>
          ) : !mutation.isError ? (
            <div className="flex flex-col items-center justify-center gap-4 text-white">
              <p className="w-3/4  text-center text-sm text-white">
                Your Achievement Details are under Review.
              </p>
              <Link
                to={"/achievements"}
                className="rounded-sm bg-blue-600/50 px-4 py-2"
              >
                OK
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-white">
              <p className="text-center text-sm text-white md:w-3/4">
                Something went wrong!!
              </p>
              <button
                onClick={(e) => setOpen(false)}
                className="rounded-sm bg-blue-600/50 px-4 py-2"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </Modal>
      <div className="px-0sc mb-10 flex w-full max-w-5xl flex-col items-center justify-center py-6 md:px-10">
        <h4 className="text-lg font-bold md:text-2xl ">
          Achievement Information
        </h4>
        <div className="mt-2 flex flex-col items-center justify-center gap-10 md:flex-row md:p-2">
          <div className="flex flex-col items-center justify-center md:w-3/4">
            <label
              htmlFor="image"
              className="cursor-pointer"
              title="Select an image"
            >
              <img
                src={
                  image ??
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmrO6oGyxrMasnTJFJSt86C3Ecac3kTHtrbQ&usqp=CAU"
                }
                alt="profile"
                className="h-56 w-56 rounded-md object-cover object-center md:h-80 md:w-80"
              />
            </label>
            <input
              type="file"
              accept="image/*"
              name="image"
              id="image"
              hidden
              onChange={handleImageChange}
            />
            <p className="mt-4 text-xs text-gray-400">
              Note: Your image will be showed as above*
            </p>
          </div>

          <div className="mx-auto flex flex-wrap items-center justify-between gap-2 ">
            <div className="m-4 flex w-full flex-col gap-2 ">
              <label htmlFor="email" className="uppercase">
                {"Institute Email "}
              </label>

              <input
                type="text"
                id={"email"}
                name={"email"}
                value={AchievementForm.email}
                onChange={handleInputChange}
                placeholder="u21cs134@coed.svnit.ac.in"
                className="w-full border-b border-blue-500/50 bg-transparent text-sm outline-none"
              />
            </div>
            <div className="m-4 flex w-full flex-col gap-2 ">
              <label htmlFor="members" className="uppercase">
                {"Team Member Names"}
              </label>

              <input
                type="text"
                id={"members"}
                name={"members"}
                value={AchievementForm.members}
                onChange={handleInputChange}
                placeholder="John Doe, Jane Smith,Michael Johnson"
                className="w-full border-b border-blue-500/50 bg-transparent text-sm outline-none"
              />
            </div>

            <div className="m-4 flex w-full flex-col gap-2">
              <label htmlFor="desc" className="uppercase">
                {"Provide Description"}
              </label>

              <textarea
                type="text"
                id={"desc"}
                name={"desc"}
                rows={4}
                placeholder="As an innovative student, I spearheaded a groundbreaking coding project, securing first place in the National Coding Challenge. My commitment to excellence extends beyond the classroom—I initiated a tech-driven community outreach program, positively impacting 500+ lives. Let your achievements shine bright here!"
                className="w-full border-b border-blue-500/50 bg-transparent text-sm outline-none"
                value={AchievementForm.desc}
                onChange={handleInputChange}
              />
            </div>
            <div className="m-4 flex w-full flex-col gap-2 ">
              <label htmlFor="proof" className="uppercase">
                {"Proof Of Achievement"}
              </label>

              <input
                type="text"
                id={"proof"}
                name={"proof"}
                value={AchievementForm.proof}
                onChange={handleInputChange}
                placeholder="Please Provide Public Drive Link with all necessary proof."
                className="w-full border-b border-blue-500/50 bg-transparent text-sm outline-none"
              />
            </div>
          </div>
        </div>
        <button
          className="mt-10 bg-blue-600 px-8 py-4 hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Submit Your Details
        </button>
      </div>
    </section>
  );
};

export default AchievementsForm;
