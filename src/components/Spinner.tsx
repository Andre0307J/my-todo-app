import styles from "@/styles/Spinner.module.css";

type SpinnerSize = "small" | "medium" | "large";

interface SpinnerProps {
  size?: SpinnerSize;
}

export default function Spinner({ size = "medium" }: SpinnerProps) {
  return (
    <div
      className={`${styles.spinner} ${styles[`spinner--${size}`]}`}
      aria-label="Loading"
    />
  );
}
