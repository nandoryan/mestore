import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./Navbar.module.scss";

type UserType = {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  fullname?: string | null | undefined;
};

type ComponentProps = {
  data?: {
    user?: UserType | null | undefined;
  };
};

const Navbar: React.FC<ComponentProps> = ({ data: propData }) => {
  const { data: sessionData } = useSession(); // Use a different name for clarity

  return (
    <div className={styles.navbar}>
      {sessionData && sessionData.user ? (
        <div className={styles.navbar__logo}>
          Selamat datang: {sessionData.user.name}
        </div>
      ) : (
        <div className={styles.navbar__logo}>
          <h1>mestore</h1>
        </div>
      )}
      <button
        className={styles.navbar__button}
        onClick={() => {
          if (sessionData && sessionData.user) {
            signOut();
          } else {
            signIn();
          }
        }}
      >
        {sessionData && sessionData.user && sessionData.user.email
          ? `Logout (${sessionData.user.email})`
          : "Login"}
      </button>
    </div>
  );
};

export default Navbar;
