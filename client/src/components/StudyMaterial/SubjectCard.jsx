import React from "react";

const SubjectCard = ({ name, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-white rounded-xl shadow p-4 hover:shadow-md transition"
  >
    <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
  </div>
);

export default SubjectCard;
