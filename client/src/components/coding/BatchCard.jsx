import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-3 w-3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

export function BatchCard({ batch, avgCodeforcesRating, avgLeetcodeRating, avgLeetcodeSolved, avgCodechefRating }) {
  return (
    <Card color="gray" variant="gradient" className="w-full max-w-[20rem] p-8 relative transform -translate-y-2 overflow-hidden border-2 border-transparent">
      <style>
        {`
          @keyframes moveLight {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-moveLight {
            animation: moveLight 3s linear infinite;
          }
        `}
      </style>
      <div className="absolute top-0 left-0 w-full h-full border-2 border-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent animate-moveLight"></div>
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 mb-8 rounded-none border-b border-white/10 pb-8 text-center"
      >
        <Typography variant="small" color="white" className="font-bold uppercase">
          Batch {batch}
        </Typography>
      </CardHeader>
      <CardBody className="p-0">
        <ul className="flex flex-col gap-4">
          <li className="flex items-center gap-4">
            <CheckIcon />
            <Typography className="font-bold">Codeforces Avg Rating: {avgCodeforcesRating}</Typography>
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon />
            <Typography className="font-bold">LeetCode Avg Rating: {avgLeetcodeRating}</Typography>
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon />
            <Typography className="font-bold">LeetCode Avg Solved: {avgLeetcodeSolved}</Typography>
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon />
            <Typography className="font-bold">CodeChef Avg Rating: {avgCodechefRating}</Typography>
          </li>
        </ul>
      </CardBody>
    </Card>
  );
}