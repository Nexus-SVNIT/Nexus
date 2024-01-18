import React from "react";

const Button = ({
  isButton = false,
  to,
  children,
  variant = "primary",
  isDisabled = false,
}) => {
  const classNames = [
    "font-semibold border border-blue-700 px-4 py-2 w-full transition-all duration-300",
    variant === "primary"
      ? " outline-none bg-blue-700 rounded-md text-white hover:bg-transparent hover:text-blue-700"
      : " bg-transparent rounded-md text-blue-700 hover:bg-blue-700 hover:text-white",
  ].join("");
  return isButton ? (
    <button
      className={classNames}
      onClick={() => (window.location.href = to)}
      disabled={isDisabled}
    >
      {children}
    </button>
  ) : (
    <a
      className="my-4 w-fit rounded-md border border-blue-700/10 bg-blue-700/75 px-8 py-3 transition-colors  hover:border-white/100 hover:bg-transparent active:scale-95 "
      href={to}
    >
      {children}
    </a>
  );
};

export default Button;
