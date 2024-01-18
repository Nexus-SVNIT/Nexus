import React from "react";
import Title from "../Title/Title";
const Array = [
  {
    timestamp: "1/11/2024 19:23:11",
    email: "u22cs109@coed.svnit.ac.in",
    name: "Aasutosh Baraiya _ U22CS109",
    achievement:
      "Won 1st Prize in Art and Reel Making Competition - ARTFLIX. In this competition, we had to show some creativity in it. So, we created an art of a dog listening to music on a t-shirt.",
    imageLink:
      "https://drive.google.com/open?id=1o8Wr4QDKThfmo25ZnceA_2fPuNhlGJwP",
    additionalLink:
      "https://drive.google.com/open?id=1XyInsFEpnCZVq09nZERPS60bH7QADOtO",
  },
  {
    timestamp: "1/13/2024 11:46:46",
    email: "u22cs018@coed.svnit.ac.in",
    name: "Suchi Desai_U22CS018, Preesha Sheth_U22CS068, Shambhavi Shinde_U22CS09",
    achievement:
      "First place in the Sports Mania Inter-Year tournament for the sport of Table Tennis",
    imageLink:
      "https://drive.google.com/open?id=1MxfOFpwu4w-w43hLRWT3MfkcC-30OZMB",
    additionalLink:
      "https://drive.google.com/open?id=1r6O93TXMCE-yVQiJiPrBNl44L3YMSbQ1",
  },
];
const Achievements = () => {
  return (
    <div className="mx-auto mb-48 max-w-7xl">
      <Title>Departmental Achievements</Title>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        {Array.map((el) => (
          <div
            key={el.timestamp}
            className="flex h-[20rem] w-4/5  rounded-md border "
          >
            <div>
              <img
                src="https://classroomclipart.com/image/static7/preview2/achievement-trophy-surrounded-by-stars-clip-art-59657.jpg"
                alt=""
                className="h-[20rem] w-[20rem]"
              />
            </div>
            <div className="flex flex-1 flex-col items-center justify-around px-4 py-2">
              <p>{el.name}</p>
              <p className="w-3/4">{el.achievement}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
