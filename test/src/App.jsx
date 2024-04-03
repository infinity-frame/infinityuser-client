import { useState, useEffect } from "react";
import { register, trySignInWithRefreshToken } from "../../src/main";
import auth from "./config/auth";

function App() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      await register(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailChange = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const signIn = async () => {
      try {
        await trySignInWithRefreshToken(auth);
        console.log(auth);
      } catch (error) {
        console.error(error);
      }
    };

    signIn();
  }, []);

  return (
    <>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit">Register</button>
      </form>

      <h2>Change email</h2>
      <form onSubmit={handleEmailChange}>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit">Change email</button>
      </form>
    </>
  );
}

export default App;
