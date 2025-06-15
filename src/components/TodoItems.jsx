import { Link } from "react-router-dom";
import styles from "../styles/TodoItem.module.css";
import { FaUser, FaCheckCircle } from "react-icons/fa";

export default function TodoItem({ todo }) {
  return (
    <Link to={`/todos/${todo.id}`} className={styles.card}>
      <h3>{todo.todo}</h3>
      <p>
        <strong>ID:</strong> {todo.id}
      </p>
      <p className={styles.flexRow}>
        <FaCheckCircle color={todo.completed ? "green" : "#ddd"} />
        <strong> Status:</strong> {todo.completed ? "Completed" : "Incomplete"}
      </p>
      <p className={styles.flexRow}>
        <FaUser /> <strong>User ID:</strong> {todo.userId}
      </p>
    </Link>
  );
}
