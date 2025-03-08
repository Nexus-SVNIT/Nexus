import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  // Add new effect to handle initial auth check
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const redirectTo = validateRedirectPath(searchParams.get('redirect_to'));
      navigate(redirectTo);
    }
  }, []);

  // Add new utility function for path validation
  const validateRedirectPath = (path) => {
    if (!path) return '/core/admin';
    // Only allow relative paths starting with /
    if (!path.startsWith('/')) return '/core/admin';
    // Remove any potential harmful characters
    return path.replace(/[^\w\-\/]/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginInfo.email || !loginInfo.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Logging in...");

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/core/login`, loginInfo);
      
      const token = response.data.token;
      Cookies.set("token", token, { expires: 1 / 24 });
      localStorage.setItem('core-token', token);
      localStorage.setItem('core-token-exp', Date.now() + 3600000);
      
      toast.dismiss(loadingToast);
      toast.success("Login successful!");
      
      const redirectTo = validateRedirectPath(searchParams.get('redirect_to'));
      navigate(redirectTo);
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage = error.response?.status === 400 ? "Invalid email or password" :
                          error.response?.status === 429 ? "Too many attempts. Please try again later" :
                          !navigator.onLine ? "No internet connection" :
                          "An error occurred. Please try again";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
              Welcome Core Member,
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

              <button 
                disabled={isLoading}
                className={`bg-primary text-gray flex w-full justify-center rounded p-3 font-medium ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
