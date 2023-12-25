import { useRouter } from "next/router";
import styles from "./Register.module.scss";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FormEvent, useState } from "react";

const RegisterView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { push } = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    const form = event.target as HTMLFormElement;
    const data = {
      email: form.email.value,
      fullname: form.fullname.value,
      phone: form.phone.value,
      password: form.password.value,
    };

    const result = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (result.status === 200) {
      // Registrasi berhasil, simpan notifikasi sementara di localStorage
      localStorage.setItem(
        "registrationNotification",
        "Registrasi berhasil! Silakan login."
      );
      form.reset();
      setIsLoading(false);
      push("/auth/login");
      // Tampilkan notifikasi sukses
      toast.success("Registrasi berhasil!");
    } else {
      setIsLoading(false);
      setError("Email is already registered");
      toast.error("Email is already registered");
      console.log("error");
    }
  };
  return (
    <div className={styles.register}>
      <h1 className={styles.register__title}>Register</h1>
      {error && <p className={styles.register__error}>{error}</p>}
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

      <div className={styles.register__form}>
        <form onSubmit={handleSubmit}>
          <div className={styles.register__form__item}>
            <label htmlFor="email">Email</label>
            <input
              name="email"
              id="email"
              type="email"
              className={styles.register__form__item__input}
            />
          </div>
          <div className={styles.register__form__item}>
            <label htmlFor="fullname">Fullname</label>
            <input
              name="fullname"
              id="fullname"
              type="text"
              className={styles.register__form__item__input}
            />
          </div>

          <div className={styles.register__form__item}>
            <label htmlFor="phone">Phone</label>
            <input
              name="phone"
              id="phone"
              type="text"
              className={styles.register__form__item__input}
            />
          </div>

          <div className={styles.register__form__item}>
            <label htmlFor="password">Password</label>
            <input
              name="password"
              id="password"
              type="password"
              className={styles.register__form__item__input}
            />
          </div>

          <button type="submit" className={styles.register__form__button}>
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>
      </div>
      <p className={styles.register__link}>
        Have an account? Sign in <Link href="/auth/login">here</Link>
      </p>
    </div>
  );
};

export default RegisterView;
