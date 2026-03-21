import React from "react";

const Button = ({
  isButton = false,
  to,
  children,
  variant = "primary",
  isDisabled = false,
  className = "",
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl active:scale-95";
  
  const primaryClasses = "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 border border-white/10 hover:border-white/20";
  
  const secondaryClasses = "bg-zinc-900/50 backdrop-blur-md border border-zinc-700/50 hover:bg-zinc-800/80 hover:border-orange-500/50 text-zinc-300 hover:text-orange-400 hover:-translate-y-0.5 shadow-sm";

  // Retain legacy override structures
  const sizingClasses = className.includes("p-") || className.includes("px-") ? "" : "px-6 py-2.5 w-full";
  const anchorSizingClasses = className.includes("p-") || className.includes("px-") ? "" : "px-8 py-3 w-fit";
  
  const variantClasses = variant === "primary" ? primaryClasses : secondaryClasses;
  
  return isButton ? (
    <button
      className={`${baseClasses} ${variantClasses} ${sizingClasses} ${className}`.trim()}
      onClick={() => (window.location.href = to)}
      disabled={isDisabled}
    >
      {children}
    </button>
  ) : (
    <a
      className={`my-4 ${baseClasses} ${variantClasses} ${anchorSizingClasses} ${className}`.trim()}
      href={to}
    >
      {children}
    </a>
  );
};

export default Button;
