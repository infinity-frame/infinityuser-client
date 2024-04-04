import { useState, useEffect } from "react";
import {
  register,
  trySignInWithRefreshToken,
  logout,
  changeEmail,
} from "../../src/main";
import auth from "./config/auth";

function App() {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      await register(auth, email, password);
      setCurrentUser(auth.currentUser);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailChange = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      await changeEmail(auth, email, password);
      setCurrentUser(auth.currentUser);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const signIn = async () => {
      try {
        await trySignInWithRefreshToken(auth);
        setCurrentUser(auth.currentUser);
      } catch (error) {
        console.error(error);
      }
    };

    signIn();
  }, []);

  return (
    <>
      {currentUser ? (
        <>
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

          <h2>Logout</h2>
          <button onClick={handleLogout}>Logout</button>

          <h2>Current user</h2>
          <pre>{JSON.stringify(currentUser, null, 2)}</pre>
        </>
      ) : (
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
        </>
      )}
    </>
  );
}

export default App;
