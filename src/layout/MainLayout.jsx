import { Outlet, NavLink } from "react-router-dom";
import styles from "../styles/MainLayout.module.css";
import { MdHome } from "react-icons/md";

export default function MainLayout() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Todo App</h1>
        <nav>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            <MdHome size={20} />
            Home
          </NavLink>
          {/* <NavLink
            to="/error-test"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Test Error
          </NavLink> */}
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
