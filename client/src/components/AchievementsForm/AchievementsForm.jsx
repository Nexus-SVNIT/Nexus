import Modal from "@mui/joy/Modal/Modal";
import Loader from "../Loader/Loader";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import increamentCounter from "../../libs/increamentCounter";

const AchievementsForm = () => {
  const [open, setOpen] = useState(false);
  const [AchievementForm, setAchievementForm] = useState({
    teamMembers: "",
    desc: "",
    proof: "",
    image: null,
  });
  const [image, setImage] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(()=>{
    increamentCounter();
  })

  if(!token) {
    toast.error("You need to login first!", { id: "loginToast" });
    toast.loading("Redirecting to login page...", { id: "a" });
    setTimeout(() => {
      const currentPath = encodeURIComponent(window.location.pathname);
      window.location.href = `/login?redirect_to=${currentPath}`;
    }, 2000);
  }

  const handleInputChange = (event) => {
    setAchievementForm({
      ...AchievementForm,
      [event.target.id]: event.target.value,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setAchievementForm((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const mutation = useMutation({
    mutationFn: async (newAchievement) => {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("teamMembers", JSON.stringify(newAchievement.teamMembers.split(",").map(member => member.trim())));
      formData.append("desc", newAchievement.desc.trim());
      formData.append("proof", newAchievement.proof.trim());
      formData.append("image", newAchievement.image);
  
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/achievements/add`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit achievement details");
      }
  
      return response.json(); // or response if you need the full response object
    },
    onMutate: () => {
      toast.loading("Uploading your details...", { id: "submitToast" });
    },
    onSuccess: () => {
      setOpen(true);
      toast.success("Achievement details submitted successfully!", { id: "submitToast" });
    },
    onError: () => {
      toast.error("Something went wrong! Please try again.", { id: "submitToast" });
    },
  });
  

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(AchievementForm);
  };

  return (
    <section className="mx-4 mb-48 mt-10 flex h-auto max-w-5xl items-center overflow-hidden rounded-md bg-blue-100/10 md:mx-auto">
      <Modal
        aria-describedby="modal-desc"
        open={open}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", border: "none" }}
      >
        <div className="mx-4 flex min-h-[10rem] flex-col items-center justify-center rounded-lg border-none bg-black/70 pb-8 transition-all md:w-[15rem] md:gap-4">
          {mutation.isPending ? (
            <>
              <Loader />
              <p className="w-3/4 text-white">Uploading Your Details...</p>
            </>
          ) : !mutation.isError ? (
            <div className="flex flex-col items-center justify-center gap-4 text-white">
              <p className="w-3/4 text-center text-sm text-white">
                Your Achievement Details are under Review.
              </p>
              <Link to={"/achievements"} className="rounded-sm bg-blue-600/50 px-4 py-2">OK</Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-white">
              <p className="text-center text-sm text-white md:w-3/4">Something went wrong!!</p>
              <button onClick={() => setOpen(false)} className="rounded-sm bg-blue-600/50 px-4 py-2">Try Again</button>
            </div>
          )}
        </div>
      </Modal>
      <div className="px-0sc mb-10 flex w-full max-w-5xl flex-col items-center justify-center py-6 md:px-10">
        <h4 className="text-lg font-bold md:text-2xl">Achievement Information</h4>
        <div className="mt-2 flex flex-col items-center justify-center gap-10 md:flex-row md:p-2">
          <div className="flex flex-col items-center justify-center md:w-3/4">
            <label htmlFor="image" className="cursor-pointer" title="Select an image">
              <img
                src={image || "https://via.placeholder.com/150"}
                alt="profile"
                className="h-56 w-56 rounded-md object-cover object-center md:h-80 md:w-80"
              />
            </label>
            <input type="file" accept="image/*" id="image" hidden onChange={handleImageChange} />
            <p className="mt-4 text-xs text-gray-400">Note: Your image will be shown as above*</p>
          </div>
          <div className="mx-auto flex flex-wrap items-center justify-between gap-2 ">
            <div className="m-4 flex w-full flex-col gap-2 ">
              <label htmlFor="teamMembers" className="uppercase">Team Members</label>
              <input
                type="text"
                id="teamMembers"
                value={AchievementForm.teamMembers}
                onChange={handleInputChange}
                placeholder="U23CS002, I24AI003"
                className="w-full border-b border-blue-500/50 bg-transparent text-sm outline-none uppercase"
              /> {/*spaces issue handled with map*/}
            </div>
            <div className="m-4 flex w-full flex-col gap-2">
              <label htmlFor="desc" className="uppercase">Description</label>
              <textarea
                id="desc"
                rows={4}
                placeholder="Describe your achievement..."
                className="w-full border-b border-blue-500/50 bg-transparent text-sm outline-none"
                value={AchievementForm.desc}
                onChange={handleInputChange}
              />
            </div>
            <div className="m-4 flex w-full flex-col gap-2 ">
              <label htmlFor="proof" className="uppercase">Proof of Achievement</label>
              <input
                type="text"
                id="proof"
                value={AchievementForm.proof}
                onChange={handleInputChange}
                placeholder="Provide a public drive link"
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
