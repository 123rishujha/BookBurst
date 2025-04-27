export const MyButton = ({
  variant = "contained",
  className = "",
  size = "medium",
  fullWidth = false,
  startIcon,
  endIcon,
  isLoading = false,
  disabled = false,
  ...props
}) => {
  const buttonVariants = {
    contained: "bg-[var(--primary)] text-white hover:bg-[var(--secondary)]",
    outlined:
      "border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white",
    text: "text-[var(--primary)] hover:bg-opacity-10 hover:bg-[var(--primary)]",
    secondary:
      "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
  };

  const buttonSizes = {
    small: "px-3 py-1 text-sm min-h-[32px]",
    medium: "px-4 py-2 min-h-[40px]",
    large: "px-6 py-2.5 min-h-[48px]",
  };

  const loadingSpinner = (
    <svg
      className="animate-spin h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <button
      className={`
        rounded-lg flex items-center cursor-pointer ${
          // startIcon || isLoading ? "justify-start" : "justify-center"
          "justify-center"
        }
        gap-2 transition-all duration-200 font-medium
        ${buttonVariants[variant]} 
        ${buttonSizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
      disabled={disabled || isLoading}
      style={props.style || {}}
      {...props}
    >
      {isLoading ? (
        <>
          {loadingSpinner}
          {props.children && <span>{props.loadingText || props.children}</span>}
        </>
      ) : (
        <>
          {startIcon && startIcon}
          {props.children}
          {endIcon && endIcon}
        </>
      )}
    </button>
  );
};
