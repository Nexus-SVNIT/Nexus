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
    <Card color="blue-gray" className="w-full max-w-[20rem] p-8 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 mb-8 rounded-none border-b border-blue-gray-100 pb-8 text-center"
      >
        <Typography variant="h5" color="blue-gray" className="font-bold">
          Batch {batch}
        </Typography>
      </CardHeader>
      <CardBody className="p-0">
        <ul className="flex flex-col gap-4">
          <li className="flex items-center gap-4">
            <CheckIcon />
            <Typography className="font-normal text-blue-gray-800">Codeforces Avg Rating: {avgCodeforcesRating}</Typography>
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon />
            <Typography className="font-normal text-blue-gray-800">LeetCode Avg Rating: {avgLeetcodeRating}</Typography>
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon />
            <Typography className="font-normal text-blue-gray-800">LeetCode Avg Solved: {avgLeetcodeSolved}</Typography>
          </li>
          <li className="flex items-center gap-4">
            <CheckIcon />
            <Typography className="font-normal text-blue-gray-800">CodeChef Avg Rating: {avgCodechefRating}</Typography>
          </li>
        </ul>
      </CardBody>
    </Card>
  );
}