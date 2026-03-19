import Modal from "@mui/joy/Modal/Modal";
import Loader from "../Loader/Loader";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import increamentCounter from "../../libs/increamentCounter";
import { addAchievement } from "../../services/achievementService";

const AchievementsForm = () => {
  const [open, setOpen] = useState(false);
  const [AchievementForm, setAchievementForm] = useState({
    teamMembers: "",
    desc: "",
    proof: null,
    image: null,
  });
  const [image, setImage] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(()=>{
    increamentCounter();
  }, [])

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
    const fieldid = event.target.id;
    setAchievementForm((prev) => ({ ...prev, [fieldid]: file }));
    if(fieldid === 'image' && file){
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const mutation = useMutation({
    mutationFn: async (newAchievement) => {
      if (!newAchievement.image) {
        throw new Error("No display image provided. Please click the square box to select a primary image.");
      }
      if (!newAchievement.proof) {
        throw new Error("No proof of achievement provided. Please upload a supporting file.");
      }
      
      const formData = new FormData();
      formData.append("teamMembers", JSON.stringify(newAchievement.teamMembers.split(",").map(member => member.trim())));
      formData.append("desc", newAchievement.desc.trim());
      formData.append("image", newAchievement.image);
      formData.append("proof", newAchievement.proof);

      // Note: Do not set Content-Type header manually; the browser adds the boundary
      const response = await addAchievement(formData);

      const data = response?.data || response;

      if (!data || (data.success === false)) {
        throw new Error(data?.message || "Failed to submit achievement details");
      }

      return data;
    },
    onMutate: () => {
      toast.loading("Uploading your details...", { id: "submitToast" });
    },
    onSuccess: () => {
      setOpen(true);
      toast.success("Achievement details submitted successfully!", { id: "submitToast" });
    },
    onError: (error) => {
      console.log("Submission Failed:", error);
      toast.error(error.message || "Something went wrong! Please try again.", { id: "submitToast" });
    },
  });
  

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!AchievementForm.image) {
      toast.error("Please click the image box to upload a display image.", { id: "submitToast" });
      return;
    }
    if (!AchievementForm.proof) {
      toast.error("Please upload the proof of achievement document.", { id: "submitToast" });
      return;
    }
    mutation.mutate(AchievementForm);
  };

  return (
    <section className="mx-4 mb-48 mt-10 flex h-auto max-w-5xl items-center overflow-hidden rounded-md bg-transparent md:mx-auto">
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
        <h4 className="text-lg font-bold md:text-2xl text-white">Achievement Information</h4>
        <div className="mt-8 flex flex-col items-center justify-center gap-10 md:flex-row md:p-2 w-full">
          <div className="flex flex-col items-center justify-center md:w-1/3">
            <label htmlFor="image" className="cursor-pointer" title="Select a display image">
              <img
                src={image || "https://via.placeholder.com/300?text=Upload+Display+Image"}
                alt="Upload Preview"
                className="h-56 w-56 rounded-md border border-zinc-700/50 object-cover object-center shadow-lg transition-all hover:scale-105 md:h-72 md:w-72"
              />
            </label>
            <input type="file" accept="image/*" id="image" name="image" hidden onChange={handleImageChange} required />
            <p className="mt-4 text-xs text-zinc-400">Click the box above to select your primary display image*</p>
          </div>
          <div className="mx-auto flex flex-col items-center justify-between gap-6 md:w-2/3">
            <div className="flex w-full flex-col gap-2">
              <label htmlFor="teamMembers" className="uppercase text-zinc-300 text-sm font-semibold tracking-wider">Team Members</label>
              <input
                type="text"
                id="teamMembers"
                value={AchievementForm.teamMembers}
                onChange={handleInputChange}
                placeholder="U23CS002, I24AI003"
                className="w-full border-b border-zinc-600 bg-transparent py-2 text-sm text-white outline-none transition-colors focus:border-orange-500 uppercase rounded-none"
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <label htmlFor="desc" className="uppercase text-zinc-300 text-sm font-semibold tracking-wider">Description</label>
              <textarea
                id="desc"
                rows={4}
                placeholder="Describe your achievement..."
                className="w-full border-b border-zinc-600 bg-transparent py-2 text-sm text-white outline-none transition-colors focus:border-orange-500 rounded-none resize-none"
                value={AchievementForm.desc}
                onChange={handleInputChange}
              />
            </div>
            <div className="file-upload-section w-full">
              <h4 className="mt-4 text-sm font-semibold tracking-wider text-zinc-300 uppercase">Upload Proof of Achievement:</h4>
              <input
                type="file"
                accept="image/*"
                id="proof"
                name="proof"
                onChange={handleImageChange}
                className="my-2 w-full rounded-md border border-zinc-700 bg-zinc-800/50 p-2 text-zinc-300 file:mr-4 file:rounded-md file:border-0 file:bg-orange-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-orange-700 transition-all cursor-pointer"
                required
              />
            </div>
          </div>
        </div>
        <button
          className="mt-10 rounded-xl bg-orange-600 px-8 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-1 hover:bg-orange-500 hover:shadow-orange-500/40"
          onClick={handleSubmit}
        >
          Submit Your Details
        </button>
      </div>
    </section>
  );
};

export default AchievementsForm;