import React from "react";

const AchievementsForm = () => {
  return (
    <section className="mx-auto mb-48 mt-10 flex h-auto max-w-5xl items-center overflow-hidden rounded-md bg-blue-100/10">
      <div className="mb-10 flex w-full max-w-5xl flex-col items-center justify-center px-10 py-6">
        <h4 className="text-2xl font-bold">Achievement Information</h4>
        <div className="flex flex-col items-center justify-center gap-10 p-2 md:flex-row">
          <div className="flex w-3/4 flex-col items-center justify-center">
            <img
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmrO6oGyxrMasnTJFJSt86C3Ecac3kTHtrbQ&usqp=CAU"
              }
              alt="profile"
              className="h-80 w-80 rounded-md object-cover object-center"
            />
            <p className="mt-4 text-xs text-gray-400">
              Note: Your image will be showed as above*
            </p>
          </div>

          <div className="mx-auto mt-8 flex flex-wrap items-center justify-between">
            <div key="Members" className="m-4 flex w-full flex-col gap-2 ">
              <label htmlFor="Members" className="uppercase">
                {"Team Mebmer Names"}
              </label>

              <input
                type="text"
                id={"Members"}
                name={"members"}
                placeholder="John Doe, Jane Smith,Michael Johnson"
                className="w-full border-b border-blue-500/50 bg-transparent outline-none"
              />
            </div>

            <div key="Members" className="m-4 flex w-full flex-col gap-2">
              <label htmlFor="Members" className="uppercase">
                {"Team Mebmer Names"}
              </label>

              <textarea
                type="text"
                id={"Members"}
                rows={6}
                name={"members"}
                placeholder="As an innovative student, I spearheaded a groundbreaking coding project, securing first place in the National Coding Challenge. My commitment to excellence extends beyond the classroom—I initiated a tech-driven community outreach program, positively impacting 500+ lives. Let your achievements shine bright here!"
                className="w-full border-b border-blue-500/50 bg-transparent outline-none"
              />
            </div>
            <div key="Members" className="m-4 flex w-full flex-col gap-2 ">
              <label htmlFor="Members" className="uppercase">
                {"Proof Of Achivement"}
              </label>

              <input
                type="text"
                id={"Members"}
                name={"members"}
                placeholder="Please Provide Public Drive Link with all neccessary proof."
                className="w-full border-b border-blue-500/50 bg-transparent outline-none"
              />
            </div>
          </div>
        </div>
        <button className="mt-10 bg-blue-600 px-8 py-4 hover:bg-blue-700">
          Submit Your Details
        </button>
      </div>
    </section>
  );
};

export default AchievementsForm;
