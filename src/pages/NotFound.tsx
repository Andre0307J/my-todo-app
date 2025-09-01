import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import styles from "../styles/NotFound.module.css";
import NotFoundImage from "../assets/images/404.jpg"; // Replace with your own image if needed

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.notFound}>
      <img
        src={NotFoundImage}
        alt="Page not found illustration"
        className={styles.image}
      />
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Button className={styles.button} onClick={() => navigate("/")}>
        ⬅ Back to Home
      </Button>
    </div>
  );
}
