import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import styles from "../styles/ErrorPage.module.css";
import { BiError } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { MdRefresh } from "react-icons/md";

export default function ErrorPage() {
  const [retrying, setRetrying] = useState(false);
  const error = useRouteError();
  const navigate = useNavigate();

  const handleRetry = () => {
    setRetrying(true);
    toast("Retrying...");
    setTimeout(() => {
      navigate(0); // 🔄 Reload the current route
      setRetrying(false);
    }, 500); // Delay to show the toast message
  };

  return (
    <div className={styles.error}>
      {/* <img
        src="https://illustrations.popsy.co/gray/web-error.svg"
        alt="Error illustration"
        className={styles.image}
      /> */}
      <BiError className={styles.icon} size={72} />

      <h1>Oops, something went wrong.</h1>

      <p className={styles.message}>
        {isRouteErrorResponse(error)
          ? `${error.status} – ${error.statusText}`
          : error?.message || "Unexpected application error."}
      </p>

      <div className={styles.actions}>
        <button onClick={handleRetry} disabled={retrying}>
          {retrying ? "Retrying..." : (<><MdRefresh /> Retry</>)}
        </button>
        <button onClick={() => navigate("/")}>🏠 Go Home</button>
      </div>
    </div>
  );
}
