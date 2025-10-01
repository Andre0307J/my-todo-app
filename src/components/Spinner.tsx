type SpinnerSize = "small" | "medium" | "large";

interface SpinnerProps {
  size?: SpinnerSize;
}

export default function Spinner({ size = "medium" }: SpinnerProps) {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-4",
    large: "h-12 w-12 border-4",
  };

  const spinnerClasses = [
    "animate-spin",
    "rounded-full",
    "border-solid",
    "border-primary",
    "border-t-transparent",
    sizeClasses[size],
  ].join(" ");

  return (
    <div className={spinnerClasses} aria-label="Loading" role="status" />
  );
}
