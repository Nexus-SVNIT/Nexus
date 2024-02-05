import { useState } from "react";

function FormIntroAdmin(props) {
  const [publishState, setPublishState] = useState(props.form.publish);
  return (
    <div className="border-stroke px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark flex w-[20rem] flex-col justify-between rounded-sm  border bg-white py-6 sm:w-[22rem] md:w-[24rem]">
      <div className="flex text-lg">{props.form.name}</div>
      <div className="mt-4 flex items-center justify-between ">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {props.form.responseCount}
          </h4>
          <span className="text-sm font-medium">Total Registration</span>
        </div>

        <span
          className="text-meta-5 flex cursor-pointer items-center gap-1 text-sm font-medium"
          onClick={(e) => setPublishState(!publishState)}
        >
          Status:
          {publishState ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="40"
                height="40"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#c8e6c9"
                  d="M36,42H12c-3.314,0-6-2.686-6-6V12c0-3.314,2.686-6,6-6h24c3.314,0,6,2.686,6,6v24C42,39.314,39.314,42,36,42z"
                ></path>
                <path
                  fill="#4caf50"
                  d="M34.585 14.586L21.014 28.172 15.413 22.584 12.587 25.416 21.019 33.828 37.415 17.414z"
                ></path>
              </svg>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="40"
                height="40"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#c8e6c9"
                  d="M36,42H12c-3.3,0-6-2.7-6-6V12c0-3.3,2.7-6,6-6h24c3.3,0,6,2.7,6,6v24C42,39.3,39.3,42,36,42z"
                ></path>
              </svg>
            </>
          )}
        </span>
      </div>
    </div>
  );
}

export default FormIntroAdmin;
