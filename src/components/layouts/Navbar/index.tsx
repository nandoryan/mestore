import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./Navbar.module.scss";
const Navbar = () => {
  const { data } = useSession();
  return (
    <div className={styles.navbar}>
      {data && data.user ? (
        <div className={styles.navbar__logo}>
          Selamat datang: {data.user.fullname}
        </div>
      ) : (
        <div className={styles.navbar__logo}>
          <h1>mestore</h1>
        </div>
      )}
      <button
        className={styles.navbar__button}
        onClick={() => {
          data ? signOut() : signIn();
        }}
      >
        {data ? `Logout (${data.user.email})` : "Login"}
      </button>
    </div>
  );
};

export default Navbar;
