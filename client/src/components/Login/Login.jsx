import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
const Login = () => {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      loginInfo.email === "u21cs047@coed.svnit.ac.in" &&
      loginInfo.password === "u21cs047"
    ) {
      localStorage.setItem("token", "you are permitted");
      navigate("/admin");
    } else {
      toast.error("Please provide correct credentials.");
    }
  };
  useLayoutEffect(() => {
    if (localStorage?.getItem("token")?.length) {
      navigate("/admin", { replace: true });
    }
  });
  return (
    <div className="bg-boxdark-2 flex h-screen w-screen flex-col items-center justify-center gap-6">
      <img
        src="/assets/NEXUStext.png"
        alt="NEXUS"
        className="flex w-[20rem] items-center object-cover"
      />
      <div className="flex w-3/4 flex-col gap-9 md:w-1/2">
        {/* <!-- Sign In Form --> */}

        <div className="border-stroke shadow-default dark:border-strokedark dark:bg-boxdark rounded-sm border bg-white">
          <div className="border-stroke px-6.5 dark:border-strokedark border-b py-4">
            <h3 className="font-medium text-white dark:text-white">
              Welcome Admin,
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="border-stroke focus:border-primary active:border-primary disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded border-[1.5px] bg-transparent px-5 py-3 font-medium  outline-none transition disabled:cursor-default"
                  onChange={(e) =>
                    setLoginInfo({ ...loginInfo, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="border-stroke focus:border-primary active:border-primary disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded border-[1.5px] bg-transparent px-5 py-3 font-medium  outline-none transition disabled:cursor-default"
                  onChange={(e) =>
                    setLoginInfo({ ...loginInfo, password: e.target.value })
                  }
                />
              </div>

              <div className="mb-5.5 mt-5 flex items-center justify-between">
                <label htmlFor="formCheckbox" className="flex cursor-pointer">
                  <div className="relative pt-0.5">
                    <input
                      type="checkbox"
                      id="formCheckbox"
                      className="taskCheckbox sr-only"
                    />
                    <div className="box border-stroke dark:border-strokedark mr-3 flex h-5 w-5 items-center justify-center rounded border">
                      <span className="opacity-0">
                        <svg
                          className="fill-current"
                          width="10"
                          height="7"
                          viewBox="0 0 10 7"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.70685 0.292804C9.89455 0.480344 10 0.734667 10 0.999847C10 1.26503 9.89455 1.51935 9.70685 1.70689L4.70059 6.7072C4.51283 6.89468 4.2582 7 3.9927 7C3.72721 7 3.47258 6.89468 3.28482 6.7072L0.281063 3.70701C0.0986771 3.5184 -0.00224342 3.26578 3.785e-05 3.00357C0.00231912 2.74136 0.10762 2.49053 0.29326 2.30511C0.4789 2.11969 0.730026 2.01451 0.992551 2.01224C1.25508 2.00996 1.50799 2.11076 1.69683 2.29293L3.9927 4.58607L8.29108 0.292804C8.47884 0.105322 8.73347 0 8.99896 0C9.26446 0 9.51908 0.105322 9.70685 0.292804Z"
                            fill=""
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <p className="text-white">Remember me</p>
                </label>

                <Link href="#" className="text-primary text-sm">
                  Forget password?
                </Link>
              </div>

              <button className="bg-primary text-gray flex w-full justify-center rounded p-3 font-medium">
                Sign In
              </button>
            </div>
          </form>
        </div>

        {/* <!-- Sign Up Form --> */}
        {/* <div className="border-stroke shadow-default dark:border-strokedark dark:bg-boxdark rounded-sm border bg-white">
        <div className="border-stroke px-6.5 dark:border-strokedark border-b py-4">
          <h3 className="font-medium text-black dark:text-white">
            Sign Up Form
          </h3>
        </div>
        <form action="#">
          <div className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="border-stroke focus:border-primary active:border-primary disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded border-[1.5px] bg-transparent px-5 py-3 font-medium outline-none transition disabled:cursor-default"
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                className="border-stroke focus:border-primary active:border-primary disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded border-[1.5px] bg-transparent px-5 py-3 font-medium outline-none transition disabled:cursor-default"
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="border-stroke focus:border-primary active:border-primary disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded border-[1.5px] bg-transparent px-5 py-3 font-medium outline-none transition disabled:cursor-default"
              />
            </div>

            <div className="mb-5.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Re-type Password
              </label>
              <input
                type="password"
                placeholder="Re-enter password"
                className="border-stroke focus:border-primary active:border-primary disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded border-[1.5px] bg-transparent px-5 py-3 font-medium outline-none transition disabled:cursor-default"
              />
            </div>

            <button className="bg-primary text-gray flex w-full justify-center rounded p-3 font-medium">
              Sign Up
            </button>
          </div>
        </form>
      </div> */}
      </div>
    </div>
  );
};

export default Login;
