import { Outlet, NavLink } from "react-router-dom";
import styles from "../styles/MainLayout.module.css";
import { MdHome } from "react-icons/md";
import clsx from "clsx";

export default function MainLayout() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Todo App</h1>
        <nav>
          <NavLink
            to="/"
            className={({ isActive }) => clsx(styles.navLink, { [styles.active]: isActive })}
          >
            <MdHome size={20} />
            Home
          </NavLink>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
