import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const infinityFetch = async (auth, path, method, body) => {
  try {
    if (auth.accessToken) {
      const decodedToken = jwtDecode(auth.accessToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        const refreshToken = auth.cookies.get("refreshToken");
        if (!refreshToken) {
          throw new Error("refreshToken is required");
        }

        const response = await fetch(auth.authApiPath + "/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw data;
        }

        auth.cookies.set("refreshToken", data.refreshToken, { path: "/" });
        auth.accessToken = data.accessToken;
      }

      const response = await fetch(path, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify(body),
      });
      return response;
    } else {
      const response = await fetch(path, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      return response;
    }
  } catch (error) {
    throw error;
  }
};

const trySignInWithRefreshToken = async (auth) => {
  const refreshToken = auth.cookies.get("refreshToken");

  if (!refreshToken || auth.currentUser) {
    return null;
  }

  try {
    const response = await fetch(auth.authApiPath + "/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    auth.cookies.set("refreshToken", data.refreshToken, { path: "/" });
    auth.currentUser = data.user;
    auth.accessToken = data.accessToken;

    return data.user;
  } catch (error) {
    throw error;
  }
};

const initAuth = ({ authApiPath }) => {
  if (!authApiPath) {
    throw new Error("authApiPath is required");
  }

  const cookies = new Cookies();

  return {
    authApiPath,
    cookies,
    currentUser: null,
    accessToken: null,
  };
};

const register = async (auth, email, password) => {
  try {
    const response = await fetch(auth.authApiPath + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    auth.cookies.set("refreshToken", data.refreshToken, { path: "/" });
    auth.currentUser = data.user;
    auth.accessToken = data.accessToken;

    return data.user;
  } catch (error) {
    throw error;
  }
};

export { infinityFetch, initAuth, register, trySignInWithRefreshToken };
