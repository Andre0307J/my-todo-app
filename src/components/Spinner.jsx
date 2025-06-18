import styles from "../styles/Spinner.module.css";

export default function Spinner({ size = 48 }) {
  return (
    <div
      className={styles.spinner}
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  );
}
