import React from "react";
import Title from "../Title/Title";
const achievements = [
  {
    timestamp: "1/13/2024 11:46:46",
    email: "u22cs018@coed.svnit.ac.in",
    name: "Suchi Desai, Preesha Sheth, Shambhavi Shinde",
    achievement:
      "Demonstrated exceptional prowess in Table Tennis by securing the first position in the Sports Mania Inter-Year tournament. The team's outstanding performance showcased not only skill but also great sportsmanship.",
    imageLink: "1MxfOFpwu4w-w43hLRWT3MfkcC-30OZMB",
    additionalLink:
      "Explore the achievement: [View Details](https://drive.google.com/open?id=1r6O93TXMCE-yVQiJiPrBNl44L3YMSbQ1)",
  },
  {
    timestamp: "1/11/2024 19:23:11",
    email: "u22cs109@coed.svnit.ac.in",
    name: "Aasutosh Baraiya",
    achievement:
      "Earned the top spot in the Art and Reel Making Competition - ARTFLIX by presenting a creative masterpiece. The winning submission depicted a dog enjoying music on a uniquely designed t-shirt, showcasing artistic flair and innovation.",
    imageLink: "1o8Wr4QDKThfmo25ZnceA_2fPuNhlGJwP",
    additionalLink:
      "Explore the achievement: [View Details](https://drive.google.com/open?id=1XyInsFEpnCZVq09nZERPS60bH7QADOtO)",
  },
  {
    timestamp: "1/18/2024 22:14:26",
    email: "u22cs015@coed.svnit.ac.in",
    name: "Nasir Mansuri",
    achievement:
      "Contributed significantly to the Mindbend Design Committee, showcasing dedication and expertise in design. Nasir's valuable contributions have played a pivotal role in the committee's success. Looking forward to achieving more milestones with NEXUS.",
    imageLink: "1f23by41XicpzlxlAQPsHZ4c6BiQE-lAw",
    additionalLink: "",
  },
];

const Achievements = () => {
  return (
    <div className="mx-auto mb-48 max-w-7xl">
      <Title>Departmental Achievements</Title>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-10">
        {achievements.map((el, ind) => (
          <div
            key={el.timestamp}
            className={`flex w-[90%] flex-col rounded-lg shadow-md shadow-blue-800/75  sm:w-3/4 md:h-4/5 ${
              ind % 2 ? "md:flex-row-reverse" : "md:flex-row"
            } md:gap-4 `}
          >
            <div>
              <img
                src={
                  `https://lh3.googleusercontent.com/d/${el.imageLink}` ??
                  "https://images.pexels.com/photos/1097930/pexels-photo-1097930.jpeg?auto=compress&cs=tinysrgb&w=800"
                }
                alt="Banner"
                className="max-h-60  w-full rounded-t-lg object-cover object-center sm:max-h-[20rem] md:max-h-[18rem] md:w-[30rem]"
              />
            </div>

            <div className="mb-4 mt-4 flex flex-1 flex-col items-center justify-evenly gap-4 overflow-hidden px-4 py-2">
              <p className="line-clamp-3 w-4/5 text-center font-mono text-sm font-semibold text-green-600 sm:text-base md:line-clamp-none md:text-lg">
                {el.achievement}
              </p>
              <p className="w-3/4 text-center text-xs sm:text-base">
                -{el.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
