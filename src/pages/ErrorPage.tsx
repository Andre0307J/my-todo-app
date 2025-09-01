import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";
import styles from "../styles/ErrorPage.module.css";
import { BiError } from "react-icons/bi";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRef, useState } from "react";
import { MdRefresh } from "react-icons/md";

export default function ErrorPage() {
  const [retrying, setRetrying] = useState(false);
  const error = useRouteError();
  const navigate = useNavigate();
  const retryCount = useRef(0);

  useEffect(() => {
    if (error) {
      console.error("Error Details:", error);
    }
  }, [error]);

  const maxRetries = 3;
  const handleRetry = async () => {
    setRetrying(true);
    toast(`Retrying... (${retryCount.current + 1}/${maxRetries})`);
    setTimeout(() => {
      if (retryCount.current < maxRetries) {
        navigate(0); // 🔄 Reload the current route
        retryCount.current++;
        setRetrying(false);
      } else {
        toast.error("Max retries reached. Please try again later.");
        setRetrying(false);
      }
    }, 500); // simulates network request delay
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
          ? `HTTP ${error.status}: ${error.statusText}`
          : error instanceof Error
            ? error.message
            : "An unexpected error occurred."}
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
