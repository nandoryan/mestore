import { useRouter } from "next/router";
import styles from "./Login.module.scss";
import Link from "next/link";

import { FormEvent, useState, useEffect } from "react";
import { signIn } from "next-auth/react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { push, query } = useRouter();

  const callbackUrl: any = query.callbackUrl || "/";

  useEffect(() => {
    // Ambil notifikasi dari local storage (diberikan dari halaman register)
    const notification = localStorage.getItem("registrationNotification");

    // Hapus notifikasi dari local storage
    localStorage.removeItem("registrationNotification");

    // Jika notifikasi ada, tampilkan menggunakan toast
    if (notification) {
      toast.success(notification);
    }
  }, []); // Efek ini hanya dijalankan sekali setelah komponen dipasang
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    const form = event.target as HTMLFormElement;
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: form.email.value,
        password: form.password.value,
        callbackUrl,
      });
      if (!res?.error) {
        setIsLoading(false);
        form.reset();
        push(callbackUrl);
      } else {
        setIsLoading(false);
        setError("Email or password is incorrect");
      }
    } catch (error) {
      setIsLoading(false);
      setError("Email or password is incorrect");
    }
  };
  return (
    <div className={styles.login}>
      <h1 className={styles.login__title}>Login</h1>
      {error && <p className={styles.login__error}>{error}</p>}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className={styles.login__form}>
        <form onSubmit={handleSubmit}>
          <div className={styles.login__form__item}>
            <label htmlFor="email">Email</label>
            <input
              name="email"
              id="email"
              type="email"
              className={styles.login__form__item__input}
            />
          </div>

          <div className={styles.login__form__item}>
            <label htmlFor="password">Password</label>
            <input
              name="password"
              id="password"
              type="password"
              className={styles.login__form__item__input}
            />
          </div>

          <button type="submit" className={styles.login__form__button}>
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
        <hr className={styles.login__form__devider} />
        <div className={styles.login__form__other}>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl, redirect: false })}
            className={styles.login__form__other__button}
          >
            <i className="bx bxl-google" />
            Login with Google
          </button>
        </div>
      </div>
      <p className={styles.login__link}>
        Don{"'"}t have an account? Sign up{" "}
        <Link href="/auth/register">here</Link>
      </p>
    </div>
  );
};

export default LoginView;
